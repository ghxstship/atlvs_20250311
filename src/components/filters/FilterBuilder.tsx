import React, { useState } from 'react';
import { Filter, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

type Operator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn';
type Condition = 'and' | 'or';

interface FilterRule {
  id: string;
  field: string;
  operator: Operator;
  value: any;
}

interface FilterGroup {
  id: string;
  condition: Condition;
  rules: (FilterRule | FilterGroup)[];
}

interface FilterBuilderProps {
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    options?: { label: string; value: any; }[];
  }[];
  value: FilterGroup;
  onChange: (value: FilterGroup) => void;
  onApply: () => void;
  onReset: () => void;
}

const operatorOptions: Record<string, { label: string; supportedTypes: string[]; }> = {
  equals: { label: 'Equals', supportedTypes: ['text', 'number', 'date', 'select', 'boolean'] },
  contains: { label: 'Contains', supportedTypes: ['text'] },
  startsWith: { label: 'Starts with', supportedTypes: ['text'] },
  endsWith: { label: 'Ends with', supportedTypes: ['text'] },
  greaterThan: { label: 'Greater than', supportedTypes: ['number', 'date'] },
  lessThan: { label: 'Less than', supportedTypes: ['number', 'date'] },
  between: { label: 'Between', supportedTypes: ['number', 'date'] },
  in: { label: 'In', supportedTypes: ['text', 'number', 'select'] },
  notIn: { label: 'Not in', supportedTypes: ['text', 'number', 'select'] }
};

export default function FilterBuilder({
  fields,
  value,
  onChange,
  onApply,
  onReset
}: FilterBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addRule = (groupId: string) => {
    const newRule: FilterRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: fields[0].name,
      operator: 'equals',
      value: ''
    };

    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [...group.rules, newRule]
        };
      }

      return {
        ...group,
        rules: group.rules.map(rule => 
          'condition' in rule ? updateGroup(rule) : rule
        )
      };
    };

    onChange(updateGroup(value));
  };

  const addGroup = (parentId: string) => {
    const newGroup: FilterGroup = {
      id: Math.random().toString(36).substr(2, 9),
      condition: 'and',
      rules: []
    };

    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === parentId) {
        return {
          ...group,
          rules: [...group.rules, newGroup]
        };
      }

      return {
        ...group,
        rules: group.rules.map(rule => 
          'condition' in rule ? updateGroup(rule) : rule
        )
      };
    };

    onChange(updateGroup(value));
  };

  const removeRule = (groupId: string, ruleId: string) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.filter(rule => 
            'condition' in rule ? true : rule.id !== ruleId
          )
        };
      }

      return {
        ...group,
        rules: group.rules.map(rule => 
          'condition' in rule ? updateGroup(rule) : rule
        )
      };
    };

    onChange(updateGroup(value));
  };

  const updateRule = (groupId: string, ruleId: string, updates: Partial<FilterRule>) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.map(rule => {
            if ('condition' in rule) return rule;
            if (rule.id === ruleId) return { ...rule, ...updates };
            return rule;
          })
        };
      }

      return {
        ...group,
        rules: group.rules.map(rule => 
          'condition' in rule ? updateGroup(rule) : rule
        )
      };
    };

    onChange(updateGroup(value));
  };

  const updateGroupCondition = (groupId: string, condition: Condition) => {
    const updateGroup = (group: FilterGroup): FilterGroup => {
      if (group.id === groupId) {
        return { ...group, condition };
      }

      return {
        ...group,
        rules: group.rules.map(rule => 
          'condition' in rule ? updateGroup(rule) : rule
        )
      };
    };

    onChange(updateGroup(value));
  };

  const renderGroup = (group: FilterGroup, level = 0) => {
    return (
      <div className={`space-y-4 ${level > 0 ? 'ml-6 pl-4 border-l border-mono-200' : ''}`}>
        <div className="flex items-center space-x-4">
          <select
            value={group.condition}
            onChange={(e) => updateGroupCondition(group.id, e.target.value as Condition)}
            className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => addRule(group.id)}
              className="flex items-center px-2 py-1 text-sm text-mono-700 hover:text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </button>
            <button
              onClick={() => addGroup(group.id)}
              className="flex items-center px-2 py-1 text-sm text-mono-700 hover:text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Group
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {group.rules.map((rule, index) => (
            <div key={rule.id}>
              {'condition' in rule ? (
                renderGroup(rule, level + 1)
              ) : (
                <div className="flex items-center space-x-4">
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(group.id, rule.id, { field: e.target.value })}
                    className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500"
                  >
                    {fields.map(field => (
                      <option key={field.name} value={field.name}>{field.label}</option>
                    ))}
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(group.id, rule.id, { operator: e.target.value as Operator })}
                    className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500"
                  >
                    {Object.entries(operatorOptions)
                      .filter(([_, op]) => {
                        const field = fields.find(f => f.name === rule.field);
                        return field && op.supportedTypes.includes(field.type);
                      })
                      .map(([key, op]) => (
                        <option key={key} value={key}>{op.label}</option>
                      ))
                    }
                  </select>

                  {rule.operator === 'between' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={Array.isArray(rule.value) ? rule.value[0] : ''}
                        onChange={(e) => updateRule(group.id, rule.id, { 
                          value: [e.target.value, Array.isArray(rule.value) ? rule.value[1] : ''] 
                        })}
                        className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500 w-32"
                        placeholder="From"
                      />
                      <span className="text-mono-500">to</span>
                      <input
                        type="text"
                        value={Array.isArray(rule.value) ? rule.value[1] : ''}
                        onChange={(e) => updateRule(group.id, rule.id, { 
                          value: [Array.isArray(rule.value) ? rule.value[0] : '', e.target.value] 
                        })}
                        className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500 w-32"
                        placeholder="To"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                      className="text-sm border border-mono-300 rounded-lg px-3 py-1.5 focus:ring-mono-500 focus:border-mono-500"
                      placeholder="Value"
                    />
                  )}

                  <button
                    onClick={() => removeRule(group.id, rule.id)}
                    className="p-1 text-mono-400 hover:text-red-500 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-mono-400 mr-2" />
          <h3 className="text-lg font-medium text-mono-900">Advanced Filters</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-mono-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-mono-400" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-mono-200">
          {renderGroup(value)}

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-mono-200">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 text-sm text-white bg-mono-900 rounded-lg hover:bg-accent"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}