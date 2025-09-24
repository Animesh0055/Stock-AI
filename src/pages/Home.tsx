import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Rocket,
  Orbit,
  Telescope,
  Satellite,
  ArrowRight,
  Star,
  BarChart3,
  Users
} from 'lucide-react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AnimatedBackground from '../components/UI/AnimatedBackground';
import AnimatedNumber from '../components/UI/AnimatedNumber';
import { generateMockStocks } from '../utils/mockData';
import { Stock } from '../types';

const Home: React.FC = () => {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const stocks = generateMockStocks();
      setTopStocks(stocks.slice(0, 6));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const features = [
    { icon: Rocket, title: 'AI Predictions', description: 'Launch your strategy with AI-forecasted market trajectories.' },
    { icon: Orbit, title: 'Risk Assessment', description: 'Navigate market volatility with smart portfolio analysis and risk alerts.' },
    { icon: Telescope, title: 'Real-time Analytics', description: 'Discover new opportunities with live data and sentiment analysis.' },
    { icon: Satellite, title: 'Precision Trading', description: 'Broadcast data-driven insights to optimize your investment decisions.' }
  ];

  const stats = [
    { label: 'Prediction Accuracy', value: 94.2, icon: Target, postfix: '%', decimals: 1 },
    { label: 'Active Users', value: 50, icon: Users, postfix: 'K+' },
    { label: 'Stocks Tracked', value: 5000, icon: BarChart3, decimals: 0 },
    { label: 'Assets Analyzed', value: 2.5, icon: DollarSign, prefix: '$', postfix: 'B', decimals: 1 }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Badge variant="info" className="mb-6">
              <Star className="w-4 h-4 mr-2 text-accent-glow" />
              Explore the Financial Cosmos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              Navigate Your Next{' '}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Investment
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-3xl mx-auto">
              BlackBull is your command center for financial exploration, using AI to chart the course through volatile markets.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/predictions"
                  className="inline-flex items-center justify-center px-8 py-3 bg-accent text-background font-semibold rounded-lg shadow-lg shadow-accent/20 hover:bg-accent-light transition-all"
                >
                  Launch Terminal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center px-8 py-3 bg-surface text-text-primary font-semibold rounded-lg border border-border hover:bg-surface-light hover:border-accent/50 transition-all"
                >
                  View Portfolio
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-accent text-background rounded-xl mb-4 shadow-glow-accent">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  <AnimatedNumber 
                    value={stat.value} 
                    decimals={stat.decimals} 
                    prefix={stat.prefix} 
                    postfix={stat.postfix} 
                  />
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Stocks Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Market Movers
            </h2>
            <p className="text-lg text-text-secondary">
              Live market data and AI predictions for trending stocks.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {topStocks.map((stock) => (
                <motion.div key={stock.symbol} variants={itemVariants}>
                  <Card hover="glow" className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{stock.symbol}</h3>
                        <p className="text-sm text-text-secondary">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-text-primary">${stock.price.toFixed(2)}</div>
                        <div className={`flex items-center justify-end text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {stock.change >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex justify-between"><span>Volume:</span><span>{(stock.volume / 1e6).toFixed(1)}M</span></div>
                      <div className="flex justify-between"><span>Market Cap:</span><span>${(stock.marketCap / 1e9).toFixed(1)}B</span></div>
                    </div>
                    <Link to={`/predictions?symbol=${stock.symbol}`} className="mt-4 inline-flex items-center text-accent hover:text-accent-light text-sm font-medium group">
                      View Trajectory <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">The Ultimate Trading Toolkit</h2>
            <p className="text-lg text-text-secondary">Everything you need for your financial exploration.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card hover className="h-full text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-accent text-background rounded-xl mb-4 shadow-glow-accent">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">Ready for Liftoff?</h2>
            <p className="text-xl text-text-secondary mb-8">Join thousands of explorers who trust our AI-powered predictions.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link to="/auth" className="inline-flex items-center justify-center px-8 py-3 bg-accent text-background font-semibold rounded-lg shadow-lg shadow-accent/20 hover:bg-accent-light transition-all">
                Start Your Mission <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
