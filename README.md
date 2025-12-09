# Pattern Parse Pro

An intelligent trading analysis platform powered by AI and computer vision that detects chart patterns, analyzes market data, and generates trading recommendations with backtesting capabilities.

## Features

### **Chart Pattern Detection**
- Computer vision-powered candlestick pattern recognition (Hammer, Doji, Engulfing, Morning Star, Evening Star, Shooting Star, etc.)
- Upload chart images for instant analysis
- Confidence scoring for detected patterns
- Pattern type classification (Bullish, Bearish, Neutral)

### **Technical Analysis**
- Real-time market data fetching via stock API
- Technical indicator calculations:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - SMA 20 & 50 (Simple Moving Averages)
  - Bollinger Bands
- Automated pattern detection based on indicators
- Multi-factor pattern analysis

### **AI-Powered Trading Advice**
- OpenAI integration for enhanced pattern analysis and trading recommendations
- Natural language processing for user questions
- Intelligent stop-loss and target price calculation
- Risk-reward ratio analysis
- HIGH/MEDIUM/LOW confidence ratings

### **Knowledge Base & RAG**
- Comprehensive trading knowledge base with:
  - Candlestick patterns explanation
  - Technical indicators guide
  - Trading strategies
  - Risk management principles
  - Options trading concepts
- RAG (Retrieval-Augmented Generation) system for contextual trading advice
- Semantic search through trading documentation

### **Backtesting Engine**
- Historical data simulation
- Pattern-based trade simulation
- Performance metrics:
  - Win rate calculation
  - Total returns & average returns
  - Max drawdown analysis
  - Sharpe ratio
- Trade-by-trade breakdown with entry/exit analysis

### **Interactive Dashboard**
- Symbol search and extraction from text
- Real-time market data display
- Visual pattern analysis cards
- Trading advice panel with actionable signals
- Knowledge search interface
- Responsive design with Shadcn UI components

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Computer Vision**: Hugging Face Transformers.js
- **AI Integration**: OpenAI API
- **State Management**: React Hooks
- **API Calls**: Axios
- **Build Tool**: Vite

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pattern-parse-pro
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables (create `.env.local`):
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Started

### Development Server
```bash
npm run dev
# or
bun dev
```
The application will be available at `http://localhost:8080`

### Build for Production
```bash
npm run build
# or
bun build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## How to Use

### 1. **Analyze Stock Patterns**
- Enter a stock symbol (e.g., AAPL, GOOGL)
- System fetches real-time market data
- Technical indicators are calculated automatically
- Patterns are detected based on the data
- AI generates a trading recommendation

### 2. **Upload Chart Images**
- Click the image upload zone
- Select a stock chart image
- Computer vision analyzes the image for patterns
- Results are combined with technical analysis

### 3. **View Market Data**
- Real-time price and volume information
- Technical indicator values (RSI, MACD, Moving Averages, Bollinger Bands)
- Visual representation of market conditions

### 4. **Trading Recommendations**
- BUY/SELL/HOLD signals with confidence levels
- Detailed reasoning from AI analysis
- Calculated stop-loss prices
- Target price projections
- Risk-reward ratio analysis

### 5. **Backtest Strategies**
- Run historical backtests on detected patterns
- Analyze win rates and returns
- Evaluate strategy performance
- Review individual trades

### 6. **Knowledge Search**
- Search trading knowledge base
- Learn about patterns, strategies, and indicators
- Understand trading concepts

## Project Structure

```
src/
├── components/           # React components
│   ├── TradingDashboard.tsx     # Main dashboard
│   ├── PatternAnalysis.tsx      # Pattern visualization
│   ├── MarketData.tsx           # Market data display
│   ├── TradingAdvice.tsx        # Recommendations
│   ├── BacktestResults.tsx      # Backtest metrics
│   ├── ImageUploadZone.tsx      # Chart image upload
│   ├── KnowledgeSearch.tsx      # Knowledge base search
│   └── ui/                      # Shadcn UI components
├── services/            # Business logic
│   ├── patternAnalysis.ts       # Pattern detection & analysis
│   ├── computerVision.ts        # Image analysis with ML
│   ├── stockApi.ts              # Market data API
│   ├── openaiService.ts         # OpenAI integration
│   ├── ragService.ts            # RAG knowledge retrieval
│   └── backtestingService.ts    # Historical simulation
├── data/
│   └── tradingKnowledgeBase.ts  # Trading knowledge documents
├── hooks/               # Custom React hooks
│   ├── useSymbolExtraction.ts   # Symbol extraction hook
│   └── use-toast.ts             # Toast notifications
└── lib/
    └── utils.ts         # Utility functions
```

## Key Services

### Pattern Analysis Service
Detects patterns using technical indicators:
- RSI-based overbought/oversold signals
- MACD momentum indicators
- Bollinger Band breakouts
- Combines multiple signals for recommendations

### Computer Vision Service
- Uses Hugging Face transformers for image classification
- Converts generic classifications to trading patterns
- Supports fallback pattern detection
- Handles image analysis in browser

### Stock API Service
- Fetches real-time market data
- Calculates technical indicators
- Handles API rate limiting
- Provides historical data support

### RAG Service
- Retrieves relevant trading knowledge
- Generates contextual advice
- Supports semantic search
- Integrates with OpenAI for enhanced analysis

### Backtesting Service
- Simulates historical trading
- Detects patterns in historical data
- Calculates performance metrics
- Generates detailed trade logs

## Analysis Workflow

1. **Data Acquisition** → Fetch market data & indicators
2. **Pattern Detection** → Identify patterns from technical analysis & images
3. **Knowledge Retrieval** → Find relevant trading concepts via RAG
4. **AI Enhancement** → OpenAI generates detailed recommendation
5. **Backtesting** → Test pattern performance historically
6. **Recommendation** → Present BUY/SELL/HOLD with stop-loss & targets

## Disclaimer

This application is for **educational and informational purposes only**. It should not be used as the sole basis for financial decisions. Trading and investing carry significant risk of loss. Always:
- Conduct thorough research before trading
- Consult with a financial advisor
- Use proper risk management
- Never invest more than you can afford to lose
- Backtest strategies thoroughly before live trading

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---