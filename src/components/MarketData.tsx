import { TrendingUp, TrendingDown, BarChart3, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MarketDataProps {
  data?: {
    symbol: string;
    price: number;
    change: number;
    volume: string;
    rsi: number;
    macd: number;
  };
}

export const MarketData = ({ data }: MarketDataProps) => {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-bullish' : 'text-bearish';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Market Data & Indicators
      </h2>
      
      {data ? (
        <div className="space-y-4">
          {/* Stock Price */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {data.symbol}
              </span>
              <div className="flex items-center space-x-1">
                {data.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-bullish" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-bearish" />
                )}
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-bold text-foreground">
                ${data.price.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${getChangeColor(data.change)}`}>
                {formatChange(data.change)} USD
              </span>
            </div>
          </Card>

          {/* Technical Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Volume</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                {data.volume}
              </span>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">RSI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-foreground">
                  {data.rsi.toFixed(1)}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  data.rsi > 70 ? 'bg-danger/10 text-danger' :
                  data.rsi < 30 ? 'bg-success/10 text-success' :
                  'bg-muted/10 text-muted-foreground'
                }`}>
                  {data.rsi > 70 ? 'Overbought' : 
                   data.rsi < 30 ? 'Oversold' : 
                   'Neutral'}
                </span>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">MACD</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-foreground">
                {data.macd.toFixed(3)}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                data.macd > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {data.macd > 0 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Market data will appear after chart analysis</p>
        </div>
      )}
    </div>
  );
};