import React from 'react';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { AnalystReport as AnalystReportType } from '../../types';
import Card from '../UI/Card';

interface AnalystReportProps {
  report: AnalystReportType;
}

const AnalystReport: React.FC<AnalystReportProps> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card padding="sm">
        <div className="flex items-center mb-3">
          <Award className="w-5 h-5 text-success mr-2" />
          <h4 className="font-semibold text-text-primary">
            Best Investments (Next 7 Days)
          </h4>
        </div>
        <div className="space-y-3">
          {report.bestInvestments.map((stock) => (
            <div key={stock.symbol} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">{stock.symbol}</span>
                <span className="flex items-center text-success">
                  <TrendingUp className="w-4 h-4 mr-1" /> +{stock.predictedGain}%
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{stock.reason}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card padding="sm">
        <div className="flex items-center mb-3">
          <TrendingDown className="w-5 h-5 text-danger mr-2" />
          <h4 className="font-semibold text-text-primary">
            High-Risk Stocks to Avoid
          </h4>
        </div>
        <div className="space-y-3">
          {report.highRisk.map((stock) => (
            <div key={stock.symbol} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">{stock.symbol}</span>
                <span className="flex items-center text-danger">
                  <TrendingDown className="w-4 h-4 mr-1" /> -{stock.predictedLoss}%
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{stock.reason}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AnalystReport;
