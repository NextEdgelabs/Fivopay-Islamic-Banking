'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Loading from './Loading';
import EmptyState from './EmptyState';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  if (loading) {
    return (
      <div className="bg-white rounded-stripe border border-border-light p-12">
        <Loading text="Loading data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-stripe border border-border-light">
        <EmptyState title={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-stripe border border-border-light overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-border-light">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer select-none hover:bg-neutral-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            'h-3 w-3 -mb-1',
                            sortConfig?.key === column.key &&
                              sortConfig.direction === 'asc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'h-3 w-3',
                            sortConfig?.key === column.key &&
                              sortConfig.direction === 'desc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {sortedData?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={(e) => {
                  // Only trigger if clicking directly on the row, not on interactive elements
                  const target = e.target as HTMLElement;
                  const isInteractive = target.closest('button, a, input, select, textarea, [role="button"]');
                  if (isInteractive) {
                    return;
                  }
                  console.log('Row click triggered:', row);
                  onRowClick?.(row, rowIndex);
                }}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-neutral-50 active:bg-neutral-100'
                )}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={cn(
                      "px-6 py-4 text-sm text-neutral-900",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.displayName = 'Table';

export default Table;
