import React, { useEffect, useState } from 'react';
import {
  X, Mail, Phone, Globe, Building2, MapPin,
  BookOpen, ExternalLink, Quote,
} from 'lucide-react';
import { fetchUserPosts } from '../services/userApi';
import { getInitials, stringToHue, ensureProtocol } from '../utils/helpers';

/* ── Post skeleton ─────────────────────────────────────────────── */
const PostSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 bg-gray-950/60 rounded-xl border border-gray-800 animate-pulse">
    <div className="h-4 bg-gray-800 rounded w-3/5" />
    <div className="h-3 bg-gray-800/80 rounded w-full" />
    <div className="h-3 bg-gray-800/80 rounded w-4/5" />
  </div>
);

/* ── Info cell ─────────────────────────────────────────────────── */
const InfoCell = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-1 p-3 bg-gray-950/60 border border-gray-800 rounded-xl">
    <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
    <div className="text-xs font-medium text-gray-200 truncate">{children}</div>
  </div>
);

/**
 * UserDetailModal — Accessible user profile and posts viewer.
 */
const UserDetailModal = ({ user, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setLoading] = useState(true);
  const [postsError, setError] = useState(null);

  const hue = stringToHue(user.name);
  const initials = getInitials(user.name);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserPosts(user.id);
        if (isMounted) setPosts(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load posts.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div
        className="bg-gray-900 border border-gray-800 relative rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-gray-800 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-md ring-2 ring-white/10"
              style={{
                background: `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue + 40}, 70%, 35%))`,
              }}
            >
              {initials}
            </div>
            <div>
              <h2 id="detail-modal-title" className="text-base font-bold text-gray-100">{user.name}</h2>
              <p className="text-xs text-gray-400 font-mono">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            aria-label="Close user details modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoCell icon={Mail} label="Email">
              <a href={`mailto:${user.email}`} className="text-indigo-300 hover:text-indigo-200 transition-colors">
                {user.email}
              </a>
            </InfoCell>
            <InfoCell icon={Phone} label="Phone">
              {user.phone}
            </InfoCell>
            <InfoCell icon={Globe} label="Website">
              <a
                href={ensureProtocol(user.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                {user.website} <ExternalLink size={10} className="shrink-0" />
              </a>
            </InfoCell>
            <InfoCell icon={Building2} label="Company">
              {user.company?.name || 'N/A'}
            </InfoCell>
            <InfoCell icon={MapPin} label="City">
              {user.address?.city || 'N/A'}
            </InfoCell>
            <InfoCell icon={Quote} label="Catchphrase">
              <span className="italic text-gray-400 text-[11px]">
                "{user.company?.catchPhrase || 'No catchphrase'}"
              </span>
            </InfoCell>
          </div>

          {/* Posts section */}
          <div className="flex flex-col gap-4 pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-gray-200">Recent User Posts</h3>
              {!postsLoading && !postsError && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {posts.length}
                </span>
              )}
            </div>

            {/* Skeleton state */}
            {postsLoading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error state */}
            {postsError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
                ⚠️ {postsError}
              </div>
            )}

            {/* Empty state */}
            {!postsLoading && !postsError && posts.length === 0 && (
              <p className="text-xs text-gray-500 italic py-2">This user has no posts yet.</p>
            )}

            {/* Posts list */}
            {!postsLoading && !postsError && posts.length > 0 && (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="p-4 bg-gray-950/60 border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
                  >
                    <h4 className="text-xs font-semibold text-gray-200 capitalize mb-1.5 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{post.body}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
