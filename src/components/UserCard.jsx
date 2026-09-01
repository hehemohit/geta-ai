import React, { memo } from 'react';
import {
  Mail, Phone, Building2, Globe,
  Edit, Trash2, BookOpen, ExternalLink,
} from 'lucide-react';
import { getInitials, stringToHue, ensureProtocol } from '../utils/helpers';

/**
 * UserCard — Memoized card component with high contrast, clean typography, and responsive spacing.
 */
const UserCard = memo(({ user, onEdit, onDelete, onViewPosts }) => {
  const hue = stringToHue(user.name);
  const initials = getInitials(user.name);

  return (
    <article className="p-5 flex flex-col justify-between rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 group">
      <div>
        {/* Top Header: Avatar & Names */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md ring-2 ring-white/10"
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue + 40}, 70%, 35%))`,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-100 truncate group-hover:text-indigo-400 transition-colors">
              {user.name}
            </h3>
            <p className="text-xs text-gray-400 font-mono truncate">@{user.username}</p>
          </div>
        </div>

        {/* User Details with clean spacing */}
        <div className="space-y-2.5 text-xs text-gray-300 py-1 border-t border-gray-800/60 pt-3">
          <div className="flex items-center gap-2.5">
            <Mail size={15} className="text-indigo-400 shrink-0" />
            <a
              href={`mailto:${user.email}`}
              className="truncate text-gray-300 hover:text-indigo-300 transition-colors"
            >
              {user.email}
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone size={15} className="text-emerald-400 shrink-0" />
            <span className="truncate text-gray-300">{user.phone}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Building2 size={15} className="text-purple-400 shrink-0" />
            <span className="truncate text-gray-300">{user.company?.name || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Globe size={15} className="text-cyan-400 shrink-0" />
            <a
              href={ensureProtocol(user.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <span className="truncate">{user.website}</span>
              <ExternalLink size={11} className="shrink-0 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-gray-800/80">
        <button
          onClick={() => onViewPosts(user)}
          aria-label={`View posts by ${user.name}`}
          className="flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium rounded-lg text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen size={13} />
          <span>Posts</span>
        </button>

        <button
          onClick={() => onEdit(user)}
          aria-label={`Edit ${user.name}`}
          className="flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium rounded-lg text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
        >
          <Edit size={13} />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(user)}
          aria-label={`Delete ${user.name}`}
          className="flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95 cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
});

UserCard.displayName = 'UserCard';
export default UserCard;
