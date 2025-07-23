import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ImageUploadZone } from './ImageUploadZone';
import { PatternAnalysis } from './PatternAnalysis';
import { MarketData } from './MarketData';
import { TradingAdvice } from './TradingAdvice';
import { Header } from './Header';

export const TradingDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploadedImage(file);
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResults({
        detectedPatterns: [
          { name: "Bullish Engulfing", confidence: 0.89, type: "bullish" },
          { name: "Hammer", confidence: 0.76, type: "bullish" }
        ],
        marketData: {
          symbol: "AAPL",
          price: 175.43,
          change: +2.14,
          volume: "52.3M",
          rsi: 58.2,
          macd: 0.45
        },
        recommendation: {
          action: "BUY",
          confidence: "HIGH",
          reasoning: "Strong bullish engulfing pattern with high volume confirmation",
          stopLoss: 168.50,
          targetPrice: 185.00
        }
      });
      setIsAnalyzing(false);
    }, 3000);
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