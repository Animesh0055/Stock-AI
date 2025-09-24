import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className 
}) => {
  const variantClasses = {
    success: 'bg-success-surface text-success-light border border-success-border',
    danger: 'bg-danger-surface text-danger-light border border-danger-border',
    warning: 'bg-warning-surface text-warning-light border border-warning-border',
    info: 'bg-primary/10 text-primary-light border border-primary/20',
    neutral: 'bg-surface-light text-text-secondary border border-border'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
