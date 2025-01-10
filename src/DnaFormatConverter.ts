import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from 'yargs';
import ancestryDnaParser from './parsers/AncestryDnaParser';
import twenty3andMeParser from './parsers/Twenty3andMeDnaParser';
import ancestryFormatter from './formatters/AncestryDnaFormatter';
import twenty3andMeFormatter from './formatters/Twenty3andMeFormatter';
import reformatData from './ReformatData';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 -i <inputFile> -o <outputFile> --toFormat <format> [--fromFormat <format>]')
  .option('i', {
    alias: 'input',
    description: 'Input file path',
    type: 'string',
    demandOption: true,
  })
  .option('o', {
    alias: 'output',
    description: 'Output file path',
    type: 'string',
  })
  .option('toFormat', {
    description: 'Output file format (ancestry or 23andme)',
    type: 'string',
    choices: ['ancestry', '23andme'],
  })
  .option('fromFormat', {
    description: 'Input file format (ancestry or 23andme)',
    type: 'string',
    choices: ['ancestry', '23andme'],
  })
  .help().argv;

const inputFile = argv.i;
const outputFormat = argv.toFormat?.toLowerCase() || '23andme';
const inputFormat =
  argv.fromFormat?.toLowerCase() || outputFormat == 'ancestry' ? '23andme' : 'ancestry';
const outputFile =
  argv.o || `${path.basename(inputFile)}_${outputFormat}${path.extname(inputFile)}`;

// Determine parser and formatter based on provided formats.
let parser: Parser;
let lineFormatter: LineFormatter;

switch (inputFormat) {
  case 'ancestry':
    parser = ancestryDnaParser;
    break;
  default:
    parser = twenty3andMeParser;
}

switch (outputFormat) {
  case 'ancestry':
    lineFormatter = ancestryFormatter;
    break;
  default:
    lineFormatter = twenty3andMeFormatter;
}

// Execute conversion.
(async () => {
  const inputData = await fs.readFile(inputFile, 'utf-8');
  const outputFileContent = await reformatData(inputData, parser, lineFormatter);
  await fs.writeFile(outputFile, outputFileContent.trim());
  console.log(`Data reformatted and saved to ${outputFile}`);
})();
