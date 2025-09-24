import { faker } from '@faker-js/faker';
import { addDays, subDays, format } from 'date-fns';
import { Stock, StockData, PortfolioStock, NewsItem, Alert, AnalystReport, TeamMember } from '../types';

// Popular stock symbols
const STOCK_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.' }
];

export const generateMockStocks = (): Stock[] => {
  return STOCK_SYMBOLS.map(({ symbol, name }) => {
    const price = parseFloat(faker.finance.amount(50, 500, 2));
    const change = parseFloat(faker.finance.amount(-20, 20, 2));
    const changePercent = (change / price) * 100;
    
    return {
      symbol,
      name,
      price,
      change,
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: faker.number.int({ min: 1000000, max: 100000000 }),
      marketCap: faker.number.int({ min: 10000000000, max: 3000000000000 })
    };
  });
};

export const generateStockHistory = (symbol: string): StockData => {
  const historical = [];
  const predictions = [];
  let basePrice = parseFloat(faker.finance.amount(100, 400, 2));
  
  // Generate historical data for 365 days
  for (let i = 365; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const volatility = 0.02; 
    const change = (Math.random() - 0.5) * volatility * basePrice;
    basePrice += change;
    
    historical.push({
      date,
      price: parseFloat(basePrice.toFixed(2)),
      volume: faker.number.int({ min: 1000000, max: 50000000 })
    });
  }
  
  // Generate predictions for next 90 days
  let lastPrice = basePrice;
  for (let i = 1; i <= 90; i++) {
    const date = format(addDays(new Date(), i), 'yyyy-MM-dd');
    const volatility = 0.015;
    const trend = (Math.random() - 0.45); // slight upward bias
    const change = trend * volatility * lastPrice;
    const newPrice = lastPrice + change;
    
    const confidence = parseFloat((0.7 + Math.random() * 0.25).toFixed(2));
    const priceRange = newPrice * 0.01 * (1.1 - confidence) * 10; // Wider range for lower confidence

    let sentiment: 'bullish' | 'neutral' | 'risky';
    const priceDiff = newPrice - lastPrice;
    if (priceDiff > lastPrice * 0.005) sentiment = 'bullish';
    else if (priceDiff < -lastPrice * 0.005) sentiment = 'risky';
    else sentiment = 'neutral';

    predictions.push({
      date,
      price: parseFloat(newPrice.toFixed(2)),
      price_low: parseFloat((newPrice - priceRange).toFixed(2)),
      price_high: parseFloat((newPrice + priceRange).toFixed(2)),
      confidence,
      sentiment
    });
    lastPrice = newPrice;
  }
  
  return {
    symbol,
    historical,
    predictions,
    technicalIndicators: {
      rsi: parseFloat(faker.finance.amount(30, 70, 1)),
      macd: parseFloat(faker.finance.amount(-0.5, 0.5, 2)),
      bollingerBands: {
        upper: basePrice * 1.05,
        middle: basePrice,
        lower: basePrice * 0.95,
      }
    },
    modelAccuracy: {
      past30days: parseFloat(faker.finance.amount(85, 98, 1)),
      past90days: parseFloat(faker.finance.amount(80, 95, 1)),
    }
  };
};

export const generateAnalystReport = (): AnalystReport => {
  const shuffled = [...STOCK_SYMBOLS].sort(() => 0.5 - Math.random());
  return {
    bestInvestments: shuffled.slice(0, 3).map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      reason: faker.lorem.sentence({min: 10, max: 15}),
      predictedGain: parseFloat(faker.finance.amount(5, 25, 1)),
    })),
    highRisk: shuffled.slice(3, 6).map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      reason: faker.lorem.sentence({min: 10, max: 15}),
      predictedLoss: parseFloat(faker.finance.amount(5, 20, 1)),
    }))
  }
}

export const generateMockPortfolio = (): PortfolioStock[] => {
  return STOCK_SYMBOLS.slice(0, 5).map(({ symbol, name }) => {
    const shares = faker.number.int({ min: 10, max: 500 });
    const avgPrice = parseFloat(faker.finance.amount(80, 300, 2));
    const currentPrice = parseFloat(faker.finance.amount(avgPrice * 0.8, avgPrice * 1.3, 2));
    const totalValue = shares * currentPrice;
    const change = (currentPrice - avgPrice) * shares;
    const changePercent = ((currentPrice - avgPrice) / avgPrice) * 100;
    
    const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    return {
      symbol,
      name,
      shares,
      avgPrice,
      currentPrice,
      totalValue: parseFloat(totalValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      riskLevel
    };
  });
};

export const generateMockNews = (): NewsItem[] => {
  const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
  
  return Array.from({ length: 20 }, () => {
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const relatedStocks = STOCK_SYMBOLS.slice(0, Math.floor(Math.random() * 3) + 1).map(s => s.symbol);
    
    return {
      id: faker.string.uuid(),
      title: faker.lorem.sentence({ min: 8, max: 15 }),
      summary: faker.lorem.sentences(3),
      source: faker.company.name(),
      url: faker.internet.url(),
      publishedAt: faker.date.recent({ days: 7 }).toISOString(),
      sentiment,
      sentimentScore: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to 1
      relatedStocks
    };
  });
};

export const generateMockAlerts = (): Alert[] => {
  const types: Alert['type'][] = ['price', 'news', 'portfolio', 'prediction'];
  const severities: Alert['severity'][] = ['info', 'warning', 'danger', 'success'];
  
  return Array.from({ length: 10 }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: faker.string.uuid(),
      type,
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      message: faker.lorem.sentence({ min: 10, max: 20 }),
      severity,
      timestamp: faker.date.recent({ days: 3 }).toISOString(),
      isRead: Math.random() > 0.3
    };
  });
};

export const generateMockTeam = (): TeamMember[] => {
  return [
    {
      id: 'animesh-sen',
      name: 'Animesh Sen',
      role: 'Team Lead & ML Architect',
      avatar: `https://avatar.iran.liara.run/public/boy?username=rahul`,
      bio: "Animesh leads the team, architecting the core machine learning models and backend APIs that power BlackBull's predictive capabilities.",
      skills: [
        { name: 'Backend Development', level: 95 },
        { name: 'Machine Learning', level: 98 },
        { name: 'API Design', level: 92 },
        { name: 'System Architecture', level: 90 },
      ]
    },
    {
      id: 'rahul-yadav',
      name: 'Rahul Yadav',
      role: 'Frontend Engineer',
      avatar: `https://avatar.iran.liara.run/public/boy?username=animesh`,
      bio: 'Rahul translates complex financial data into intuitive and responsive user interfaces using Next.js and Tailwind CSS.',
      skills: [
        { name: 'Next.js', level: 96 },
        { name: 'Tailwind CSS', level: 94 },
        { name: 'React', level: 97 },
        { name: 'UI/UX Implementation', level: 91 },
      ]
    },
    {
      id: 'satyajeet-kumar',
      name: 'Satyajeet Kumar',
      role: 'Frontend Developer',
      avatar: `https://avatar.iran.liara.run/public/boy?username=satyajeet`,
      bio: 'Satyajeet specializes in building robust and interactive components with a strong foundation in core web technologies.',
      skills: [
        { name: 'HTML5', level: 95 },
        { name: 'CSS3', level: 92 },
        { name: 'JavaScript (ES6+)', level: 93 },
        { name: 'Component Development', level: 88 },
      ]
    },
    {
      id: 'ujjawal-upadhyay',
      name: 'Ujjawal Upadhyay',
      role: 'Frontend Developer',
      avatar: `https://avatar.iran.liara.run/public/boy?username=ujjawal`,
      bio: 'Ujjawal focuses on creating pixel-perfect and accessible user interfaces, ensuring a seamless experience across all devices.',
      skills: [
        { name: 'HTML5', level: 94 },
        { name: 'CSS3', level: 93 },
        { name: 'JavaScript', level: 91 },
        { name: 'Accessibility', level: 89 },
      ]
    },
    {
      id: 'rishit-shaw',
      name: 'Rishit Shaw',
      role: 'UI Developer',
      avatar: `https://avatar.iran.liara.run/public/boy?username=rishit`,
      bio: 'Rishit has a keen eye for design and is responsible for the visual polish and user experience of the BlackBull platform.',
      skills: [
        { name: 'HTML5', level: 92 },
        { name: 'CSS3 & Animations', level: 95 },
        { name: 'UI/UX Principles', level: 90 },
        { name: 'Figma to Code', level: 87 },
      ]
    }
  ];
};
