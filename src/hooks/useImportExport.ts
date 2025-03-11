import { useState } from 'react';
import { exportToCSV, importFromCSV, validateCSV, transformCSVData } from '../lib/csv';

interface UseImportExportOptions<T> {
  requiredFields: (keyof T)[];
  fieldMappings: Record<string, keyof T>;
  onImportSuccess?: (data: T[]) => void;
  onImportError?: (error: Error) => void;
  onExportSuccess?: (filename: string) => void;
  onExportError?: (error: Error) => void;
  validateImport?: (data: T[]) => boolean | Promise<boolean>;
  transformImport?: (data: T[]) => T[] | Promise<T[]>;
  getExportData?: () => T[] | Promise<T[]>;
}

export function useImportExport<T>({
  requiredFields,
  fieldMappings,
  onImportSuccess,
  onImportError,
  onExportSuccess,
  onExportError,
  validateImport,
  transformImport,
  getExportData
}: UseImportExportOptions<T>) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (file: File): Promise<T[]> => {
    setIsImporting(true);
    setError(null);

    try {
      const data = await importFromCSV<T>(file);
      
      if (!validateCSV(data, requiredFields)) {
        throw new Error(`Invalid CSV format. Required fields: ${requiredFields.join(', ')}`);
      }

      let transformedData = transformCSVData<T>(data, fieldMappings) as T[];
      
      if (validateImport) {
        const isValid = await validateImport(transformedData);
        if (!isValid) {
          throw new Error('Data validation failed');
        }
      }

      if (transformImport) {
        transformedData = await transformImport(transformedData);
      }

      onImportSuccess?.(transformedData);
      return transformedData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Import failed');
      setError(error.message);
      onImportError?.(error);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (filename: string): Promise<void> => {
    setIsExporting(true);
    setError(null);

    try {
      let data: T[];
      
      if (getExportData) {
        data = await getExportData();
      } else {
        throw new Error('Export data source not provided');
      }

      await exportToCSV(data, filename);
      onExportSuccess?.(filename);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      setError(error.message);
      onExportError?.(error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleImport,
    handleExport,
    isImporting,
    isExporting,
    error,
    setError
  };
}