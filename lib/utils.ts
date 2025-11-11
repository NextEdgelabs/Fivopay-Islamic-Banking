import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0, // No decimals for cleaner display
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Converts an array of objects to CSV format and triggers download
 * @param data Array of objects to export
 * @param filename Name of the CSV file (without extension)
 * @param headers Optional custom headers. If not provided, uses object keys
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine headers
  let csvHeaders: string[];
  let keys: (keyof T)[];

  if (headers) {
    csvHeaders = headers.map(h => h.label);
    keys = headers.map(h => h.key);
  } else {
    keys = Object.keys(data[0]) as (keyof T)[];
    csvHeaders = keys as string[];
  }

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV content
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(csvHeaders.map(escapeCSV).join(','));

  // Add data rows
  data.forEach(row => {
    const values = keys.map(key => {
      const value = row[key];
      // Format dates
      if (value && typeof value === 'object' && (value as any) instanceof Date) {
        return (value as Date).toISOString();
      }
      // Format objects/arrays as JSON string
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value;
    });
    csvRows.push(values.map(escapeCSV).join(','));
  });

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}