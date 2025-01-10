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

export default reformatData;
