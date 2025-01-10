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

export default ancestryDnaParser;
