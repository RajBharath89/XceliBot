// Type definitions for the Excel Data Processor

export const SUPPORTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/csv'
];

export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date'
};

export const FILTER_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_EQUAL: 'greater_equal',
  LESS_EQUAL: 'less_equal',
  IS_TRUE: 'is_true',
  IS_FALSE: 'is_false',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty'
};

export const EXPORT_FORMATS = {
  XLSX: 'xlsx',
  CSV: 'csv',
  JSON: 'json'
};

export const WORKFLOW_STEPS = {
  UPLOAD: 'upload',
  ANALYSIS: 'analysis',
  SELECTION: 'selection',
  PREVIEW: 'preview',
  EXPORT: 'export'
};