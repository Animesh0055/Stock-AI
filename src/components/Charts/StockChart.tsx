import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { StockData } from '../../types';

interface StockChartProps {
  data: StockData;
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({ data, height = 400 }) => {
  const historicalData = data.historical.slice(-90);
  const chartData = [
    ...historicalData.map(item => ({
      date: item.date,
      price: item.price,
      range: [null, null]
    })),
    ...data.predictions.map(item => ({
      date: item.date,
      price: item.price,
      range: [item.price_low, item.price_high],
      sentiment: item.sentiment,
      confidence: item.confidence
    }))
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-text-primary">
            {format(parseISO(label), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-text-secondary">
            Price: ${dataPoint.price.toFixed(2)}
          </p>
          {dataPoint.range[0] && (
            <p className="text-xs text-accent">
              Range: ${dataPoint.range[0].toFixed(2)} - ${dataPoint.range[1].toFixed(2)}
            </p>
          )}
          {dataPoint.confidence && (
            <p className="text-sm text-accent-light">
              Confidence: {(dataPoint.confidence * 100).toFixed(0)}%
            </p>
          )}
          {dataPoint.sentiment && (
            <p className={`text-xs mt-1 capitalize font-medium ${
              dataPoint.sentiment === 'bullish' ? 'text-success' :
              dataPoint.sentiment === 'risky' ? 'text-danger' :
              'text-warning'
            }`}>
              Outlook: {dataPoint.sentiment}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const todayIndex = historicalData.length - 1;

  const sentimentColors = {
    bullish: '#3FB950',
    neutral: '#D29922',
    risky: '#F85149'
  };

  const PredictionDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.sentiment) {
      return <circle cx={cx} cy={cy} r={3} fill={sentimentColors[payload.sentiment]} />;
    }
    return null;
  };
  
  const colors = {
    grid: '#30363D',
    axis: '#8B949E',
    historicalLine: '#E6EDF3',
    predictedLine: '#58A6FF',
    areaFill: '#58A6FF',
    refLine: '#8B949E'
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} strokeOpacity={0.5}/>
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12, fill: colors.axis }}
            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
            minTickGap={30}
            stroke={colors.axis}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: colors.axis }}
            tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
            domain={['dataMin - 10', 'dataMax + 10']}
            stroke={colors.axis}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.refLine, strokeDasharray: '3 3' }} />
          
          <ReferenceLine x={chartData[todayIndex]?.date} stroke={colors.refLine} strokeDasharray="2 2" />

          <defs>
            <linearGradient id="predictionArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.areaFill} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.areaFill} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="range"
            stroke={false}
            fill="url(#predictionArea)"
            data={chartData.slice(todayIndex)}
            connectNulls
            isAnimationActive={true}
            animationDuration={1500}
          />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={colors.historicalLine}
            strokeWidth={2}
            dot={false}
            data={chartData.slice(0, todayIndex + 1)}
            isAnimationActive={true}
            animationDuration={1000}
          />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={colors.predictedLine}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={<PredictionDot />}
            data={chartData.slice(todayIndex)}
            connectNulls
            isAnimationActive={true}
            animationDuration={1500}
            animationBegin={500}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-text-primary"></div>
          <span className="text-text-secondary">Historical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 border-t-2 border-dashed border-accent"></div>
          <span className="text-text-secondary">Predicted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
          <span className="text-text-secondary">Bullish</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
          <span className="text-text-secondary">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-danger"></div>
          <span className="text-text-secondary">Risky</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
