import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
  className,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisible / 2);
      const rightOffset = maxVisible - leftOffset - 1;
      
      if (currentPage <= leftOffset + 1) {
        for (let i = 1; i <= maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - rightOffset) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - leftOffset; i <= currentPage + rightOffset; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-stripe border border-border',
          'text-neutral-700 hover:bg-neutral-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center justify-center h-9 w-9 text-neutral-500"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={cn(
              'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-3 rounded-stripe border text-sm font-medium transition-colors',
              isActive
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-border text-neutral-700 hover:bg-neutral-50'
            )}
            aria-label={`Page ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-stripe border border-border',
          'text-neutral-700 hover:bg-neutral-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;
