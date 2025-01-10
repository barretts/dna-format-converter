// Type definitions for parser and formatter functions.
type DnaRow = {
  rsId: string;
  chromosome: string;
  position: string;
  alleles: string;
};

type Parser = (inputData: string) => DnaRow[];

type LineFormatter = ({ rsId, chromosome, position, alleles }: DnaRow) => string | null;
