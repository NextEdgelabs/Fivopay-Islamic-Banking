'use client';

import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon 
} from '@heroicons/react/24/outline';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showJumpToPage?: boolean;
  className?: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showJumpToPage = true,
  className = ''
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleJumpToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const page = parseInt(formData.get('page') as string);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-stripe-surface border-t border-stripe-border ${className}`}>
      {/* Items info and page size selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-sm text-stripe-text-secondary">
          Showing <span className="font-medium text-stripe-text">{startItem}</span> to{' '}
          <span className="font-medium text-stripe-text">{endItem}</span> of{' '}
          <span className="font-medium text-stripe-text">{totalItems}</span> results
        </div>

        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-stripe-text-secondary">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="form-input text-sm py-1 px-2 border border-stripe-border rounded focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-stripe-text-secondary">per page</span>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-stripe-border text-stripe-text-secondary hover:bg-stripe-background disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-stripe-border text-stripe-text-secondary hover:bg-stripe-background disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-stripe-text-secondary">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-stripe-primary text-white border border-stripe-primary'
                      : 'border border-stripe-border text-stripe-text hover:bg-stripe-background'
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-stripe-border text-stripe-text-secondary hover:bg-stripe-background disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-stripe-border text-stripe-text-secondary hover:bg-stripe-background disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronDoubleRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Jump to page */}
      {showJumpToPage && totalPages > 5 && (
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <label htmlFor="jumpPage" className="text-sm text-stripe-text-secondary">
            Go to:
          </label>
          <input
            id="jumpPage"
            name="page"
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            className="w-16 px-2 py-1 text-sm border border-stripe-border rounded focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-stripe-primary text-white rounded hover:bg-stripe-primary-dark transition-colors"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
