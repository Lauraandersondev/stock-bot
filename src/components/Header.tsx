import { TrendingUp, Brain, BarChart3 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  CandleStick AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Multimodal Trading Analysis
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              <span>Market Open</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>S&P 500: +0.5%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};