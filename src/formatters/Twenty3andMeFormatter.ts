const twenty3andMeFormatter: LineFormatter = ({ rsId, chromosome, position, alleles }) => {
  return `${rsId}\t${chromosome}\t${position}\t${alleles}`;
};

export default twenty3andMeFormatter;
