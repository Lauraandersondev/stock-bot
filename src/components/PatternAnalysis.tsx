import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Pattern {
  name: string;
  confidence: number;
  type: 'bullish' | 'bearish' | 'neutral';
}

interface PatternAnalysisProps {
  patterns?: Pattern[];
  isAnalyzing: boolean;
}

export const PatternAnalysis = ({ patterns, isAnalyzing }: PatternAnalysisProps) => {
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-bullish" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-bearish" />;
      default:
        return <Minus className="h-4 w-4 text-neutral" />;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'bg-success/10 text-success border-success/20';
      case 'bearish':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Pattern Recognition
      </h2>
      
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing candlestick patterns...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted/20 rounded animate-pulse" />
            <div className="h-3 bg-muted/20 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/20 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ) : patterns && patterns.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Detected {patterns.length} pattern{patterns.length > 1 ? 's' : ''} in the chart
          </p>
          
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPatternIcon(pattern.type)}
                    <span className="font-medium text-foreground">
                      {pattern.name}
                    </span>
                  </div>
                  <Badge className={getPatternColor(pattern.type)}>
                    {pattern.type.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="text-foreground font-medium">
                      {(pattern.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={pattern.confidence * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Upload a candlestick chart to begin pattern analysis</p>
        </div>
      )}
    </div>
  );
};