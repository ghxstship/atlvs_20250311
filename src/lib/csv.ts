import Papa from 'papaparse';

export async function exportToCSV<T>(data: T[], filename: string) {
  const csv = Papa.unparse(data, {
    header: true,
    skipEmptyLines: true
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function importFromCSV<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function validateCSV<T>(data: any[], requiredFields: (keyof T)[]): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;
  
  const firstRow = data[0];
  return requiredFields.every(field => field in firstRow);
}

export function transformCSVData<T>(data: any[], fieldMappings: Record<string, keyof T>): Partial<T>[] {
  return data.map(row => {
    const transformedRow: Partial<T> = {};
    Object.entries(fieldMappings).forEach(([csvField, modelField]) => {
      if (csvField in row) {
        transformedRow[modelField] = row[csvField];
      }
    });
    return transformedRow;
  });
}