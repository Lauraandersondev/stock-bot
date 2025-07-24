import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUploadZone } from './ImageUploadZone';
import { PatternAnalysis } from './PatternAnalysis';
import { MarketData } from './MarketData';
import { TradingAdvice } from './TradingAdvice';
import { Header } from './Header';
import { useSymbolExtraction } from '@/hooks/useSymbolExtraction';
import { fetchFullStockData as fetchStockData } from '@/services/stockApi';
import { analyzePatterns, generateTradingRecommendation } from '@/services/patternAnalysis';
import { useToast } from '@/hooks/use-toast';

export const TradingDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualSymbol, setManualSymbol] = useState('');
  
  const { extractedSymbol, extractSymbolFromFile, setSymbol } = useSymbolExtraction();
  const { toast } = useToast();

  const performAnalysis = async (symbol: string) => {
    try {
      setIsAnalyzing(true);
      
      // Fetch real stock data
      const stockData = await fetchStockData(symbol);
      
      // Analyze patterns based on real data
      const detectedPatterns = analyzePatterns(stockData);
      
      // Generate trading recommendation
      const recommendation = generateTradingRecommendation(stockData, detectedPatterns);
      
      setAnalysisResults({
        detectedPatterns,
        marketData: {
          symbol: stockData.quote.symbol,
          price: stockData.quote.price,
          change: stockData.quote.change,
          volume: stockData.quote.volume,
          rsi: stockData.indicators.rsi,
          macd: stockData.indicators.macd
        },
        recommendation
      });
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${symbol} with ${detectedPatterns.length} patterns detected.`,
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadedImage(file);
    
    // Extract symbol from filename
    const symbol = extractSymbolFromFile(file);
    
    // Perform real analysis
    await performAnalysis(symbol);
  };

  const handleManualAnalysis = async () => {
    if (!manualSymbol.trim()) {
      toast({
        title: "Symbol Required",
        description: "Please enter a stock symbol to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setSymbol(manualSymbol);
    await performAnalysis(manualSymbol.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Upload Candlestick Chart
            </h2>
            <ImageUploadZone 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
            />
            
            {/* Manual Symbol Input */}
            <div className="mt-6 pt-6 border-t border-border">
              <Label htmlFor="symbol" className="text-sm font-medium text-foreground">
                Or enter stock symbol manually:
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="symbol"
                  placeholder="e.g., AAPL, TSLA, MSFT"
                  value={manualSymbol}
                  onChange={(e) => setManualSymbol(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualAnalysis();
                    }
                  }}
                />
                <Button 
                  onClick={handleManualAnalysis}
                  disabled={isAnalyzing}
                  className="px-6"
                >
                  Analyze
                </Button>
              </div>
              {extractedSymbol && (
                <p className="text-xs text-muted-foreground mt-2">
                  Current symbol: {extractedSymbol}
                </p>
              )}
            </div>
          </Card>

          {/* Market Data Section */}
          <Card className="p-6">
            <MarketData data={analysisResults?.marketData} />
          </Card>

          {/* Pattern Analysis Section */}
          <Card className="p-6">
            <PatternAnalysis 
              patterns={analysisResults?.detectedPatterns}
              isAnalyzing={isAnalyzing}
            />
          </Card>

          {/* Trading Advice Section */}
          <Card className="p-6">
            <TradingAdvice 
              recommendation={analysisResults?.recommendation}
              isAnalyzing={isAnalyzing}
            />
          </Card>
        </div>
        
        {/* Disclaimer */}
        <Card className="mt-8 p-4 bg-warning/10 border-warning">
          <p className="text-sm text-warning-foreground">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and should not be considered as financial advice. 
            Trading involves substantial risk and may result in loss of capital. Always conduct your own research and consult with a qualified financial advisor.
          </p>
        </Card>
      </main>
    </div>
  );
};