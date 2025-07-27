import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { BacktestResult } from '@/services/backtestingService';

interface BacktestResultsProps {
  results: BacktestResult | null;
  isLoading: boolean;
  onRunBacktest: () => void;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results, isLoading, onRunBacktest }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Running Backtest...</h3>
        </div>
        <div className="space-y-3">
          <div className="animate-pulse bg-muted h-4 rounded"></div>
          <div className="animate-pulse bg-muted h-4 rounded w-3/4"></div>
          <div className="animate-pulse bg-muted h-4 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Historical Backtesting</h3>
          <p className="text-muted-foreground mb-4">
            Test trading strategies against historical data to evaluate performance
          </p>
          <Button onClick={onRunBacktest} className="w-full">
            Run Backtest Analysis
          </Button>
        </div>
      </Card>
    );
  }

  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatNumber = (value: number, decimals: number = 2) => value.toFixed(decimals);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Backtest Results</h3>
          </div>
          <Button variant="outline" size="sm" onClick={onRunBacktest}>
            Run New Test
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {results.totalTrades}
            </div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {formatPercentage(results.winRate)}
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${results.totalReturn > 0 ? 'text-success' : 'text-destructive'}`}>
              {formatPercentage(results.totalReturn)}
            </div>
            <div className="text-sm text-muted-foreground">Total Return</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(results.sharpeRatio, 2)}
            </div>
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Winning Trades</span>
            </div>
            <div className="text-lg font-semibold">{results.winningTrades}</div>
            <Progress value={(results.winningTrades / results.totalTrades) * 100} className="mt-2" />
          </Card>

          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Losing Trades</span>
            </div>
            <div className="text-lg font-semibold">{results.losingTrades}</div>
            <Progress value={(results.losingTrades / results.totalTrades) * 100} className="mt-2" />
          </Card>

          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">Max Drawdown</span>
            </div>
            <div className="text-lg font-semibold">{formatPercentage(results.maxDrawdown)}</div>
            <div className="text-xs text-muted-foreground mt-1">Largest peak-to-trough decline</div>
          </Card>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <Card className="p-6">
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Risk Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Return per Trade</span>
                    <span className={`font-medium ${results.averageReturn > 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatPercentage(results.averageReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maximum Drawdown</span>
                    <span className="font-medium text-destructive">
                      {formatPercentage(results.maxDrawdown)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium">
                      {formatNumber(results.sharpeRatio, 2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Trade Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win/Loss Ratio</span>
                    <span className="font-medium">
                      {results.losingTrades > 0 
                        ? formatNumber(results.winningTrades / results.losingTrades, 2)
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Trade</span>
                    <span className="font-medium text-success">
                      {results.trades.length > 0 
                        ? formatPercentage(Math.max(...results.trades.map(t => t.return)))
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Worst Trade</span>
                    <span className="font-medium text-destructive">
                      {results.trades.length > 0 
                        ? formatPercentage(Math.min(...results.trades.map(t => t.return)))
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trades" className="mt-6">
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry Date</TableHead>
                    <TableHead>Exit Date</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>Return</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.trades.slice(-20).map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{trade.entryDate}</TableCell>
                      <TableCell className="font-mono text-sm">{trade.exitDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {trade.pattern}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.action === 'BUY' ? 'default' : 'secondary'}>
                          {trade.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">${formatNumber(trade.entryPrice)}</TableCell>
                      <TableCell className="font-mono">${formatNumber(trade.exitPrice)}</TableCell>
                      <TableCell className={`font-mono ${trade.return > 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercentage(trade.return)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.result === 'WIN' ? 'default' : 'destructive'}>
                          {trade.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {results.trades.length > 20 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing last 20 trades. Total: {results.trades.length} trades
              </p>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default BacktestResults;