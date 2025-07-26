import { Loader2, Target, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TradingAdviceProps {
  recommendation?: {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    reasoning: string;
    stopLoss: number;
    targetPrice: number;
  };
  isAnalyzing: boolean;
}

export const TradingAdvice = ({ recommendation, isAnalyzing }: TradingAdviceProps) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-success text-success-foreground';
      case 'SELL':
        return 'bg-danger text-danger-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH':
        return 'bg-success/10 text-success border-success/20';
      case 'MEDIUM':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY':
        return <CheckCircle className="h-5 w-5" />;
      case 'SELL':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        AI Trading Advice
      </h2>
      
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating trading recommendations...</span>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-muted/20 rounded animate-pulse" />
            <div className="h-8 bg-muted/20 rounded animate-pulse" />
            <div className="h-8 bg-muted/20 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ) : recommendation ? (
        <div className="space-y-4">
          {/* Main Recommendation */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge className={getActionColor(recommendation.action)}>
                  <div className="flex items-center space-x-1">
                    {getActionIcon(recommendation.action)}
                    <span className="font-semibold">{recommendation.action}</span>
                  </div>
                </Badge>
                <Badge className={getConfidenceColor(recommendation.confidence)}>
                  {recommendation.confidence} CONFIDENCE
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-foreground leading-relaxed">
              {recommendation.reasoning}
            </p>
          </Card>

          {/* Trading Targets */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-danger" />
                <span className="text-sm font-medium text-muted-foreground">Stop Loss</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                ${recommendation.stopLoss?.toFixed(2) || 'N/A'}
              </span>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Target Price</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                ${recommendation.targetPrice?.toFixed(2) || 'N/A'}
              </span>
            </Card>
          </div>

          {/* Risk/Reward Ratio */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Risk/Reward Ratio</span>
              <span className="text-sm font-semibold text-success">
                {recommendation.targetPrice && recommendation.stopLoss ? 
                  `1:${((recommendation.targetPrice - 175.43) / (175.43 - recommendation.stopLoss)).toFixed(1)}` :
                  'N/A'
                }
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Based on current price vs stop loss and target
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              Save Analysis
            </Button>
            <Button className="w-full">
              Export Report
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Trading recommendations will appear after analysis</p>
        </div>
      )}
    </div>
  );
};