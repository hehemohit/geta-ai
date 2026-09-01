import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination — Clean client-side pagination component with accessibility support.
 */
const Pagination = memo(({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-800/80"
      aria-label="Pagination Navigation"
    >
      {/* Items Range Display */}
      <div className="text-xs sm:text-sm text-gray-400">
        Showing <span className="font-semibold text-gray-200">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-200">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-200">{totalItems}</span> users
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 bg-gray-900 border border-gray-800 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
              className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-gray-400 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 bg-gray-900 border border-gray-800 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
});

Pagination.displayName = 'Pagination';
export default Pagination;
