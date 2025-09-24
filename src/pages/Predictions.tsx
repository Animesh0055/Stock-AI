import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Target, FileText, Activity, BrainCircuit, BarChart3, Users } from 'lucide-react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StockChart from '../components/Charts/StockChart';
import RiskHeatmap from '../components/Dashboard/RiskHeatmap';
import AnalystReport from '../components/Dashboard/AnalystReport';
import TechnicalIndicators from '../components/Dashboard/TechnicalIndicators';
import ModelAccuracy from '../components/Dashboard/ModelAccuracy';
import AnimatedNumber from '../components/UI/AnimatedNumber';
import { generateMockStocks, generateStockHistory, generateAnalystReport } from '../utils/mockData';
import { Stock, StockData, AnalystReport as AnalystReportType } from '../types';

const Predictions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stocks] = useState<Stock[]>(generateMockStocks());
  const [selectedStock, setSelectedStock] = useState<string>(searchParams.get('symbol') || 'AAPL');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [analystReport, setAnalystReport] = useState<AnalystReportType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('report');

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = generateStockHistory(selectedStock);
      const report = generateAnalystReport();
      setStockData(data);
      setAnalystReport(report);
      setIsLoading(false);
    };

    fetchStockData();
  }, [selectedStock]);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setSearchParams({ symbol });
  };

  const selectedStockInfo = useMemo(() => stocks.find(s => s.symbol === selectedStock), [stocks, selectedStock]);
  
  const predictionSummary = useMemo(() => {
    if (!stockData) return null;
    const lastPrediction = stockData.predictions[stockData.predictions.length - 1];
    const currentPrice = stockData.historical[stockData.historical.length - 1].price;
    const predictedChange = ((lastPrediction.price - currentPrice) / currentPrice) * 100;
    const overallSentiment = stockData.predictions.filter(p => p.sentiment === 'bullish').length > stockData.predictions.filter(p => p.sentiment === 'risky').length ? 'Positive' : 'Negative';
    return {
      targetPrice: lastPrediction.price,
      predictedChange,
      overallSentiment
    };
  }, [stockData]);

  const tabs = [
    { id: 'report', label: 'Analyst Report', icon: BrainCircuit },
    { id: 'technicals', label: 'Technicals', icon: Activity },
    { id: 'accuracy', label: 'Model Accuracy', icon: Target },
  ];
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Stock Selector Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="xl:col-span-1"
          >
            <Card className="sticky top-24">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-border rounded-lg bg-surface-light focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-2 max-h-[75vh] overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <motion.button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedStock === stock.symbol
                        ? 'bg-accent/10'
                        : 'hover:bg-surface-light'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-text-primary">{stock.symbol}</p>
                        <p className="text-xs text-text-secondary truncate">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">${stock.price.toFixed(2)}</p>
                        <div className={`text-xs flex items-center justify-end ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {stock.change >= 0 ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="xl:col-span-4 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-[80vh]">
                <LoadingSpinner size="lg" />
              </div>
            ) : !stockData || !selectedStockInfo || !predictionSummary || !analystReport ? (
              <Card><p className="text-center p-12">Could not load stock data.</p></Card>
            ) : (
              <>
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                  <Card>
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-text-primary">{selectedStockInfo.symbol}</h1>
                        <p className="text-text-secondary">{selectedStockInfo.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-text-secondary text-sm">Current Price</p>
                          <p className="text-3xl font-bold text-text-primary">${selectedStockInfo.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-text-secondary text-sm">90-Day Target</p>
                          <p className="text-3xl font-bold text-accent">${predictionSummary.targetPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-light hover:border-accent/50 transition-colors"
                      >
                        <FileText size={16} className="mr-2"/> Export Report
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
                      <InfoItem label="90-Day Forecast" value={`${predictionSummary.predictedChange.toFixed(2)}%`} isPositive={predictionSummary.predictedChange >= 0} />
                      <InfoItem label="90-Day Outlook" value={predictionSummary.overallSentiment} isPositive={predictionSummary.overallSentiment === 'Positive'} />
                      <InfoItem label="Market Cap" value={`$${(selectedStockInfo.marketCap / 1e9).toFixed(1)}B`} />
                      <InfoItem label="Volume" value={`${(selectedStockInfo.volume / 1e6).toFixed(1)}M`} />
                    </div>
                  </Card>
                </motion.div>

                <motion.div 
                  variants={itemVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  <div className="lg:col-span-2">
                    <Card>
                      <h3 className="text-lg font-semibold text-text-primary mb-4">90-Day Price Forecast</h3>
                      <StockChart data={stockData} height={400} />
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <RiskHeatmap predictions={stockData.predictions} />
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="border-b border-border mb-4">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                            activeTab === tab.id
                              ? 'border-transparent text-text-primary'
                              : 'border-transparent text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <tab.icon size={16} className="mr-2" /> {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent"
                              layoutId="predictionTab"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div>
                    {activeTab === 'report' && <AnalystReport report={analystReport} />}
                    {activeTab === 'technicals' && <TechnicalIndicators indicators={stockData.technicalIndicators} />}
                    {activeTab === 'accuracy' && <ModelAccuracy accuracy={stockData.modelAccuracy} />}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{label: string; value: string; isPositive?: boolean}> = ({ label, value, isPositive }) => (
  <div>
    <p className="text-sm text-text-secondary">{label}</p>
    <p className={`text-lg font-semibold ${isPositive === undefined ? 'text-text-primary' : isPositive ? 'text-success' : 'text-danger'}`}>
      {value}
    </p>
  </div>
);

export default Predictions;
