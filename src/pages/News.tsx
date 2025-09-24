import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ExternalLink,
  Filter,
  Search,
  Minus
} from 'lucide-react';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AnimatedNumber from '../components/UI/AnimatedNumber';
import { generateMockNews } from '../utils/mockData';
import { NewsItem } from '../types';
import { format } from 'date-fns';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  useEffect(() => {
    const fetchNews = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockNews = generateMockNews();
      setNews(mockNews);
      setFilteredNews(mockNews);
      setIsLoading(false);
    };

    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedStocks.some(stock => stock.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => item.sentiment === sentimentFilter);
    }

    setFilteredNews(filtered);
  }, [news, searchQuery, sentimentFilter]);

  const getSentimentBadge = (sentiment: string, score: number) => {
    switch (sentiment) {
      case 'positive':
        return (
          <Badge variant="success">
            <TrendingUp className="w-3 h-3 mr-1" />
            Positive ({score.toFixed(2)})
          </Badge>
        );
      case 'negative':
        return (
          <Badge variant="danger">
            <TrendingDown className="w-3 h-3 mr-1" />
            Negative ({score.toFixed(2)})
          </Badge>
        );
      default:
        return (
          <Badge variant="warning">
            <Minus className="w-3 h-3 mr-1" />
            Neutral ({score.toFixed(2)})
          </Badge>
        );
    }
  };

  const sentimentStats = {
    positive: news.filter(item => item.sentiment === 'positive').length,
    negative: news.filter(item => item.sentiment === 'negative').length,
    neutral: news.filter(item => item.sentiment === 'neutral').length,
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Market News & Sentiment</h1>
          <p className="text-text-secondary">AI-powered sentiment analysis on the latest financial news</p>
        </motion.div>

        {/* Sentiment Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <Newspaper className="w-5 h-5 text-accent mr-2" />
              <span className="text-sm text-text-secondary">Total Articles</span>
            </div>
            <div className="text-2xl font-bold text-text-primary"><AnimatedNumber value={news.length} /></div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success mr-2" />
              <span className="text-sm text-text-secondary">Positive</span>
            </div>
            <div className="text-2xl font-bold text-success"><AnimatedNumber value={sentimentStats.positive} /></div>
            <div className="text-sm text-text-secondary"><AnimatedNumber value={(sentimentStats.positive / news.length) * 100} decimals={1} postfix="%" /></div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-danger mr-2" />
              <span className="text-sm text-text-secondary">Negative</span>
            </div>
            <div className="text-2xl font-bold text-danger"><AnimatedNumber value={sentimentStats.negative} /></div>
            <div className="text-sm text-text-secondary"><AnimatedNumber value={(sentimentStats.negative / news.length) * 100} decimals={1} postfix="%" /></div>
          </Card></motion.div>

          <motion.div variants={itemVariants}><Card>
            <div className="flex items-center mb-2">
              <Minus className="w-5 h-5 text-warning mr-2" />
              <span className="text-sm text-text-secondary">Neutral</span>
            </div>
            <div className="text-2xl font-bold text-warning"><AnimatedNumber value={sentimentStats.neutral} /></div>
            <div className="text-sm text-text-secondary"><AnimatedNumber value={(sentimentStats.neutral / news.length) * 100} decimals={1} postfix="%" /></div>
          </Card></motion.div>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface-light text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value as any)}
                  className="px-3 py-2 border border-border rounded-lg bg-surface-light text-text-primary"
                >
                  <option value="all">All Sentiment</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* News Articles */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredNews.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No news found</h3>
                <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
              </div>
            </Card>
          ) : (
            filteredNews.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
              >
                <Card hover>
                  <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                            <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{format(new Date(item.publishedAt), 'MMM dd, yyyy • HH:mm')}</div>
                            <span>•</span>
                            <span>{item.source}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          {getSentimentBadge(item.sentiment, item.sentimentScore)}
                        </div>
                      </div>

                      <p className="text-text-secondary mb-4 line-clamp-3">{item.summary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {item.relatedStocks.map(stock => (
                            <Badge key={stock} variant="info" size="sm">{stock}</Badge>
                          ))}
                        </div>
                        
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-accent hover:text-accent-light text-sm font-medium">
                          Read More <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredNews.length > 0 && filteredNews.length >= 10 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-surface text-text-primary rounded-lg hover:bg-surface-light transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
