import React, { useState } from 'react';
import { Eye, RefreshCw, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { Badge } from './ui/Badge.js';
import { Select, SelectOption } from './ui/Select.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table.js';
import { formatValue } from '../lib/file-utils.js';

const DataPreview = ({ processedData, fileData, onRefresh, onProceed }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const totalPages = Math.ceil(processedData.rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRows = processedData.rows.slice(startIndex, endIndex);
  
  const getColumnType = (headerName) => {
    const column = fileData.columns.find(col => col.name === headerName);
    return column?.type || 'text';
  };
  
  const formatCellValue = (value, headerName) => {
    const type = getColumnType(headerName);
    return formatValue(value, type);
  };
  
  const renderBooleanBadge = (value) => {
    const isTrue = Boolean(value);
    return (
      <Badge className={isTrue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {isTrue ? 'Yes' : 'No'}
      </Badge>
    );
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const handlePageSizeChange = (size) => {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  };
  
  return (
    <Card className="mb-8">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="inline-block mr-2 text-blue-600" size={20} />
            Data Preview
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              <span className="font-medium">{processedData.filteredCount.toLocaleString()}</span> of{' '}
              <span className="font-medium">{processedData.totalCount.toLocaleString()}</span> records
            </span>
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2" size={16} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {processedData.headers.map((header, index) => (
                  <TableHead key={index} className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => {
                    const header = processedData.headers[cellIndex];
                    const columnType = getColumnType(header);
                    
                    return (
                      <TableCell key={cellIndex} className="text-sm">
                        {columnType === 'boolean' ? (
                          renderBooleanBadge(cell)
                        ) : (
                          <span className={columnType === 'number' ? 'font-mono' : ''}>
                            {formatCellValue(cell, header)}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {processedData.rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No data matches your filter criteria.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange} className="w-20">
              <SelectOption value="10">10</SelectOption>
              <SelectOption value="25">25</SelectOption>
              <SelectOption value="50">50</SelectOption>
              <SelectOption value="100">100</SelectOption>
            </Select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onProceed} disabled={processedData.rows.length === 0} className="bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="mr-2" size={16} />
            Proceed to Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;