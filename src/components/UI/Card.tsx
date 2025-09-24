import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean | 'glow';
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={clsx(
        'bg-surface/80 backdrop-blur-sm rounded-xl border border-border transition-all duration-300',
        hover && 'hover:border-accent/50 hover:shadow-glow-accent',
        hover === 'glow' && 'hover:shadow-glow-pink',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
