import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertTriangle,
  Shield,
  Target,
  Trash2,
  Users
} from 'lucide-react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AnimatedNumber from '../components/UI/AnimatedNumber';
import { generateMockPortfolio, generateMockStocks } from '../utils/mockData';
import { PortfolioStock, Stock } from '../types';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [availableStocks] = useState<Stock[]>(generateMockStocks());
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStock, setShowAddStock] = useState(false);
  const [selectedStock, setSelectedStock] = useState('');
  const [shares, setShares] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPortfolio = generateMockPortfolio();
      setPortfolio(mockPortfolio);
      setIsLoading(false);
    };

    fetchPortfolio();
  }, []);

  const totalValue = portfolio.reduce((sum, stock) => sum + stock.totalValue, 0);
  const totalChange = portfolio.reduce((sum, stock) => sum + stock.change, 0);
  const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  const riskDistribution = {
    low: portfolio.filter(s => s.riskLevel === 'low').length,
    medium: portfolio.filter(s => s.riskLevel === 'medium').length,
    high: portfolio.filter(s => s.riskLevel === 'high').length,
  };

  const handleAddStock = () => {
    if (!selectedStock || !shares || parseInt(shares) <= 0) return;

    const stock = availableStocks.find(s => s.symbol === selectedStock);
    if (!stock) return;

    const newStock: PortfolioStock = {
      symbol: stock.symbol,
      name: stock.name,
      shares: parseInt(shares),
      avgPrice: stock.price,
      currentPrice: stock.price,
      totalValue: stock.price * parseInt(shares),
      change: 0,
      changePercent: 0,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    };

    setPortfolio([...portfolio, newStock]);
    setSelectedStock('');
    setShares('');
    setShowAddStock(false);
  };

  const handleRemoveStock = (symbol: string) => {
    setPortfolio(portfolio.filter(stock => stock.symbol !== symbol));
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="success">Low Risk</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Risk</Badge>;
      case 'high':
        return <Badge variant="danger">High Risk</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const aiRecommendations = [
    {
      type: 'diversification',
      title: 'Diversify Technology Holdings',
      message: 'Consider reducing tech exposure and adding healthcare or utilities stocks.',
      severity: 'warning' as const
    },
    {
      type: 'rebalance',
      title: 'Rebalance Portfolio',
      message: 'Your portfolio is overweight in high-risk stocks. Consider some low-risk options.',
      severity: 'info' as const
    },
    {
      type: 'opportunity',
      title: 'Growth Opportunity',
      message: 'MSFT shows strong AI-predicted upside potential over the next 30 days.',
      severity: 'success' as const
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Portfolio
            </h1>
            <p className="text-text-secondary">
              Track your investments and get AI-powered insights
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddStock(true)}
            className="flex items-center px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-light transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </motion.button>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success mr-2" />
              <span className="text-sm text-text-secondary">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              <AnimatedNumber value={totalValue} decimals={2} prefix="$" />
            </div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              {totalChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger mr-2" />
              )}
              <span className="text-sm text-text-secondary">Total Gain/Loss</span>
            </div>
            <div className={`text-2xl font-bold ${totalChange >= 0 ? 'text-success' : 'text-danger'}`}>
              <AnimatedNumber value={totalChange} decimals={2} prefix={totalChange >= 0 ? '+$' : '-$'} />
            </div>
            <div className={`text-sm ${totalChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
              <AnimatedNumber value={totalChangePercent} decimals={2} prefix={totalChangePercent >= 0 ? '+' : ''} postfix="%" />
            </div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <PieChart className="w-5 h-5 text-accent mr-2" />
              <span className="text-sm text-text-secondary">Holdings</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              <AnimatedNumber value={portfolio.length} />
            </div>
            <div className="text-sm text-text-secondary">Stocks in portfolio</div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-warning mr-2" />
              <span className="text-sm text-text-secondary">Risk Score</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              <AnimatedNumber value={((riskDistribution.low * 1 + riskDistribution.medium * 2 + riskDistribution.high * 3) / portfolio.length || 0)} decimals={1} />
            </div>
            <div className="text-sm text-text-secondary">Balanced portfolio</div>
          </Card></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings List */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Your Holdings
              </h3>
              
              {portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-text-primary mb-2">No holdings yet</h4>
                  <p className="text-text-secondary mb-4">Start building your portfolio by adding your first stock</p>
                  <motion.button 
                    onClick={() => setShowAddStock(true)} 
                    className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-light transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Your First Stock
                  </motion.button>
                </div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {portfolio.map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      variants={itemVariants}
                      className="p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-text-primary">{stock.symbol}</h4>
                              <p className="text-sm text-text-secondary">{stock.name}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getRiskBadge(stock.riskLevel)}
                              <motion.button 
                                onClick={() => handleRemoveStock(stock.symbol)} 
                                className="p-1 text-text-secondary hover:text-danger transition-colors"
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-text-secondary">Shares:</span>
                              <div className="font-medium text-text-primary">{stock.shares}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary">Avg Price:</span>
                              <div className="font-medium text-text-primary">${stock.avgPrice.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary">Current:</span>
                              <div className="font-medium text-text-primary">${stock.currentPrice.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary">Total Value:</span>
                              <div className="font-medium text-text-primary">${stock.totalValue.toFixed(2)}</div>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className={`flex items-center text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                              {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                              {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Risk Distribution</h3>
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-text-secondary">Low Risk</span>
                    <span className="font-medium text-text-primary">{riskDistribution.low} stocks</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <motion.div 
                      className="bg-success h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(riskDistribution.low / portfolio.length) * 100 || 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-text-secondary">Medium Risk</span>
                    <span className="font-medium text-text-primary">{riskDistribution.medium} stocks</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <motion.div 
                      className="bg-warning h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(riskDistribution.medium / portfolio.length) * 100 || 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-text-secondary">High Risk</span>
                    <span className="font-medium text-text-primary">{riskDistribution.high} stocks</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <motion.div 
                      className="bg-danger h-2 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(riskDistribution.high / portfolio.length) * 100 || 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </Card>

            <Card>
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-accent mr-2" />
                <h3 className="text-lg font-semibold text-text-primary">AI Recommendations</h3>
              </div>
              
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${ rec.severity === 'success' ? 'bg-success/10' : rec.severity === 'warning' ? 'bg-warning/10' : 'bg-primary/10' }`}>
                        <AlertTriangle className={`w-4 h-4 ${ rec.severity === 'success' ? 'text-success' : rec.severity === 'warning' ? 'text-warning' : 'text-primary' }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-text-primary mb-1">{rec.title}</h4>
                        <p className="text-xs text-text-secondary">{rec.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Add Stock Modal */}
        <AnimatePresence>
        {showAddStock && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-xl p-6 w-full max-w-md mx-4 border border-border"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">Add Stock to Portfolio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Select Stock</label>
                  <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text-primary">
                    <option value="">Choose a stock...</option>
                    {availableStocks.map(stock => (
                      <option key={stock.symbol} value={stock.symbol}>{stock.symbol} - {stock.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Number of Shares</label>
                  <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} min="1" placeholder="Enter number of shares" className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text-primary" />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button 
                    onClick={handleAddStock} 
                    disabled={!selectedStock || !shares} 
                    className="flex-1 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Stock
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowAddStock(false)} 
                    className="flex-1 px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-surface-light transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Portfolio;
