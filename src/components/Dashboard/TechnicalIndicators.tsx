import React from 'react';
import { StockData } from '../../types';
import Card from '../UI/Card';

interface TechnicalIndicatorsProps {
  indicators: StockData['technicalIndicators'];
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ indicators }) => {
  const getRsiInterpretation = (rsi: number) => {
    if (rsi > 70) return <span className="text-danger">Overbought</span>;
    if (rsi < 30) return <span className="text-success">Oversold</span>;
    return <span className="text-warning">Neutral</span>;
  };

  return (
    <Card padding="sm">
      <h4 className="font-semibold text-text-primary mb-3">
        Technical Indicators
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-text-secondary">RSI (14)</p>
          <p className="font-bold text-lg text-text-primary">{indicators.rsi}</p>
          <p>{getRsiInterpretation(indicators.rsi)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-text-secondary">MACD</p>
          <p className="font-bold text-lg text-text-primary">{indicators.macd}</p>
          <p className={indicators.macd > 0 ? 'text-success' : 'text-danger'}>
            {indicators.macd > 0 ? 'Bullish' : 'Bearish'}
          </p>
        </div>
        <div className="space-y-1 col-span-2 md:col-span-1">
          <p className="text-text-secondary">Bollinger Bands</p>
          <p className="text-text-primary">
            U: ${indicators.bollingerBands.upper.toFixed(2)}
          </p>
          <p className="text-text-primary">
            L: ${indicators.bollingerBands.lower.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalIndicators;
