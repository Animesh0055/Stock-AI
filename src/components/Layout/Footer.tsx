import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/50 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-text-secondary">
          <p className="font-semibold text-text-primary mb-2">
            Disclaimer
          </p>
          <p className="mb-4 max-w-3xl mx-auto">
            This is an AI prediction based on past patterns and simulated data. It is not financial advice. All investment decisions should be made with the consultation of a qualified financial advisor. Past performance and AI predictions are not indicative of future results.
          </p>
          <p>
            &copy; {new Date().getFullYear()} BlackBull. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
