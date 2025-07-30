import { useState } from 'react';

// Hook to extract stock symbol from uploaded image filename or user input
export const useSymbolExtraction = () => {
  const [extractedSymbol, setExtractedSymbol] = useState<string>('');

  const extractSymbolFromFile = (file: File): string => {
    const filename = file.name.toLowerCase();
    
    // Common stock symbols to look for in filename
    const commonSymbols = [
      'aapl', 'msft', 'googl', 'amzn', 'tsla', 'nvda', 'meta', 'nflx', 
      'spy', 'qqq', 'iwm', 'dia', 'vti', 'voo', 'ber', 'gld', 'slv',
      'netflix', 'apple', 'microsoft', 'google', 'amazon', 'tesla'
    ];
    
    // Try to find symbol in filename
    for (const symbol of commonSymbols) {
      if (filename.includes(symbol)) {
        // Map company names to symbols
        const symbolMap: { [key: string]: string } = {
          'netflix': 'NFLX',
          'apple': 'AAPL',
          'microsoft': 'MSFT',
          'google': 'GOOGL',
          'amazon': 'AMZN',
          'tesla': 'TSLA'
        };
        const extractedSymbol = symbolMap[symbol] || symbol.toUpperCase();
        setExtractedSymbol(extractedSymbol);
        return extractedSymbol;
      }
    }
    
    // Try to extract pattern like "SYMBOL_chart" or "chart_SYMBOL"
    const symbolMatch = filename.match(/([a-z]{1,5})(?:_chart|_candlestick|chart|\.)/i);
    if (symbolMatch && symbolMatch[1].length <= 5) {
      const symbol = symbolMatch[1].toUpperCase();
      setExtractedSymbol(symbol);
      return symbol;
    }
    
    // Default to AAPL for demo
    setExtractedSymbol('AAPL');
    return 'AAPL';
  };

  const setSymbol = (symbol: string) => {
    setExtractedSymbol(symbol.toUpperCase());
  };

  return {
    extractedSymbol,
    extractSymbolFromFile,
    setSymbol
  };
};