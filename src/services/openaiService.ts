// OpenAI Service for enhanced trading advice generation
const OPENAI_API_KEY = "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"; // Replace with your actual API key
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "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") {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages,
          temperature: 0.3,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  async generateTradingAdvice(
    stockData: any,
    patterns: any[],
    ragContext: string
  ): Promise<{
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    reasoning: string;
    stopLoss: number;
    targetPrice: number;
  }> {
    const systemPrompt = `You are an expert trading advisor with deep knowledge of technical analysis, options trading, and market psychology. 

Your task is to analyze the provided data and generate a specific trading recommendation. You must respond with EXACTLY this JSON format:

{
  "action": "BUY|SELL|HOLD",
  "confidence": "HIGH|MEDIUM|LOW", 
  "reasoning": "detailed explanation",
  "stopLoss": number,
  "targetPrice": number
}

Consider:
- Technical patterns and indicators
- Options market dynamics (calls vs puts)
- Risk management principles
- Market context and volatility
- The provided trading literature knowledge

Be decisive but realistic. Include specific price levels for stop loss and targets.`;

    const userPrompt = `Analyze this trading data:

STOCK DATA:
Symbol: ${stockData.quote.symbol}
Current Price: $${stockData.quote.price}
Change: ${stockData.quote.change} (${stockData.quote.changePercent}%)
Volume: ${stockData.quote.volume}

TECHNICAL INDICATORS:
RSI: ${stockData.indicators.rsi}
MACD: ${stockData.indicators.macd}
SMA 20: $${stockData.indicators.sma20}
SMA 50: $${stockData.indicators.sma50}
Bollinger Upper: $${stockData.indicators.bollinger_upper}
Bollinger Lower: $${stockData.indicators.bollinger_lower}

DETECTED PATTERNS:
${patterns.map(p => `- ${p.name} (${p.type}, confidence: ${p.confidence.toFixed(2)}): ${p.description}`).join('\n')}

TRADING KNOWLEDGE CONTEXT:
${ragContext}

Provide a trading recommendation with specific entry, stop loss, and target levels.`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(response);
        return {
          action: parsed.action,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          stopLoss: parsed.stopLoss,
          targetPrice: parsed.targetPrice
        };
      } catch (parseError) {
        // Fallback if response isn't valid JSON
        console.warn('Failed to parse OpenAI JSON response, using fallback');
        return this.parseFallbackResponse(response, stockData);
      }
    } catch (error) {
      console.error('OpenAI service error:', error);
      throw error;
    }
  }

  private parseFallbackResponse(response: string, stockData: any) {
    // Simple fallback parsing for non-JSON responses
    const action = response.includes('BUY') ? 'BUY' : 
                   response.includes('SELL') ? 'SELL' : 'HOLD';
    
    const confidence = response.includes('HIGH') ? 'HIGH' :
                      response.includes('LOW') ? 'LOW' : 'MEDIUM';

    const currentPrice = stockData.quote.price;
    
    return {
      action: action as 'BUY' | 'SELL' | 'HOLD',
      confidence: confidence as 'HIGH' | 'MEDIUM' | 'LOW',
      reasoning: response,
      stopLoss: action === 'BUY' ? currentPrice * 0.95 : currentPrice * 1.05,
      targetPrice: action === 'BUY' ? currentPrice * 1.05 : currentPrice * 0.95
    };
  }

  async enhancePatternAnalysis(patterns: any[], marketContext: string): Promise<string> {
    const prompt = `As a technical analysis expert, provide insights on these detected patterns:

PATTERNS:
${patterns.map(p => `- ${p.name}: ${p.description} (Confidence: ${p.confidence.toFixed(2)})`).join('\n')}

MARKET CONTEXT:
${marketContext}

Provide a concise analysis of pattern significance, potential outcomes, and key levels to watch. Focus on actionable insights for options and stock trading.`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a technical analysis expert. Provide concise, actionable pattern analysis.' },
        { role: 'user', content: prompt }
      ]);

      return response;
    } catch (error) {
      console.error('Pattern analysis enhancement failed:', error);
      return `Analysis of ${patterns.length} patterns detected. Consider market conditions and risk management.`;
    }
  }
}

export const openaiService = new OpenAIService();