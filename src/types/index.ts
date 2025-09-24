export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface PredictionPoint {
  date: string;
  price: number;
  price_low: number;
  price_high: number;
  confidence: number;
  sentiment: 'bullish' | 'neutral' | 'risky';
}

export interface StockData {
  symbol: string;
  historical: {
    date: string;
    price: number;
    volume: number;
  }[];
  predictions: PredictionPoint[];
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  modelAccuracy: {
    past30days: number;
    past90days: number;
  };
}

export interface AnalystReport {
  bestInvestments: {
    symbol: string;
    name: string;
    reason: string;
    predictedGain: number;
  }[];
  highRisk: {
    symbol: string;
    name: string;
    reason: string;
    predictedLoss: number;
  }[];
}

export interface Portfolio {
  id: string;
  stocks: PortfolioStock[];
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
}

export interface PortfolioStock {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  change: number;
  changePercent: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  relatedStocks: string[];
}

export interface Alert {
  id: string;
  type: 'price' | 'news' | 'portfolio' | 'prediction';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  isRead: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  skills: {
    name: string;
    level: number;
  }[];
}
