import React from 'react';
import { format, parseISO } from 'date-fns';
import { PredictionPoint } from '../../types';
import Card from '../UI/Card';

interface RiskHeatmapProps {
  predictions: PredictionPoint[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ predictions }) => {
  const sentimentColors = {
    bullish: 'bg-success/70',
    neutral: 'bg-warning/70',
    risky: 'bg-danger/70',
  };

  const getMonthName = (dateStr: string) => format(parseISO(dateStr), 'MMM');
  
  const predictionsByMonth: { [key: string]: PredictionPoint[] } = {};
  predictions.forEach(p => {
    const month = getMonthName(p.date);
    if (!predictionsByMonth[month]) {
      predictionsByMonth[month] = [];
    }
    predictionsByMonth[month].push(p);
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        3-Month Risk Heatmap
      </h3>
      <div className="space-y-4">
        {Object.entries(predictionsByMonth).map(([month, days]) => (
          <div key={month}>
            <h4 className="text-sm font-medium text-text-secondary mb-2">{month}</h4>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day) => (
                <div key={day.date} className="relative group">
                  <div
                    className={`w-full h-6 rounded-sm ${sentimentColors[day.sentiment]}`}
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max p-2 text-xs bg-background text-text-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg border border-border">
                    {format(parseISO(day.date), 'MMM dd')}: {day.sentiment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RiskHeatmap;
