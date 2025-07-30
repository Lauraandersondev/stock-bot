import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUploadZone } from './ImageUploadZone';
import { PatternAnalysis } from './PatternAnalysis';
import { MarketData } from './MarketData';
import { TradingAdvice } from './TradingAdvice';
import { KnowledgeSearch } from './KnowledgeSearch';
import { Header } from './Header';
import BacktestResults from './BacktestResults';
import { useSymbolExtraction } from '@/hooks/useSymbolExtraction';
import { fetchFullStockData as fetchStockData } from '@/services/stockApi';
import { analyzePatterns, generateTradingRecommendation } from '@/services/patternAnalysis';
import { analyzeChartImage, preloadModels } from '@/services/computerVision';
import { runBacktest, BacktestResult } from '@/services/backtestingService';
import { useToast } from '@/hooks/use-toast';

export const TradingDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualSymbol, setManualSymbol] = useState('');
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [cvPatterns, setCvPatterns] = useState<any[]>([]);
  
  const { extractedSymbol, extractSymbolFromFile, setSymbol } = useSymbolExtraction();
  const { toast } = useToast();

  // Preload CV models on component mount
  useState(() => {
    preloadModels();
  });

  const performAnalysis = async (symbol: string, imagePatterns?: any[], userQuestion?: string) => {
    try {
      setIsAnalyzing(true);
      
      // Fetch real stock data
      const stockData = await fetchStockData(symbol);
      
      // Analyze patterns based on real data and combine with CV patterns
      const dataPatterns = analyzePatterns(stockData);
      const allPatterns = imagePatterns ? [...imagePatterns, ...dataPatterns] : dataPatterns;
      
      // Generate trading recommendation
      const recommendation = await generateTradingRecommendation(stockData, allPatterns, userQuestion);
      
      setAnalysisResults({
        detectedPatterns: allPatterns,
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
        description: `Successfully analyzed ${symbol} with ${allPatterns.length} patterns detected.`,
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
    // Extract symbol when image is uploaded but don't analyze yet
    const detectedSymbol = extractSymbolFromFile(file);
    console.log('Extracted symbol from file:', detectedSymbol, 'File name:', file.name);
    setSymbol(detectedSymbol);
  };

  const handleImageAnalyze = async (file: File, question?: string) => {
    try {
      setIsAnalyzing(true);
      
      // Step 1: Analyze image with computer vision
      toast({
        title: "Analyzing Image",
        description: "Using computer vision to detect candlestick patterns...",
      });
      
      const detectedPatterns = await analyzeChartImage(file);
      setCvPatterns(detectedPatterns);
      
      // Step 2: Use the extracted symbol from upload
      console.log('Using extracted symbol for analysis:', extractedSymbol);
      
      // Step 3: Perform complete analysis
      await performAnalysis(extractedSymbol, detectedPatterns, question);
      
    } catch (error) {
      console.error('Image analysis error:', error);
      toast({
        title: "Image Analysis Failed",
        description: "Could not analyze the chart image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
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

  const handleRunBacktest = async () => {
    if (!analysisResults?.marketData?.symbol) {
      toast({
        title: "No Symbol Selected",
        description: "Please analyze a stock first",
        variant: "destructive",
      });
      return;
    }

    setIsBacktesting(true);
    try {
      const results = await runBacktest(analysisResults.marketData.symbol);
      setBacktestResults(results);
      toast({
        title: "Backtest Complete",
        description: `Analyzed ${results.totalTrades} trades with ${(results.winRate * 100).toFixed(1)}% win rate`,
      });
    } catch (error) {
      console.error('Backtest error:', error);
      toast({
        title: "Backtest Failed",
        description: "Unable to run backtest analysis",
        variant: "destructive",
      });
    } finally {
      setIsBacktesting(false);
    }
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
              onAnalyze={handleImageAnalyze}
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

          {/* Backtesting Results Section */}
          <Card className="p-6">
            <BacktestResults
              results={backtestResults}
              isLoading={isBacktesting}
              onRunBacktest={handleRunBacktest}
            />
          </Card>
        </div>

        {/* Knowledge Base Search Section */}
        <Card className="mt-6 p-6">
          <KnowledgeSearch />
        </Card>
      </main>
    </div>
  );
};