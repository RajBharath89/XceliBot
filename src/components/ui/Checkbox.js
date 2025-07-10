import React from 'react';

export const Checkbox = ({ 
  checked = false, 
  onCheckedChange, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      disabled={disabled}
      className={`h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};