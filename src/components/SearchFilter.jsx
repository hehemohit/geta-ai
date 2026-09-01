import React, { memo, useCallback } from 'react';
import { Search, Building2, ArrowUpDown, X } from 'lucide-react';

/**
 * SearchFilter — Enhanced search, filter, and sorting controls.
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
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-gray-900/60 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-sm backdrop-blur-sm">
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, username..."
            aria-label="Search users by name, email, or username"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-gray-950/80 border border-gray-700/70 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Clear search input"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Company Dropdown Filter */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Building2
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="company-filter"
            value={companyFilter}
            onChange={(e) => onCompanyChange(e.target.value)}
            aria-label="Filter users by company"
            className="w-full pl-10 pr-8 py-2.5 text-sm appearance-none rounded-xl bg-gray-950/80 border border-gray-700/70 text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
          >
            <option value="" className="bg-gray-900 text-gray-100">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c} className="bg-gray-900 text-gray-100">
                {c}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs" aria-hidden="true">
            ▼
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative w-full sm:w-52 shrink-0">
          <ArrowUpDown
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort users"
            className="w-full pl-10 pr-8 py-2.5 text-sm appearance-none rounded-xl bg-gray-950/80 border border-gray-700/70 text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
          >
            <option value="name-asc" className="bg-gray-900 text-gray-100">Name (A → Z)</option>
            <option value="name-desc" className="bg-gray-900 text-gray-100">Name (Z → A)</option>
            <option value="company-asc" className="bg-gray-900 text-gray-100">Company (A → Z)</option>
            <option value="company-desc" className="bg-gray-900 text-gray-100">Company (Z → A)</option>
            <option value="id-asc" className="bg-gray-900 text-gray-100">User ID (Oldest)</option>
            <option value="id-desc" className="bg-gray-900 text-gray-100">User ID (Newest)</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs" aria-hidden="true">
            ▼
          </div>
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            onClick={handleReset}
            aria-label="Reset all search, filter, and sort options"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all shrink-0 cursor-pointer"
          >
            <X size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results Counter */}
      <div className="text-xs sm:text-sm text-gray-400 shrink-0 self-end lg:self-center">
        {isFiltered ? (
          <span>
            Showing <strong className="text-cyan-400 font-semibold">{filteredCount}</strong> of{' '}
            <strong className="text-gray-200 font-semibold">{totalCount}</strong> users
          </span>
        ) : (
          <span>
            Total: <strong className="text-gray-200 font-semibold">{totalCount}</strong> users
          </span>
        )}
      </div>
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';
export default SearchFilter;
