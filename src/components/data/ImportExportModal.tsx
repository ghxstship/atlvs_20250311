import React, { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { importFromCSV, validateCSV, transformCSVData } from '../../lib/csv';

interface ImportExportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: T[]) => Promise<void>;
  onExport: () => Promise<T[]>;
  requiredFields: (keyof T)[];
  fieldMappings: Record<string, keyof T>;
  templateData?: T[];
  entityName: string;
}

export default function ImportExportModal<T>({
  isOpen,
  onClose,
  onImport,
  onExport,
  requiredFields,
  fieldMappings,
  templateData,
  entityName
}: ImportExportModalProps<T>) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await importFromCSV(file);
      
      if (!validateCSV(data, requiredFields)) {
        throw new Error(`Invalid CSV format. Required fields: ${requiredFields.join(', ')}`);
      }

      const transformedData = transformCSVData<T>(data, fieldMappings);
      await onImport(transformedData as T[]);
      
      setSuccess(`Successfully imported ${transformedData.length} ${entityName}(s)`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    
    try {
      const data = await onExport();
      const filename = `${entityName.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      const link = document.createElement('a');
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setSuccess(`Successfully exported ${data.length} ${entityName}(s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!templateData) return;
    
    const filename = `${entityName.toLowerCase()}_template.csv`;
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-mono-900/75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-mono-200">
            <h3 className="text-lg font-medium text-mono-900">
              Import/Export {entityName}s
            </h3>
            <button
              onClick={onClose}
              className="text-mono-400 hover:text-mono-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Messages */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            {/* Import Section */}
            <div>
              <h4 className="text-sm font-medium text-mono-900 mb-2">Import Data</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm text-mono-500 mb-1">
                    Choose CSV file to import
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    disabled={isImporting}
                    className="block w-full text-sm text-mono-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-medium
                             file:bg-mono-900 file:text-white
                             hover:file:bg-accent
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {templateData && (
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center px-4 py-2 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-mono-500">
                Required fields: {requiredFields.join(', ')}
              </p>
            </div>

            {/* Export Section */}
            <div>
              <h4 className="text-sm font-medium text-mono-900 mb-2">Export Data</h4>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center px-4 py-2 text-sm text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </button>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-mono-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}