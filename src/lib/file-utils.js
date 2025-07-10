import { COLUMN_TYPES, SUPPORTED_FILE_TYPES } from '../types/index.js';

export const detectColumnType = (values) => {
  const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonEmptyValues.length === 0) return COLUMN_TYPES.TEXT;
  
  // Check for boolean values
  const booleanCount = nonEmptyValues.filter(v => {
    const str = String(v).toLowerCase();
    return str === 'true' || str === 'false' || str === 'yes' || str === 'no' || 
           str === '1' || str === '0' || str === 'y' || str === 'n';
  }).length;
  
  if (booleanCount / nonEmptyValues.length > 0.8) {
    return COLUMN_TYPES.BOOLEAN;
  }
  
  // Check for numbers
  const numberCount = nonEmptyValues.filter(v => {
    const num = Number(v);
    return !isNaN(num) && isFinite(num);
  }).length;
  
  if (numberCount / nonEmptyValues.length > 0.8) {
    return COLUMN_TYPES.NUMBER;
  }
  
  // Check for dates
  const dateCount = nonEmptyValues.filter(v => {
    const date = new Date(v);
    return !isNaN(date.getTime());
  }).length;
  
  if (dateCount / nonEmptyValues.length > 0.8) {
    return COLUMN_TYPES.DATE;
  }
  
  return COLUMN_TYPES.TEXT;
};

export const normalizeValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  switch (type) {
    case COLUMN_TYPES.BOOLEAN:
      const str = String(value).toLowerCase();
      return str === 'true' || str === 'yes' || str === '1' || str === 'y';
    case COLUMN_TYPES.NUMBER:
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case COLUMN_TYPES.DATE:
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    default:
      return String(value);
  }
};

export const formatValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  switch (type) {
    case COLUMN_TYPES.BOOLEAN:
      return value ? 'Yes' : 'No';
    case COLUMN_TYPES.NUMBER:
      return typeof value === 'number' ? value.toString() : String(value);
    case COLUMN_TYPES.DATE:
      return value instanceof Date ? value.toLocaleDateString() : String(value);
    default:
      return String(value);
  }
};

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  if (!SUPPORTED_FILE_TYPES.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
    return { valid: false, error: 'Only Excel (.xlsx, .xls) and CSV files are supported' };
  }
  
  return { valid: true };
};