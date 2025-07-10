import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { detectColumnType, normalizeValue, formatValue } from './file-utils.js';
import { COLUMN_TYPES, FILTER_OPERATORS } from '../types/index.js';

export class ExcelProcessor {
  static async processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to array of arrays
          const rawData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1, 
            defval: '',
            blankrows: false
          });
          
          if (rawData.length === 0) {
            reject(new Error('The file appears to be empty'));
            return;
          }
          
          // Extract headers (first row)
          const headers = rawData[0] || [];
          const dataRows = rawData.slice(1);
          
          // Analyze columns
          const columns = headers.map((header, index) => {
            const columnValues = dataRows.map(row => row[index] || '');
            const sampleValues = columnValues.slice(0, 100); // Sample first 100 values
            const type = detectColumnType(sampleValues);
            
            return {
              name: String(header || `Column ${index + 1}`),
              type,
              index,
              sampleValues: sampleValues.slice(0, 5) // Keep only 5 sample values
            };
          });
          
          const fileData = {
            fileName: file.name,
            totalRows: dataRows.length,
            totalColumns: headers.length,
            rawData,
            columns
          };
          
          resolve(fileData);
        } catch (error) {
          reject(new Error('Failed to process the file. Please ensure it\'s a valid Excel or CSV file.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  }
  
  static filterData(fileData, selectedFields, filterConditions) {
    const { rawData, columns } = fileData;
    
    if (rawData.length === 0) {
      return {
        headers: [],
        rows: [],
        totalCount: 0,
        filteredCount: 0
      };
    }
    
    const headers = rawData[0] || [];
    const dataRows = rawData.slice(1);
    
    // Get indices of selected fields
    const selectedIndices = selectedFields.map(fieldName => 
      columns.findIndex(col => col.name === fieldName)
    ).filter(index => index !== -1);
    
    // Filter selected headers
    const filteredHeaders = selectedIndices.map(index => headers[index]);
    
    // Apply filter conditions
    const filteredRows = dataRows.filter(row => {
      return filterConditions.every(condition => {
        const columnIndex = columns.findIndex(col => col.name === condition.field);
        if (columnIndex === -1) return true;
        
        const column = columns[columnIndex];
        const cellValue = row[columnIndex];
        const normalizedValue = normalizeValue(cellValue, column.type);
        
        return this.evaluateCondition(normalizedValue, condition, column.type);
      });
    });
    
    // Extract only selected columns from filtered rows
    const processedRows = filteredRows.map(row => 
      selectedIndices.map(index => row[index] || '')
    );
    
    return {
      headers: filteredHeaders,
      rows: processedRows,
      totalCount: dataRows.length,
      filteredCount: filteredRows.length
    };
  }
  
  static evaluateCondition(value, condition, columnType) {
    const { operator, value: conditionValue } = condition;
    
    switch (operator) {
      case FILTER_OPERATORS.EQUALS:
        return String(value).toLowerCase() === String(conditionValue).toLowerCase();
      case FILTER_OPERATORS.NOT_EQUALS:
        return String(value).toLowerCase() !== String(conditionValue).toLowerCase();
      case FILTER_OPERATORS.CONTAINS:
        return String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
      case FILTER_OPERATORS.NOT_CONTAINS:
        return !String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
      case FILTER_OPERATORS.STARTS_WITH:
        return String(value).toLowerCase().startsWith(String(conditionValue).toLowerCase());
      case FILTER_OPERATORS.ENDS_WITH:
        return String(value).toLowerCase().endsWith(String(conditionValue).toLowerCase());
      case FILTER_OPERATORS.GREATER_THAN:
        return Number(value) > Number(conditionValue);
      case FILTER_OPERATORS.LESS_THAN:
        return Number(value) < Number(conditionValue);
      case FILTER_OPERATORS.GREATER_EQUAL:
        return Number(value) >= Number(conditionValue);
      case FILTER_OPERATORS.LESS_EQUAL:
        return Number(value) <= Number(conditionValue);
      case FILTER_OPERATORS.IS_TRUE:
        return Boolean(value) === true;
      case FILTER_OPERATORS.IS_FALSE:
        return Boolean(value) === false;
      case FILTER_OPERATORS.IS_EMPTY:
        return value === '' || value === null || value === undefined;
      case FILTER_OPERATORS.IS_NOT_EMPTY:
        return value !== '' && value !== null && value !== undefined;
      default:
        return true;
    }
  }
  
  static async exportData(processedData, fileData, options) {
    const { headers, rows } = processedData;
    const { fileName, format, includeHeaders } = options;
    
    const exportData = includeHeaders ? [headers, ...rows] : rows;
    
    switch (format) {
      case 'xlsx':
        await this.exportToExcel(exportData, fileName);
        break;
      case 'csv':
        await this.exportToCSV(exportData, fileName);
        break;
      case 'json':
        await this.exportToJSON(headers, rows, fileName, includeHeaders);
        break;
      default:
        throw new Error('Unsupported export format');
    }
  }
  
  static async exportToExcel(data, fileName) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Auto-size columns
    const colWidths = data[0]?.map((_, colIndex) => {
      const maxLength = Math.max(
        ...data.map(row => String(row[colIndex] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    }) || [];
    
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Filtered Data');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `${fileName}.xlsx`);
  }
  
  static async exportToCSV(data, fileName) {
    const csvContent = data.map(row => 
      row.map(cell => {
        const str = String(cell || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }
  
  static async exportToJSON(headers, rows, fileName, includeHeaders) {
    const jsonData = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json' 
    });
    saveAs(blob, `${fileName}.json`);
  }
}