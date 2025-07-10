import React, { useState } from 'react';
import { CheckSquare, Filter, Plus, X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { Checkbox } from './ui/Checkbox.js';
import { Badge } from './ui/Badge.js';
import { Select, SelectOption } from './ui/Select.js';
import { Input } from './ui/Input.js';
import { FILTER_OPERATORS } from '../types/index.js';

const FieldSelection = ({
  fileData,
  selectedFields,
  onSelectedFieldsChange,
  filterConditions,
  onFilterConditionsChange,
  onProceed
}) => {
  const [newFilterId, setNewFilterId] = useState(1);
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'date': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getOperatorsByType = (type) => {
    const base = [
      { value: FILTER_OPERATORS.EQUALS, label: 'Equals' },
      { value: FILTER_OPERATORS.NOT_EQUALS, label: 'Not equals' },
      { value: FILTER_OPERATORS.IS_EMPTY, label: 'Is empty' },
      { value: FILTER_OPERATORS.IS_NOT_EMPTY, label: 'Is not empty' },
    ];
    
    switch (type) {
      case 'text':
        return [
          ...base,
          { value: FILTER_OPERATORS.CONTAINS, label: 'Contains' },
          { value: FILTER_OPERATORS.NOT_CONTAINS, label: 'Not contains' },
          { value: FILTER_OPERATORS.STARTS_WITH, label: 'Starts with' },
          { value: FILTER_OPERATORS.ENDS_WITH, label: 'Ends with' },
        ];
      case 'number':
        return [
          ...base,
          { value: FILTER_OPERATORS.GREATER_THAN, label: 'Greater than' },
          { value: FILTER_OPERATORS.LESS_THAN, label: 'Less than' },
          { value: FILTER_OPERATORS.GREATER_EQUAL, label: 'Greater or equal' },
          { value: FILTER_OPERATORS.LESS_EQUAL, label: 'Less or equal' },
        ];
      case 'boolean':
        return [
          { value: FILTER_OPERATORS.IS_TRUE, label: 'Is true' },
          { value: FILTER_OPERATORS.IS_FALSE, label: 'Is false' },
        ];
      default:
        return base;
    }
  };
  
  const handleFieldToggle = (fieldName) => {
    const newFields = selectedFields.includes(fieldName)
      ? selectedFields.filter(f => f !== fieldName)
      : [...selectedFields, fieldName];
    onSelectedFieldsChange(newFields);
  };
  
  const addFilterCondition = () => {
    const newCondition = {
      id: `filter_${newFilterId}`,
      field: fileData.columns[0]?.name || '',
      operator: FILTER_OPERATORS.EQUALS,
      value: ''
    };
    onFilterConditionsChange([...filterConditions, newCondition]);
    setNewFilterId(prev => prev + 1);
  };
  
  const removeFilterCondition = (id) => {
    onFilterConditionsChange(filterConditions.filter(c => c.id !== id));
  };
  
  const updateFilterCondition = (id, updates) => {
    onFilterConditionsChange(
      filterConditions.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };
  
  const renderValueInput = (condition) => {
    const column = fileData.columns.find(col => col.name === condition.field);
    if (!column) return null;
    
    if (condition.operator === FILTER_OPERATORS.IS_EMPTY || condition.operator === FILTER_OPERATORS.IS_NOT_EMPTY) {
      return null;
    }
    
    if (condition.operator === FILTER_OPERATORS.IS_TRUE || condition.operator === FILTER_OPERATORS.IS_FALSE) {
      return null;
    }
    
    if (column.type === 'boolean') {
      return (
        <Select
          value={String(condition.value)}
          onValueChange={(value) => updateFilterCondition(condition.id, { value })}
        >
          <SelectOption value="">Select value</SelectOption>
          <SelectOption value="true">Yes</SelectOption>
          <SelectOption value="false">No</SelectOption>
        </Select>
      );
    }
    
    return (
      <Input
        type={column.type === 'number' ? 'number' : 'text'}
        value={condition.value}
        onChange={(e) => updateFilterCondition(condition.id, { value: e.target.value })}
        placeholder="Enter value"
      />
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="inline-block mr-2 text-blue-600" size={20} />
            Select Output Fields
          </h2>
          
          <div className="space-y-3">
            {fileData.columns.map((column) => (
              <div key={column.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedFields.includes(column.name)}
                    onCheckedChange={() => handleFieldToggle(column.name)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-900">{column.name}</span>
                </div>
                <Badge className={getTypeColor(column.type)}>
                  {column.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="inline-block mr-2 text-blue-600" size={20} />
            Filter Conditions
          </h2>
          
          <div className="space-y-4">
            {filterConditions.map((condition, index) => {
              const column = fileData.columns.find(col => col.name === condition.field);
              return (
                <div key={condition.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">Filter {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilterCondition(condition.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Field</label>
                      <Select
                        value={condition.field}
                        onValueChange={(value) => updateFilterCondition(condition.id, { field: value, operator: FILTER_OPERATORS.EQUALS, value: '' })}
                      >
                        {fileData.columns.map(col => (
                          <SelectOption key={col.name} value={col.name}>{col.name}</SelectOption>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Condition</label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateFilterCondition(condition.id, { operator: value, value: '' })}
                      >
                        {getOperatorsByType(column?.type || 'text').map(op => (
                          <SelectOption key={op.value} value={op.value}>{op.label}</SelectOption>
                        ))}
                      </Select>
                    </div>
                    {renderValueInput(condition) && (
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Value</label>
                        {renderValueInput(condition)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button
            onClick={addFilterCondition}
            variant="outline"
            className="w-full mt-4 border-2 border-dashed border-gray-300 hover:border-gray-400"
          >
            <Plus className="mr-2" size={16} />
            Add Filter Condition
          </Button>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2 flex justify-end">
        <Button onClick={onProceed} disabled={selectedFields.length === 0} className="bg-blue-600 hover:bg-blue-700">
          <ArrowRight className="mr-2" size={16} />
          Preview Data
        </Button>
      </div>
    </div>
  );
};

export default FieldSelection;