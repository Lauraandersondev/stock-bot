import { useState } from 'react';
import Tesseract from 'tesseract.js';

// Hook to extract stock symbol from uploaded image filename or OCR
export const useSymbolExtraction = () => {
  const [extractedSymbol, setExtractedSymbol] = useState<string>('');

  const commonSymbols = [
    'NFLX', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META',
    'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'BER', 'GLD', 'SLV'
  ];

  const symbolMap: { [key: string]: string } = {
    netflix: 'NFLX',
    apple: 'AAPL',
    microsoft: 'MSFT',
    google: 'GOOGL',
    amazon: 'AMZN',
    tesla: 'TSLA',
  };

  const extractSymbolFromFilename = (file: File): string | null => {
    const filename = file.name.toLowerCase();
    console.log('Extracting symbol from filename:', filename);

    for (const symbol of Object.keys(symbolMap)) {
      if (filename.includes(symbol)) {
        const mapped = symbolMap[symbol];
        console.log('Found company name in filename:', symbol, '->', mapped);
        setExtractedSymbol(mapped);
        return mapped;
      }
    }

    for (const ticker of commonSymbols.map(s => s.toLowerCase())) {
      if (filename.includes(ticker)) {
        console.log('Found ticker in filename:', ticker);
        const upper = ticker.toUpperCase();
        setExtractedSymbol(upper);
        return upper;
      }
    }

    const symbolMatch = filename.match(/([a-z]{1,5})(?:_chart|_candlestick|chart|\.)/i);
    if (symbolMatch && symbolMatch[1].length <= 5) {
      const upper = symbolMatch[1].toUpperCase();
      console.log('Extracted from pattern:', upper);
      setExtractedSymbol(upper);
      return upper;
    }

    return null;
  };

  const extractSymbolFromOCR = async (file: File): Promise<string> => {
    console.log('Falling back to OCR...');
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    console.log('OCR text:', text);

    const uppercaseText = text.toUpperCase();
    for (const symbol of commonSymbols) {
      if (uppercaseText.includes(symbol)) {
        console.log('Found ticker in OCR text:', symbol);
        setExtractedSymbol(symbol);
        return symbol;
      }
    }

    console.log('No match in OCR, defaulting to AAPL');
    setExtractedSymbol('AAPL');
    return 'AAPL';
  };

  const extractSymbolFromFile = async (file: File): Promise<string> => {
    const filenameSymbol = extractSymbolFromFilename(file);
    if (filenameSymbol) return filenameSymbol;

    // Try OCR if filename extraction fails
    return await extractSymbolFromOCR(file);
  };

  const setSymbol = (symbol: string) => {
    setExtractedSymbol(symbol.toUpperCase());
  };

  return {
    extractedSymbol,
    extractSymbolFromFile,
    setSymbol,
  };
};
