import { StockData } from './stockApi';
import { ragService } from './ragService';
import { openaiService } from './openaiService';

export interface DetectedPattern {
  name: string;
  confidence: number;
  type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  reliability: 'high' | 'medium' | 'low';
}

export interface TradingRecommendation {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  stopLoss: number;
  targetPrice: number;
  riskReward: number;
}

// Enhanced pattern analysis based on technical indicators
export const analyzePatterns = (stockData: StockData): DetectedPattern[] => {
  const { quote, indicators } = stockData;
  const patterns: DetectedPattern[] = [];

  // RSI-based patterns
  if (indicators.rsi > 70) {
    patterns.push({
      name: "Overbought Condition",
      confidence: Math.min(0.95, (indicators.rsi - 70) / 30 + 0.7),
      type: 'bearish',
      description: "RSI indicates overbought conditions, potential reversal signal",
      reliability: indicators.rsi > 80 ? 'high' : 'medium'
    });
  } else if (indicators.rsi < 30) {
    patterns.push({
      name: "Oversold Condition", 
      confidence: Math.min(0.95, (30 - indicators.rsi) / 30 + 0.7),
      type: 'bullish',
      description: "RSI indicates oversold conditions, potential bounce signal",
      reliability: indicators.rsi < 20 ? 'high' : 'medium'
    });
  }

  // MACD-based patterns
  if (indicators.macd > 0) {
    patterns.push({
      name: "MACD Bullish Signal",
      confidence: Math.min(0.9, Math.abs(indicators.macd) * 0.5 + 0.6),
      type: 'bullish',
      description: "MACD above zero indicates bullish momentum",
      reliability: Math.abs(indicators.macd) > 1 ? 'high' : 'medium'
    });
  } else {
    patterns.push({
      name: "MACD Bearish Signal",
      confidence: Math.min(0.9, Math.abs(indicators.macd) * 0.5 + 0.6),
      type: 'bearish', 
      description: "MACD below zero indicates bearish momentum",
      reliability: Math.abs(indicators.macd) > 1 ? 'high' : 'medium'
    });
  }

  // Moving Average patterns
  if (quote.price > indicators.sma20 && indicators.sma20 > indicators.sma50) {
    patterns.push({
      name: "Golden Cross Formation",
      confidence: 0.85,
      type: 'bullish',
      description: "Price above short-term MA, which is above long-term MA",
      reliability: 'high'
    });
  } else if (quote.price < indicators.sma20 && indicators.sma20 < indicators.sma50) {
    patterns.push({
      name: "Death Cross Formation", 
      confidence: 0.85,
      type: 'bearish',
      description: "Price below short-term MA, which is below long-term MA",
      reliability: 'high'
    });
  }

  // Bollinger Bands patterns
  if (quote.price > indicators.bollinger_upper) {
    patterns.push({
      name: "Bollinger Band Breakout",
      confidence: 0.75,
      type: 'bullish',
      description: "Price broke above upper Bollinger Band",
      reliability: 'medium'
    });
  } else if (quote.price < indicators.bollinger_lower) {
    patterns.push({
      name: "Bollinger Band Oversold",
      confidence: 0.75,
      type: 'bullish',
      description: "Price touched lower Bollinger Band, potential bounce",
      reliability: 'medium'
    });
  }

  return patterns.slice(0, 3); // Return top 3 patterns
};

// Generate AI-enhanced trading recommendation
export const generateTradingRecommendation = async (
  stockData: StockData, 
  patterns: DetectedPattern[]
): Promise<TradingRecommendation> => {
  try {
    // Get contextual knowledge from RAG system
    const patternNames = patterns.map(p => p.name).join(' ');
    const ragContext = await ragService.generateContextualAdvice(
      patterns, 
      stockData, 
      `${patternNames} options trading strategy analysis`
    );
    
    // Try OpenAI for enhanced analysis first
    try {
      console.log('Generating OpenAI-enhanced trading recommendation...');
      const aiRecommendation = await openaiService.generateTradingAdvice(
        stockData,
        patterns,
        ragContext
      );
      
      return {
        ...aiRecommendation,
        riskReward: Math.abs(aiRecommendation.targetPrice - stockData.quote.price) / 
                   Math.abs(stockData.quote.price - aiRecommendation.stopLoss)
      };
    } catch (openaiError) {
      console.warn('OpenAI enhancement failed, using fallback logic:', openaiError);
      return generateFallbackRecommendation(stockData, patterns, ragContext);
    }
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return generateFallbackRecommendation(stockData, patterns);
  }
};

// Fallback recommendation logic (original algorithm)
const generateFallbackRecommendation = (
  stockData: StockData, 
  patterns: DetectedPattern[],
  ragAdvice?: string
): TradingRecommendation => {
  const { quote, indicators } = stockData;
  
  // Calculate overall sentiment score
  const bullishPatterns = patterns.filter(p => p.type === 'bullish');
  const bearishPatterns = patterns.filter(p => p.type === 'bearish');
  
  const bullishScore = bullishPatterns.reduce((sum, p) => sum + p.confidence, 0);
  const bearishScore = bearishPatterns.reduce((sum, p) => sum + p.confidence, 0);
  
  let action: 'BUY' | 'SELL' | 'HOLD';
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  
  const netScore = bullishScore - bearishScore;
  
  if (netScore > 0.5) {
    action = 'BUY';
    confidence = netScore > 1.2 ? 'HIGH' : 'MEDIUM';
  } else if (netScore < -0.5) {
    action = 'SELL';
    confidence = netScore < -1.2 ? 'HIGH' : 'MEDIUM';
  } else {
    action = 'HOLD';
    confidence = 'LOW';
  }

  // Calculate stop loss and target based on volatility and support/resistance
  const volatility = Math.abs(quote.change) / quote.previousClose;
  const stopLossPercent = Math.max(0.02, volatility * 1.5); // At least 2% stop loss
  const targetPercent = stopLossPercent * 2.5; // 2.5:1 risk-reward ratio
  
  const stopLoss = action === 'BUY' 
    ? quote.price * (1 - stopLossPercent)
    : quote.price * (1 + stopLossPercent);
    
  const targetPrice = action === 'BUY'
    ? quote.price * (1 + targetPercent) 
    : quote.price * (1 - targetPercent);

  const riskReward = Math.abs(targetPrice - quote.price) / Math.abs(quote.price - stopLoss);

  return {
    action,
    confidence,
    reasoning: ragAdvice || `Technical analysis shows ${patterns.length} patterns detected. RSI: ${indicators.rsi.toFixed(1)}, MACD: ${indicators.macd.toFixed(3)}`,
    stopLoss,
    targetPrice,
    riskReward
  };
};