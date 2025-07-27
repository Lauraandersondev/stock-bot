import { StockData, TechnicalIndicators } from './stockApi';
import { DetectedPattern } from './patternAnalysis';

export interface BacktestResult {
  symbol: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalReturn: number;
  averageReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  return: number;
  pattern: string;
  action: 'BUY' | 'SELL';
  result: 'WIN' | 'LOSS';
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Simulate historical data fetching (in real app, this would be an API call)
export const fetchHistoricalData = async (symbol: string, days: number = 252): Promise<HistoricalData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock historical data for demonstration
  const data: HistoricalData[] = [];
  const basePrice = 100 + Math.random() * 100;
  let currentPrice = basePrice;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Simulate price movement with some volatility
    const dailyChange = (Math.random() - 0.5) * 0.04; // ±2% daily change
    const open = currentPrice;
    const close = open * (1 + dailyChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Calculate technical indicators for historical data
const calculateHistoricalIndicators = (data: HistoricalData[], period: number = 14): TechnicalIndicators => {
  const closes = data.map(d => d.close);
  const latest = closes.length - 1;
  
  // Simple RSI calculation
  const gains = [];
  const losses = [];
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  // Simple SMA calculation
  const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const sma50 = closes.slice(-50).reduce((a, b) => a + b, 0) / 50;
  
  return {
    rsi,
    macd: sma20 - sma50, // Simplified MACD value
    sma20,
    sma50,
    bollinger_upper: sma20 * 1.02,
    bollinger_lower: sma20 * 0.98
  };
};

// Detect patterns in historical data
const detectHistoricalPatterns = (data: HistoricalData[], indicators: TechnicalIndicators): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  // RSI oversold/overbought
  if (indicators.rsi < 30) {
    patterns.push({
      name: 'RSI Oversold',
      confidence: 0.7,
      type: 'bullish',
      description: 'RSI indicates oversold conditions',
      reliability: 'medium'
    });
  } else if (indicators.rsi > 70) {
    patterns.push({
      name: 'RSI Overbought',
      confidence: 0.7,
      type: 'bearish',
      description: 'RSI indicates overbought conditions',
      reliability: 'medium'
    });
  }
  
  // Moving average crossover
  if (indicators.sma20 > indicators.sma50) {
    patterns.push({
      name: 'Bullish MA Crossover',
      confidence: 0.6,
      type: 'bullish',
      description: '20-day SMA above 50-day SMA',
      reliability: 'medium'
    });
  } else if (indicators.sma20 < indicators.sma50) {
    patterns.push({
      name: 'Bearish MA Crossover',
      confidence: 0.6,
      type: 'bearish',
      description: '20-day SMA below 50-day SMA',
      reliability: 'medium'
    });
  }
  
  return patterns;
};

// Run backtest simulation
export const runBacktest = async (symbol: string, days: number = 252): Promise<BacktestResult> => {
  const historicalData = await fetchHistoricalData(symbol, days);
  const trades: BacktestTrade[] = [];
  let currentPosition: 'LONG' | 'SHORT' | null = null;
  let entryPrice = 0;
  let entryDate = '';
  let entryPattern = '';
  
  // Analyze each day
  for (let i = 50; i < historicalData.length - 1; i++) {
    const currentData = historicalData.slice(0, i + 1);
    const indicators = calculateHistoricalIndicators(currentData);
    const patterns = detectHistoricalPatterns(currentData, indicators);
    
    const currentPrice = historicalData[i].close;
    const nextPrice = historicalData[i + 1].close;
    const currentDate = historicalData[i].date;
    
    // Entry logic
    if (!currentPosition && patterns.length > 0) {
      const strongestPattern = patterns.reduce((prev, current) => 
        prev.confidence > current.confidence ? prev : current
      );
      
      if (strongestPattern.type === 'bullish' && strongestPattern.confidence > 0.6) {
        currentPosition = 'LONG';
        entryPrice = currentPrice;
        entryDate = currentDate;
        entryPattern = strongestPattern.name;
      } else if (strongestPattern.type === 'bearish' && strongestPattern.confidence > 0.6) {
        currentPosition = 'SHORT';
        entryPrice = currentPrice;
        entryDate = currentDate;
        entryPattern = strongestPattern.name;
      }
    }
    
    // Exit logic (after 5-10 days or stop loss/take profit)
    if (currentPosition && i > 55) {
      const holdingDays = i - historicalData.findIndex(d => d.date === entryDate);
      let shouldExit = false;
      
      if (currentPosition === 'LONG') {
        // Take profit at 5% or stop loss at 3%
        const returnPct = (currentPrice - entryPrice) / entryPrice;
        shouldExit = returnPct > 0.05 || returnPct < -0.03 || holdingDays > 10;
      } else if (currentPosition === 'SHORT') {
        // Take profit at 5% or stop loss at 3%
        const returnPct = (entryPrice - currentPrice) / entryPrice;
        shouldExit = returnPct > 0.05 || returnPct < -0.03 || holdingDays > 10;
      }
      
      if (shouldExit) {
        const exitPrice = currentPrice;
        const exitDate = currentDate;
        const returnPct = currentPosition === 'LONG' 
          ? (exitPrice - entryPrice) / entryPrice
          : (entryPrice - exitPrice) / entryPrice;
        
        trades.push({
          entryDate,
          exitDate,
          entryPrice,
          exitPrice,
          return: returnPct,
          pattern: entryPattern,
          action: currentPosition === 'LONG' ? 'BUY' : 'SELL',
          result: returnPct > 0 ? 'WIN' : 'LOSS'
        });
        
        currentPosition = null;
      }
    }
  }
  
  // Calculate metrics
  const winningTrades = trades.filter(t => t.result === 'WIN').length;
  const losingTrades = trades.filter(t => t.result === 'LOSS').length;
  const winRate = trades.length > 0 ? winningTrades / trades.length : 0;
  const totalReturn = trades.reduce((sum, trade) => sum + trade.return, 0);
  const averageReturn = trades.length > 0 ? totalReturn / trades.length : 0;
  
  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let runningReturn = 1;
  
  for (const trade of trades) {
    runningReturn *= (1 + trade.return);
    if (runningReturn > peak) peak = runningReturn;
    const drawdown = (peak - runningReturn) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  // Calculate Sharpe ratio (simplified)
  const returns = trades.map(t => t.return);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
  
  return {
    symbol,
    totalTrades: trades.length,
    winningTrades,
    losingTrades,
    winRate,
    totalReturn,
    averageReturn,
    maxDrawdown,
    sharpeRatio,
    trades
  };
};