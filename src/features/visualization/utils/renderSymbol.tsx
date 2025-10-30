export const renderSymbol = (symbol: string) => {
  const regex = /([^_]+)_([^_]+)_/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(symbol)) !== null) {
    // 앞의 일반 텍스트
    if (match.index > lastIndex) {
      result.push(symbol.slice(lastIndex, match.index));
    }
    // 기호 + sub
    result.push(
      <>
        {match[1]}
        <sub key={key++}>{match[2]}</sub>
      </>
    );
    lastIndex = regex.lastIndex;
  }
  // 남은 일반 텍스트
  if (lastIndex < symbol.length) {
    result.push(symbol.slice(lastIndex));
  }
  return <>{result}</>;
};
