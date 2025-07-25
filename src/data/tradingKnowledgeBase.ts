export interface TradingDocument {
  id: string;
  title: string;
  content: string;
  category: 'pattern' | 'strategy' | 'indicator' | 'risk_management' | 'psychology';
  tags: string[];
  source?: string;
}

export const TRADING_KNOWLEDGE_BASE: TradingDocument[] = [
  {
    id: 'hammer_pattern',
    title: 'Hammer Candlestick Pattern',
    content: 'A hammer is a bullish reversal pattern that forms during a downtrend. It has a small real body at the upper end of the trading range with a long lower shadow. The lower shadow should be at least twice the size of the real body. This pattern suggests that although selling pressure was significant during the day, buyers eventually pushed the price back up near the opening price. A hammer should be confirmed with a bullish candle the following day.',
    category: 'pattern',
    tags: ['bullish', 'reversal', 'candlestick', 'hammer'],
    source: 'Japanese Candlestick Charting Techniques'
  },
  {
    id: 'doji_pattern',
    title: 'Doji Candlestick Pattern',
    content: 'A Doji forms when the opening and closing prices are virtually equal. This creates a cross-like appearance. Doji are important reversal signals when they appear at market tops or bottoms. They represent indecision in the market between buyers and sellers. The longer the upper and lower shadows, the more significant the Doji. Different types include Long-legged Doji, Dragonfly Doji, and Gravestone Doji.',
    category: 'pattern',
    tags: ['neutral', 'reversal', 'indecision', 'doji'],
    source: 'Japanese Candlestick Charting Techniques'
  },
  {
    id: 'engulfing_pattern',
    title: 'Engulfing Patterns',
    content: 'Engulfing patterns are two-candle reversal patterns. A bullish engulfing pattern occurs when a large white candlestick completely engulfs the previous day\'s small black candlestick during a downtrend. A bearish engulfing pattern is the opposite - a large black candlestick engulfs the previous white candlestick during an uptrend. The engulfing candle should have a real body that completely contains the real body of the previous candle.',
    category: 'pattern',
    tags: ['bullish', 'bearish', 'reversal', 'engulfing'],
    source: 'Japanese Candlestick Charting Techniques'
  },
  {
    id: 'morning_star',
    title: 'Morning Star Pattern',
    content: 'The Morning Star is a three-candlestick bullish reversal pattern that appears at the bottom of downtrends. It consists of: 1) A long bearish candle, 2) A small-bodied candle (can be bullish or bearish) that gaps down, 3) A long bullish candle that closes well into the first candle\'s body. The middle candle represents indecision, while the third candle confirms the reversal. This pattern suggests that selling pressure is diminishing and buyers are taking control.',
    category: 'pattern',
    tags: ['bullish', 'reversal', 'three-candle', 'morning-star'],
    source: 'Japanese Candlestick Charting Techniques'
  },
  {
    id: 'rsi_strategy',
    title: 'RSI Trading Strategy',
    content: 'The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of price changes. RSI oscillates between 0 and 100. Traditionally, RSI is considered overbought when above 70 and oversold when below 30. However, during strong trends, RSI can remain in overbought or oversold territories for extended periods. RSI divergence occurs when price makes new highs/lows but RSI fails to confirm, often signaling potential reversals.',
    category: 'indicator',
    tags: ['rsi', 'momentum', 'overbought', 'oversold', 'divergence'],
    source: 'Technical Analysis of Financial Markets'
  },
  {
    id: 'macd_strategy',
    title: 'MACD Trading Strategy',
    content: 'The Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator. It consists of the MACD line (12-period EMA minus 26-period EMA), signal line (9-period EMA of MACD line), and histogram (MACD minus signal line). Buy signals occur when MACD crosses above the signal line, especially when both are below zero. Sell signals occur when MACD crosses below the signal line, especially when both are above zero. Divergence between MACD and price can signal potential reversals.',
    category: 'indicator',
    tags: ['macd', 'trend', 'momentum', 'crossover', 'divergence'],
    source: 'Technical Analysis of Financial Markets'
  },
  {
    id: 'support_resistance',
    title: 'Support and Resistance Levels',
    content: 'Support is a price level where a downtrend can be expected to pause due to a concentration of demand. Resistance is a price level where an uptrend can be expected to pause due to a concentration of supply. These levels are created by previous highs and lows, round numbers, moving averages, and Fibonacci retracements. When support is broken, it often becomes resistance, and vice versa. The more times a level is tested, the stronger it becomes.',
    category: 'strategy',
    tags: ['support', 'resistance', 'levels', 'demand', 'supply'],
    source: 'Technical Analysis of Financial Markets'
  },
  {
    id: 'risk_management',
    title: 'Risk Management Principles',
    content: 'Effective risk management is crucial for long-term trading success. Key principles include: 1) Never risk more than 1-2% of your account on a single trade, 2) Use stop-loss orders to limit downside risk, 3) Maintain a positive risk-reward ratio (aim for at least 1:2), 4) Diversify across different assets and strategies, 5) Size positions based on volatility and account size, 6) Have a predefined exit strategy before entering trades. Risk management is more important than being right about market direction.',
    category: 'risk_management',
    tags: ['risk', 'stop-loss', 'position-sizing', 'diversification'],
    source: 'Market Wizards'
  },
  {
    id: 'trading_psychology',
    title: 'Trading Psychology',
    content: 'Psychology plays a crucial role in trading success. Common psychological biases include: Fear of missing out (FOMO), overconfidence after wins, revenge trading after losses, and holding losing positions too long while cutting winners short. Successful traders develop emotional discipline through: maintaining a trading journal, following a systematic approach, accepting losses as part of the process, and staying patient for high-probability setups. Mental preparation and emotional control often determine long-term success more than technical skills.',
    category: 'psychology',
    tags: ['psychology', 'emotions', 'discipline', 'biases'],
    source: 'Trading in the Zone'
  },
  {
    id: 'trend_following',
    title: 'Trend Following Strategy',
    content: 'Trend following is based on the principle that prices tend to move in trends that persist over time. Key concepts include: identifying the primary trend using moving averages or trendlines, entering positions in the direction of the trend, using pullbacks as entry opportunities, and staying in trades until the trend shows signs of reversal. Popular trend following indicators include moving average crossovers, breakouts from consolidation patterns, and momentum indicators. The key is to let profits run while cutting losses short.',
    category: 'strategy',
    tags: ['trend', 'following', 'momentum', 'breakouts'],
    source: 'Trend Following'
  },
  {
    id: 'fibonacci_retracements',
    title: 'Fibonacci Retracements',
    content: 'Fibonacci retracements are horizontal lines that indicate where support and resistance are likely to occur. They are based on Fibonacci numbers and key ratios: 23.6%, 38.2%, 50%, 61.8%, and 78.6%. Traders use these levels to identify potential reversal points in trending markets. The most significant retracement levels are 38.2% and 61.8%. If price retraces beyond 78.6%, the original trend may be reversing. Fibonacci levels work best when combined with other technical analysis tools.',
    category: 'indicator',
    tags: ['fibonacci', 'retracement', 'support', 'resistance'],
    source: 'Technical Analysis of Financial Markets'
  }
];

// Categories for organizing knowledge
export const KNOWLEDGE_CATEGORIES = {
  pattern: 'Candlestick Patterns',
  strategy: 'Trading Strategies', 
  indicator: 'Technical Indicators',
  risk_management: 'Risk Management',
  psychology: 'Trading Psychology'
} as const;