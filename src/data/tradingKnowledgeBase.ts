export interface TradingDocument {
  id: string;
  title: string;
  content: string;
  category: 'pattern' | 'strategy' | 'indicator' | 'risk_management' | 'psychology' | 'options';
  tags: string[];
  source?: string;
}

export const TRADING_KNOWLEDGE_BASE: TradingDocument[] = [
  // Options Trading Fundamentals
  {
    id: 'call_options_basics',
    title: 'Call Options Fundamentals',
    content: 'A call option gives the holder the right, but not obligation, to buy an underlying asset at a specified strike price before expiration. Call options are bullish instruments - you buy calls when expecting the underlying price to rise above the strike price. The breakeven point is strike price plus premium paid. Maximum loss is limited to the premium, while profit potential is theoretically unlimited. Call options increase in value when the underlying stock price rises, time to expiration increases, or implied volatility increases.',
    category: 'options',
    tags: ['call-options', 'bullish', 'options-basics', 'derivatives', 'unlimited-profit'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'put_options_basics', 
    title: 'Put Options Fundamentals',
    content: 'A put option gives the holder the right, but not obligation, to sell an underlying asset at a specified strike price before expiration. Put options are bearish instruments - you buy puts when expecting the underlying price to fall below the strike price. The breakeven point is strike price minus premium paid. Maximum loss is limited to the premium, while maximum profit is strike price minus premium (if stock goes to zero). Put options increase in value when the underlying stock price falls, time to expiration increases, or implied volatility increases.',
    category: 'options',
    tags: ['put-options', 'bearish', 'options-basics', 'derivatives', 'hedging'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'options_time_decay',
    title: 'Options Time Decay (Theta)',
    content: 'Time decay, measured by theta, represents how much an option loses value as time passes. Options are wasting assets - they lose value as expiration approaches, even if the underlying stock price remains unchanged. Time decay accelerates in the final weeks before expiration, especially for at-the-money options. This is why timing is crucial in options trading - being right about direction but wrong about timing can still result in losses. Theta is typically negative for long options positions.',
    category: 'options',
    tags: ['theta', 'time-decay', 'options-greeks', 'options-risk', 'expiration'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'options_implied_volatility',
    title: 'Implied Volatility in Options',
    content: 'Implied volatility (IV) represents the market\'s expectation of future price movement and is a key component of options pricing. High IV increases option premiums, while low IV decreases them. IV typically spikes during earnings announcements, major events, or market uncertainty. Buying options when IV is high can be unprofitable even if you\'re correct about price direction due to volatility crush. Always consider IV rank and percentile - buy options when IV is low and sell when IV is high.',
    category: 'options',
    tags: ['implied-volatility', 'options-pricing', 'vega', 'volatility-crush', 'iv-rank'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'covered_calls_strategy',
    title: 'Covered Call Strategy',
    content: 'A covered call involves owning 100 shares of stock and selling a call option against those shares. This generates income from the premium received but caps upside potential at the strike price. It\'s ideal for neutral to slightly bullish outlooks on stocks you already own. The strategy works best in sideways or slowly rising markets with low volatility. Risk is the stock\'s decline minus premium received. Best practiced on stocks with high option premiums and low expected volatility.',
    category: 'options',
    tags: ['covered-calls', 'income-strategy', 'conservative-options', 'premium-collection', 'capped-upside'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'protective_puts_strategy',
    title: 'Protective Put Strategy',
    content: 'A protective put involves buying put options to hedge long stock positions. It acts like insurance - if the stock falls, the put gains value to offset losses. The cost is the put premium, which acts like an insurance premium. This strategy maintains unlimited upside exposure while limiting downside risk to the strike price minus premium paid. It\'s particularly valuable during uncertain market conditions, earnings announcements, or when holding concentrated positions.',
    category: 'options',
    tags: ['protective-puts', 'hedging', 'risk-management', 'portfolio-protection', 'insurance'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'options_delta_gamma',
    title: 'Options Delta and Gamma',
    content: 'Delta measures how much an option\'s price changes for each $1 move in the underlying stock. Call deltas range from 0 to 1, put deltas from -1 to 0. At-the-money options have deltas around 0.5. Gamma measures the rate of change of delta - it\'s highest for at-the-money options near expiration. High gamma means delta changes rapidly, creating both opportunity and risk. Understanding delta helps with position sizing and hedging, while gamma awareness is crucial for risk management.',
    category: 'options',
    tags: ['delta', 'gamma', 'options-greeks', 'sensitivity', 'hedging-ratio'],
    source: 'Options as a Strategic Investment'
  },
  {
    id: 'options_straddle_strangle',
    title: 'Straddle and Strangle Strategies',
    content: 'A straddle involves buying a call and put with the same strike price and expiration, profiting from large moves in either direction. A strangle uses different strike prices (call higher, put lower), requiring larger moves but costing less. Both strategies profit from increased volatility and benefit from events like earnings. Maximum loss occurs if the stock closes between the strike prices at expiration. These strategies are ideal when expecting big moves but uncertain about direction.',
    category: 'options',
    tags: ['straddle', 'strangle', 'volatility-play', 'earnings-strategy', 'direction-neutral'],
    source: 'Options as a Strategic Investment'
  },

  // Candlestick Patterns
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
  psychology: 'Trading Psychology',
  options: 'Options Trading'
} as const;