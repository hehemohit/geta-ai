import React from 'react';

/* ── Skeleton card — matches UserCard proportions ──────────────── */
const SkeletonCard = () => (
  <div className="p-5 flex flex-col justify-between rounded-xl bg-slate-900/80 border border-slate-800 animate-pulse">
    <div>
      {/* Avatar + name row */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      {/* Detail rows */}
      <div className="space-y-2 py-1">
        <div className="h-4 bg-slate-800/80 rounded w-full" />
        <div className="h-4 bg-slate-800/80 rounded w-5/6" />
        <div className="h-4 bg-slate-800/80 rounded w-4/6" />
        <div className="h-4 bg-slate-800/80 rounded w-3/4" />
      </div>
    </div>
    {/* Action buttons */}
    <div className="flex gap-2 pt-4 mt-4 border-t border-slate-800">
      <div className="h-7 bg-slate-800 rounded-lg flex-1" />
      <div className="h-7 bg-slate-800 rounded-lg flex-1" />
      <div className="h-7 bg-slate-800 rounded-lg flex-1" />
    </div>
  </div>
);

/* ── Skeleton grid — 8 cards ───────────────────────────────────── */
export const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* ── Spinner — used inside buttons ────────────────────────────── */
export const ButtonSpinner = ({ size = 14 }) => (
  <svg
    style={{ width: size, height: size }}
    className="animate-spin shrink-0"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="3"
    />
    <path
      className="opacity-80"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ── Full-page loader ─────────────────────────────────────────── */
const Loader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
    <p className="text-sm text-slate-400 tracking-wide">{message}</p>
  </div>
);

export default Loader;
