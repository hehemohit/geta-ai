import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Building2, Globe, ExternalLink } from 'lucide-react';
import { getInitials, ensureProtocol } from '../utils/helpers';

/**
 * UserCard — Animated Cyberpunk Red Accent Card with clickable card surface.
 */
const UserCard = memo(({ user, onViewPosts, onEdit, onDelete }) => {
  const initials = getInitials(user.name);

  return (
    <motion.article
      layoutId={`user-card-${user.id}`}
      onClick={() => onViewPosts(user)}
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-850 bg-zinc-950/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-red-600/70 hover:shadow-xl hover:shadow-red-950/30 h-full cursor-pointer select-none"
    >
      {/* Top subtle corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-xl">
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-zinc-800 group-hover:bg-red-500/80 transition-colors" />
      </div>

      <div>
        {/* Header: Cyber Avatar, Name, Handle & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-600/40 bg-red-950/40 font-mono text-xs font-bold text-red-400 shadow-inner group-hover:border-red-500 group-hover:bg-red-900/40 transition-colors">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-sans text-sm font-bold uppercase tracking-wide text-zinc-100 group-hover:text-red-400 transition-colors">
                {user.name}
              </h3>
              <p className="truncate font-mono text-xs text-zinc-500">
                @{user.username || 'user'}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 font-mono text-[10px] text-zinc-400 group-hover:border-red-950 group-hover:text-red-400/80 transition-colors">
            ID: #{String(user.id).padStart(2, '0')}
          </span>
        </div>

        {/* User Details Grid / List */}
        <div className="mt-4 space-y-2 font-mono text-xs text-zinc-400 border-t border-zinc-900 pt-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Mail className="h-3.5 w-3.5 text-red-500/70 shrink-0" aria-hidden="true" />
            <a
              href={`mailto:${user.email}`}
              onClick={(e) => e.stopPropagation()}
              className="truncate text-zinc-300 hover:text-red-400 transition-colors"
            >
              {user.email}
            </a>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <Phone className="h-3.5 w-3.5 text-red-500/70 shrink-0" aria-hidden="true" />
            <span className="truncate text-zinc-300">{user.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="h-3.5 w-3.5 text-red-500/70 shrink-0" aria-hidden="true" />
            <span className="truncate text-zinc-300 font-medium">
              {user.company?.name || user.company || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <Globe className="h-3.5 w-3.5 text-red-500/70 shrink-0" aria-hidden="true" />
            <a
              href={ensureProtocol(user.website)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 truncate text-red-400/90 hover:text-red-300 hover:underline transition-colors"
            >
              <span className="truncate">{user.website}</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Cyberpunk Bracketed Action Buttons */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-900 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewPosts(user);
          }}
          aria-label={`View posts by ${user.name}`}
          className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 font-mono text-[11px] font-medium text-zinc-300 transition-all hover:border-red-500/60 hover:bg-red-950/30 hover:text-red-400 active:scale-95 cursor-pointer"
        >
          [VIEW_POSTS]
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(user);
          }}
          aria-label={`Edit ${user.name}`}
          className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 font-mono text-[11px] font-medium text-zinc-300 transition-all hover:border-red-500/60 hover:bg-red-950/30 hover:text-red-400 active:scale-95 cursor-pointer"
        >
          [EDIT]
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(user);
          }}
          aria-label={`Delete ${user.name}`}
          className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 font-mono text-[11px] font-medium text-rose-400/90 transition-all hover:border-red-600 hover:bg-red-900/50 hover:text-red-300 active:scale-95 cursor-pointer"
        >
          [DELETE]
        </button>
      </div>
    </motion.article>
  );
});

UserCard.displayName = 'UserCard';
export default UserCard;
