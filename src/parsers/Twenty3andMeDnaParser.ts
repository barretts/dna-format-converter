const twenty3andMeParser: Parser = (inputData) => {
  return inputData
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => {
      const [rsId, chromosome, position, alleles] = line.trim().split('\t');
      return { rsId, chromosome, position, alleles };
    });
};

export default twenty3andMeParser;
