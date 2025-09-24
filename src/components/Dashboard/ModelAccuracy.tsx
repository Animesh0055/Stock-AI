import React from 'react';
import { CheckCircle } from 'lucide-react';
import { StockData } from '../../types';
import Card from '../UI/Card';

interface ModelAccuracyProps {
  accuracy: StockData['modelAccuracy'];
}

const ModelAccuracy: React.FC<ModelAccuracyProps> = ({ accuracy }) => {
  return (
    <Card padding="sm">
      <div className="flex items-center mb-3">
        <CheckCircle className="w-5 h-5 text-accent mr-2" />
        <h4 className="font-semibold text-text-primary">
          Model Prediction Accuracy
        </h4>
      </div>
      <div className="flex justify-around text-center">
        <div>
          <p className="font-bold text-2xl text-accent-light">
            {accuracy.past30days}%
          </p>
          <p className="text-xs text-text-secondary">Past 30 Days</p>
        </div>
        <div>
          <p className="font-bold text-2xl text-accent-light">
            {accuracy.past90days}%
          </p>
          <p className="text-xs text-text-secondary">Past 90 Days</p>
        </div>
      </div>
    </Card>
  );
};

export default ModelAccuracy;
