import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from 'yargs';

// Reformat data based on the provided parser and formatter.
const reformatData = async (inputData: string, parser: Parser, lineFormatter: LineFormatter) => {
  const parsedData = parser(inputData);

  let outputFileContent = '';
  for (const entry of parsedData) {
    const formattedLine = lineFormatter(entry);
    if (formattedLine !== null) {
      outputFileContent += `${formattedLine}\n`;
    }
  }

  return outputFileContent;
};

// Parser for AncestryDNA format.
const twenty3andMeParser: Parser = (inputData) => {
  return inputData
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => {
      const [rsId, chromosome, position, alleles] = line.trim().split('\t');
      return { rsId, chromosome, position, alleles };
    });
};

// Parser for Twenty3andMe format.
const ancestryDnaParser: Parser = (inputData) => {
  return inputData
    .split('\n')
    .filter((line) => !line.startsWith('#') && line.includes('\t'))
    .map((line) => {
      const [rsId, chromosome, position, allele1, allele2] = line.trim().split('\t');
      return {
        rsId,
        chromosome,
        position,
        alleles: `${allele1[0]}${allele2[0]}`,
      };
    });
};

// Formatter for Twenty3andMe.
const twenty3andMeFormatter: LineFormatter = ({ rsId, chromosome, position, alleles }) => {
  return `${rsId}\t${chromosome}\t${position}\t${alleles}`;
};

// Formatter for AncestryDNA.
const ancestryFormatter: LineFormatter = ({ rsId, chromosome, position, alleles }) => {
  return `${rsId}\t${chromosome}\t${position}\t${alleles[0]}\t${alleles[1]}`;
};

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
