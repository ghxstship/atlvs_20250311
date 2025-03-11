import { useState, useCallback, useMemo } from 'react';
import { HistoryFilters } from '../components/history/HistoryFilter';

interface UseHistoryFilterOptions<T> {
  data: T[];
  searchFields?: (keyof T)[];
}

export function useHistoryFilter<T>({ data, searchFields = [] }: UseHistoryFilterOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [sortField, setSortField] = useState<keyof T>('timestamp' as keyof T);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term.toLowerCase());
  }, []);

  const handleFilter = useCallback((newFilters: HistoryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field as keyof T);
    setSortDirection(direction);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item => 
        searchFields.some(field => 
          String(item[field]).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply filters
    if (filters.dateRange) {
      result = result.filter(item => {
        const timestamp = new Date(item['timestamp' as keyof T] as string).getTime();
        const start = new Date(filters.dateRange.start).getTime();
        const end = new Date(filters.dateRange.end).getTime();
        return timestamp >= start && timestamp <= end;
      });
    }

    if (filters.users?.length) {
      result = result.filter(item => 
        filters.users!.includes((item['user' as keyof T] as any).name)
      );
    }

    if (filters.types?.length) {
      result = result.filter(item =>
        filters.types!.includes(item['type' as keyof T] as string)
      );
    }

    if (filters.hasMetadata) {
      result = result.filter(item => {
        const metadata = item['metadata' as keyof T] as Record<string, any>;
        return metadata && Object.keys(metadata).length > 0;
      });
    }

    if (filters.canRevert) {
      result = result.filter(item => item['canRevert' as keyof T] as boolean);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });

    return result;
  }, [data, searchTerm, filters, sortField, sortDirection, searchFields]);

  return {
    filteredData,
    handleSearch,
    handleFilter,
    handleSort,
    searchTerm,
    filters,
    sortField,
    sortDirection
  };
}