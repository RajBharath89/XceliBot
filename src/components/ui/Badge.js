import React from 'react';

const badgeVariants = {
  default: 'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
  secondary: 'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
  destructive: 'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
  outline: 'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};