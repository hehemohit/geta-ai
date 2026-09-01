import React from 'react';

/* ── Skeleton card — matches Cyberpunk UserCard proportions ──────── */
const SkeletonCard = () => (
  <div className="rounded-xl border border-zinc-850 bg-zinc-950/70 p-4 sm:p-5 animate-pulse">
    {/* Avatar + name row */}
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-lg bg-zinc-800/80 shrink-0 border border-zinc-700/50" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-zinc-800 rounded w-2/5" />
        <div className="h-3 bg-zinc-850 rounded w-1/4" />
      </div>
    </div>
    {/* Detail rows */}
    <div className="mt-4 space-y-2 pt-3 border-t border-zinc-900">
      <div className="h-3.5 bg-zinc-850 rounded w-3/4" />
      <div className="h-3.5 bg-zinc-850 rounded w-1/2" />
      <div className="h-3.5 bg-zinc-850 rounded w-2/3" />
      <div className="h-3.5 bg-zinc-850 rounded w-3/5" />
    </div>
    {/* Action buttons */}
    <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-zinc-900">
      <div className="h-7 w-20 bg-zinc-850 rounded-lg" />
      <div className="h-7 w-14 bg-zinc-850 rounded-lg" />
      <div className="h-7 w-14 bg-zinc-850 rounded-lg" />
    </div>
  </div>
);

/* ── Skeleton grid — 6 cards (3 columns x 2 rows) ──────────────── */
export const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* ── Spinner — used inside buttons ────────────────────────────── */
export const ButtonSpinner = ({ size = 14 }) => (
  <svg
    style={{ width: size, height: size }}
    className="animate-spin shrink-0 text-red-500"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="3"
    />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ── Full-page loader ─────────────────────────────────────────── */
const Loader = ({ message = 'INITIALIZING_SYSTEM...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-10 h-10 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
    <p className="font-mono text-xs text-red-400/80 tracking-widest uppercase">{message}</p>
  </div>
);

export default Loader;
