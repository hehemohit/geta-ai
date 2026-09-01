import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Mail, Phone, Globe, Building2, MapPin,
  ExternalLink, Quote, Terminal,
} from 'lucide-react';
import { fetchUserPosts } from '../services/userApi';
import { getInitials, ensureProtocol } from '../utils/helpers';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 26, stiffness: 360 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.15 },
  },
};

/* ── Post skeleton ─────────────────────────────────────────────── */
const PostSkeleton = () => (
  <div className="flex flex-col gap-2 p-3.5 bg-zinc-900/60 rounded-lg border border-zinc-850 animate-pulse">
    <div className="h-3.5 bg-zinc-800 rounded w-3/5" />
    <div className="h-3 bg-zinc-850 rounded w-full" />
    <div className="h-3 bg-zinc-850 rounded w-4/5" />
  </div>
);

/* ── Info cell ─────────────────────────────────────────────────── */
const InfoCell = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-1 p-3 bg-zinc-900/60 border border-zinc-850 rounded-lg">
    <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
      <Icon size={12} className="text-red-400" aria-hidden="true" />
      {label}
    </span>
    <div className="font-mono text-xs font-medium text-zinc-200 truncate">{children}</div>
  </div>
);

/**
 * UserDetailModal — Animated Cyberpunk User Profile and Posts Viewer.
 */
const UserDetailModal = ({ user, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setLoading] = useState(true);
  const [postsError, setError] = useState(null);

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
        if (isMounted) setError(err.message || 'Failed to load user posts.');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        className="relative z-10 bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/90 font-mono"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-zinc-850 rounded-t-2xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-600/40 bg-red-950/40 font-mono text-xs font-bold text-red-400 shadow-inner">
              {initials}
            </div>
            <div>
              <h2 id="detail-modal-title" className="font-sans text-sm sm:text-base font-bold uppercase tracking-wide text-zinc-100">
                {user.name}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-600/60 transition-colors cursor-pointer"
            aria-label="Close user details modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <InfoCell icon={Mail} label="EMAIL">
              <a href={`mailto:${user.email}`} className="text-zinc-300 hover:text-red-400 transition-colors">
                {user.email}
              </a>
            </InfoCell>
            <InfoCell icon={Phone} label="PHONE">
              {user.phone}
            </InfoCell>
            <InfoCell icon={Globe} label="NETWORK">
              <a
                href={ensureProtocol(user.website)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
              >
                {user.website} <ExternalLink size={10} className="shrink-0" />
              </a>
            </InfoCell>
            <InfoCell icon={Building2} label="AFFILIATION">
              {user.company?.name || 'N/A'}
            </InfoCell>
            <InfoCell icon={MapPin} label="REGION">
              {user.address?.city || 'N/A'}
            </InfoCell>
            <InfoCell icon={Quote} label="TAGLINE">
              <span className="italic text-zinc-400 text-[11px]">
                "{user.company?.catchPhrase || 'None'}"
              </span>
            </InfoCell>
          </div>

          {/* Posts Feed section */}
          <div className="flex flex-col gap-3 pt-3 border-t border-zinc-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-red-500" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                  // LOGGED_DISPATCHES
                </h3>
              </div>
              {!postsLoading && !postsError && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-red-950/60 text-red-400 border border-red-800/60">
                  COUNT: {posts.length}
                </span>
              )}
            </div>

            {/* Skeleton state */}
            {postsLoading && (
              <div className="flex flex-col gap-2.5">
                {[1, 2, 3].map((i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error state */}
            {postsError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-400 font-mono text-xs">
                [!] ERROR_FETCHING_POSTS: {postsError}
              </div>
            )}

            {/* Empty state */}
            {!postsLoading && !postsError && posts.length === 0 && (
              <p className="font-mono text-xs text-zinc-600 italic py-2">
                [SYSTEM: NO_TRANSMISSIONS_RECORDED]
              </p>
            )}

            {/* Posts list */}
            {!postsLoading && !postsError && posts.length > 0 && (
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="p-3.5 bg-zinc-900/60 border border-zinc-850 hover:border-red-900/60 rounded-lg transition-all"
                  >
                    <h4 className="font-sans text-xs font-bold text-zinc-200 capitalize mb-1 leading-snug">
                      {post.title}
                    </h4>
                    <p className="font-mono text-[11px] text-zinc-400 leading-relaxed">{post.body}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailModal;
