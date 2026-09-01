import React, { memo, useCallback } from 'react';
import { Search, Building2, ArrowUpDown, X } from 'lucide-react';

/**
 * SearchFilter — Cyberpunk Red High-Contrast Search and Filter Bar.
 */
const SearchFilter = memo(({
  searchQuery,
  onSearchChange,
  companyFilter,
  onCompanyChange,
  sortBy,
  onSortChange,
  companies = [],
  totalCount,
  filteredCount,
}) => {
  const isFiltered = Boolean(searchQuery || companyFilter || sortBy !== 'name-asc');

  const handleReset = useCallback(() => {
    onSearchChange('');
    onCompanyChange('');
    onSortChange('name-asc');
  }, [onSearchChange, onCompanyChange, onSortChange]);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl border border-zinc-850 bg-zinc-950/60 backdrop-blur-md">
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1">
        {/* Search Input (#SEARCH_FIELD) */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="#SEARCH_FIELD"
            aria-label="Search users by name, email, or handle"
            className="w-full pl-9 pr-9 py-2 font-mono text-xs sm:text-sm rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Company Dropdown Filter */}
        <div className="relative w-full sm:w-52 shrink-0">
          <Building2
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="company-filter"
            value={companyFilter}
            onChange={(e) => onCompanyChange(e.target.value)}
            aria-label="Filter users by company"
            className="w-full pl-8 pr-7 py-2 font-mono text-xs appearance-none rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 cursor-pointer focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
          >
            <option value="" className="bg-zinc-950 text-zinc-200">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c} className="bg-zinc-950 text-zinc-200">
                {c}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]" aria-hidden="true">
            ▼
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative w-full sm:w-48 shrink-0">
          <ArrowUpDown
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort users"
            className="w-full pl-8 pr-7 py-2 font-mono text-xs appearance-none rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 cursor-pointer focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
          >
            <option value="name-asc" className="bg-zinc-950 text-zinc-200">Sort: Name (A-Z)</option>
            <option value="name-desc" className="bg-zinc-950 text-zinc-200">Sort: Name (Z-A)</option>
            <option value="company-asc" className="bg-zinc-950 text-zinc-200">Sort: Company (A-Z)</option>
            <option value="company-desc" className="bg-zinc-950 text-zinc-200">Sort: Company (Z-A)</option>
            <option value="id-asc" className="bg-zinc-950 text-zinc-200">Sort: ID (Oldest)</option>
            <option value="id-desc" className="bg-zinc-950 text-zinc-200">Sort: ID (Newest)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]" aria-hidden="true">
            ▼
          </div>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            onClick={handleReset}
            aria-label="Reset all search, filter, and sort options"
            className="flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-xs font-semibold text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg hover:bg-red-900/40 hover:border-red-600 transition-all shrink-0 cursor-pointer"
          >
            <X size={13} />
            <span>[RESET]</span>
          </button>
        )}
      </div>

      {/* Results Status Count */}
      <div className="font-mono text-xs text-zinc-500 shrink-0 self-end lg:self-center">
        {isFiltered ? (
          <span>
            MATCH: <strong className="text-red-400 font-bold">{filteredCount}</strong> / {totalCount}
          </span>
        ) : (
          <span>
            TOTAL: <strong className="text-zinc-300 font-bold">{totalCount}</strong>
          </span>
        )}
      </div>
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';
export default SearchFilter;
