const ancestryFormatter: LineFormatter = ({ rsId, chromosome, position, alleles }) => {
  return `${rsId}\t${chromosome}\t${position}\t${alleles[0]}\t${alleles[1]}`;
};

export default ancestryFormatter;
