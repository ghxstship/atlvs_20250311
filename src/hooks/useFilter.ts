import { useState, useCallback } from 'react';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

interface FilterGroup {
  id: string;
  condition: 'and' | 'or';
  rules: (FilterRule | FilterGroup)[];
}

interface UseFilterOptions<T> {
  initialFilters?: FilterGroup;
  onFilterChange?: (filteredData: T[]) => void;
}

export function useFilter<T>({ initialFilters, onFilterChange }: UseFilterOptions<T> = {}) {
  const [filters, setFilters] = useState<FilterGroup>(initialFilters || {
    id: 'root',
    condition: 'and',
    rules: []
  });

  const evaluateRule = (item: T, rule: FilterRule): boolean => {
    const value = item[rule.field as keyof T];
    
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(rule.value).toLowerCase());
      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(rule.value).toLowerCase());
      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(rule.value).toLowerCase());
      case 'greaterThan':
        return Number(value) > Number(rule.value);
      case 'lessThan':
        return Number(value) < Number(rule.value);
      case 'between':
        const [min, max] = rule.value;
        return Number(value) >= Number(min) && Number(value) <= Number(max);
      case 'in':
        return Array.isArray(rule.value) ? rule.value.includes(value) : false;
      case 'notIn':
        return Array.isArray(rule.value) ? !rule.value.includes(value) : true;
      default:
        return false;
    }
  };

  const evaluateGroup = (item: T, group: FilterGroup): boolean => {
    const results = group.rules.map(rule => {
      if ('condition' in rule) {
        return evaluateGroup(item, rule);
      }
      return evaluateRule(item, rule);
    });

    return group.condition === 'and'
      ? results.every(Boolean)
      : results.some(Boolean);
  };

  const filterData = useCallback((data: T[]): T[] => {
    if (!filters.rules.length) return data;
    
    const filteredData = data.filter(item => evaluateGroup(item, filters));
    onFilterChange?.(filteredData);
    return filteredData;
  }, [filters, onFilterChange]);

  const updateFilters = (newFilters: FilterGroup) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      id: 'root',
      condition: 'and',
      rules: []
    });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filterData
  };
}