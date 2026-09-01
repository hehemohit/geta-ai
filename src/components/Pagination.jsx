import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Pagination — Dynamic Cyberpunk Theme Client-Side Pagination.
 */
const Pagination = memo(({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const { activePreset } = useTheme();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-zinc-900 font-mono"
      aria-label="Pagination Navigation"
    >
      {/* Range Status */}
      <div className="text-xs text-zinc-500">
        Showing <span className="text-zinc-300 font-medium">{startItem}</span> to{' '}
        <span className="text-zinc-300 font-medium">{endItem}</span> of{' '}
        <span className="font-semibold transition-colors" style={{ color: activePreset.hex }}>
          {totalItems}
        </span>{' '}
        users
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 bg-zinc-950 border border-zinc-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft size={13} />
          <span>Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1.5">
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
                className={`min-w-[30px] h-7.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-lg scale-105 border'
                    : 'text-zinc-400 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: activePreset.hex,
                        borderColor: activePreset.hex,
                        boxShadow: `0 0 12px ${activePreset.glow}`,
                      }
                    : undefined
                }
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 bg-zinc-950 border border-zinc-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </nav>
  );
});

Pagination.displayName = 'Pagination';
export default Pagination;
