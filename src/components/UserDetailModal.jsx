import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Phone, Globe, Building2, MapPin,
  ExternalLink, Quote, Terminal, FileText,
  Compass, Radio, Layers, Search,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchUserPosts } from '../services/userApi';
import { getInitials, ensureProtocol } from '../utils/helpers';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
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

const tabContentVariants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(2px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

/* ── Post Skeleton Loader ────────────────────────────────────────── */
const PostSkeleton = () => (
  <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-850 animate-pulse space-y-2.5">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-zinc-800 rounded w-1/3" />
      <div className="h-3 bg-zinc-850 rounded w-16" />
    </div>
    <div className="h-3 bg-zinc-850 rounded w-full" />
    <div className="h-3 bg-zinc-850 rounded w-5/6" />
  </div>
);

/**
 * UserDetailModal — Cyberpunk Dossier & Posts Viewer with dynamic theme synchronization.
 */
const UserDetailModal = ({ user, onClose }) => {
  const { activePreset } = useTheme();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setLoading] = useState(true);
  const [postsError, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'posts'
  const [postSearch, setPostSearch] = useState('');

  const initials = getInitials(user.name);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch posts on mount
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserPosts(user.id);
        if (isMounted) setPosts(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to retrieve logged posts.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  // Filtered posts based on local search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.body.toLowerCase().includes(postSearch.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-sans overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Main Modal Dialog with Layout Animation */}
      <motion.div
        layout
        transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 bg-[#09090b] border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header Bar ────────────────────────────────────────── */}
        <div className="bg-zinc-950/95 border-b border-zinc-850 px-5 sm:px-8 py-5 flex items-center justify-between shrink-0">
          {/* Avatar & Main Identity */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center font-mono text-base sm:text-lg font-bold shadow-lg transition-colors"
                style={{
                  backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                  borderColor: `${activePreset.hex}60`,
                  color: activePreset.hex,
                  boxShadow: `0 0 16px ${activePreset.glow}`,
                }}
              >
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-sm" title="Status: Online" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="detail-modal-title"
                  className="font-extrabold text-base sm:text-xl text-zinc-100 uppercase tracking-tight truncate"
                >
                  {user.name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold transition-colors"
                  style={{
                    backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                    border: `1px solid ${activePreset.hex}40`,
                    color: activePreset.hex,
                  }}
                >
                  ID: #{String(user.id).padStart(2, '0')}
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-400 truncate mt-0.5">
                @{user.username} <span className="text-zinc-600">•</span>{' '}
                <span className="text-zinc-300">{user.company?.name || 'Independent'}</span>
              </p>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer shrink-0 ml-2"
            aria-label="Close details modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Segmented Navigation Tabs with Sliding Pill ───────────── */}
        <div className="flex items-center gap-2 px-5 sm:px-8 pt-4 pb-2 border-b border-zinc-900 bg-zinc-950/50 shrink-0 font-mono text-xs">
          {/* Tab 1: Profile Dossier */}
          <button
            onClick={() => setActiveTab('dossier')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'dossier' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeTab === 'dossier' && (
              <motion.div
                layoutId="active-modal-tab-pill"
                className="absolute inset-0 rounded-lg shadow-sm border"
                style={{
                  backgroundColor: `rgba(${activePreset.rgb}, 0.18)`,
                  borderColor: `${activePreset.hex}80`,
                  boxShadow: `0 0 12px ${activePreset.glow}`,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
            <span
              className="relative z-10 flex items-center gap-2 transition-colors"
              style={{ color: activeTab === 'dossier' ? activePreset.hex : undefined }}
            >
              <FileText size={14} />
              <span>[PROFILE_DOSSIER]</span>
            </span>
          </button>

          {/* Tab 2: Logged Posts */}
          <button
            onClick={() => setActiveTab('posts')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'posts' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeTab === 'posts' && (
              <motion.div
                layoutId="active-modal-tab-pill"
                className="absolute inset-0 rounded-lg shadow-sm border"
                style={{
                  backgroundColor: `rgba(${activePreset.rgb}, 0.18)`,
                  borderColor: `${activePreset.hex}80`,
                  boxShadow: `0 0 12px ${activePreset.glow}`,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
            <span
              className="relative z-10 flex items-center gap-2 transition-colors"
              style={{ color: activeTab === 'posts' ? activePreset.hex : undefined }}
            >
              <Terminal size={14} />
              <span>[LOGGED_POSTS]</span>
              {!postsLoading && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300">
                  {posts.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* ── Stable Animated Content Viewport ─────────────────────── */}
        <div className="flex-1 min-h-[440px] max-h-[58vh] overflow-y-auto p-5 sm:p-8">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Profile Dossier */}
            {activeTab === 'dossier' && (
              <motion.div
                key="dossier-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Section 1: Communications & Web */}
                <div className="space-y-3">
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    <Radio size={13} />
                    <span>// COMMUNICATIONS & NETWORK</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    {/* Email */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex flex-col justify-between gap-1">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={12} style={{ color: activePreset.hex }} />
                        Email Address
                      </span>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-zinc-200 hover:text-white transition-colors font-medium truncate mt-0.5"
                      >
                        {user.email}
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex flex-col justify-between gap-1">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={12} style={{ color: activePreset.hex }} />
                        Phone Channel
                      </span>
                      <span className="text-zinc-200 font-medium truncate mt-0.5">
                        {user.phone}
                      </span>
                    </div>

                    {/* Website */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex flex-col justify-between gap-1">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Globe size={12} style={{ color: activePreset.hex }} />
                        Web Portal
                      </span>
                      <a
                        href={ensureProtocol(user.website)}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors font-medium truncate flex items-center gap-1 mt-0.5 hover:underline"
                        style={{ color: activePreset.hex }}
                      >
                        <span className="truncate">{user.website}</span>
                        <ExternalLink size={11} className="shrink-0 opacity-80" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Section 2: Corporate & Business Operations */}
                <div className="space-y-3">
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    <Building2 size={13} />
                    <span>// CORPORATE AFFILIATION</span>
                  </h3>

                  <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                          ENTERPRISE NAME
                        </span>
                        <p className="text-base font-bold text-zinc-100">
                          {user.company?.name || 'Independent Consultant'}
                        </p>
                      </div>
                      {user.company?.bs && (
                        <span className="self-start sm:self-center px-2.5 py-1 rounded font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800">
                          TAG: {user.company.bs}
                        </span>
                      )}
                    </div>

                    {user.company?.catchPhrase && (
                      <div className="flex items-start gap-2.5 pt-1">
                        <Quote size={16} className="shrink-0 mt-0.5" style={{ color: activePreset.hex }} />
                        <p className="italic text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                          "{user.company.catchPhrase}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Physical Address & Geolocation Coordinates */}
                <div className="space-y-3">
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    <Compass size={13} />
                    <span>// GEOGRAPHIC COORDINATES & ADDRESS</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    {/* Street & Suite */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-start gap-3">
                      <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: activePreset.hex }} />
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                          STREET ADDRESS
                        </span>
                        <p className="text-zinc-200 font-medium mt-0.5">
                          {user.address?.street || 'N/A'}{user.address?.suite ? `, ${user.address.suite}` : ''}
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          {user.address?.city || 'Unknown City'}, {user.address?.zipcode || ''}
                        </p>
                      </div>
                    </div>

                    {/* Lat / Lng Coordinates */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-start gap-3">
                      <Compass size={16} className="shrink-0 mt-0.5" style={{ color: activePreset.hex }} />
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                          SATELLITE POSITION (LAT / LNG)
                        </span>
                        <p className="text-zinc-200 font-bold mt-0.5">
                          {user.address?.geo?.lat ? `${user.address.geo.lat}°, ${user.address.geo.lng}°` : 'COORDS_UNAVAILABLE'}
                        </p>
                        <p className="text-[10px] text-emerald-400/80 mt-0.5">
                          [GPS_STATUS: LOCKED]
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: Logged Posts Feed */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* Search Within Posts Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
                  <div className="flex items-center gap-2">
                    <Layers size={14} style={{ color: activePreset.hex }} />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      TRANSMITTED DISPATCHES ({posts.length})
                    </span>
                  </div>

                  {posts.length > 0 && (
                    <div className="relative sm:w-64">
                      <Search
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={postSearch}
                        onChange={(e) => setPostSearch(e.target.value)}
                        placeholder="Filter user posts..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all font-mono"
                        style={{
                          borderColor: postSearch ? activePreset.hex : undefined,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Loading State */}
                {postsLoading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                )}

                {/* Error State */}
                {postsError && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 font-mono text-xs">
                    [!] ERROR_RETRIEVING_DATA: {postsError}
                  </div>
                )}

                {/* Empty Posts State */}
                {!postsLoading && !postsError && filteredPosts.length === 0 && (
                  <div className="p-8 text-center rounded-xl bg-zinc-950/60 border border-zinc-850 font-mono text-xs text-zinc-500">
                    {postSearch ? 'No posts matching query filter.' : '[NO_TRANSMISSIONS_RECORDED]'}
                  </div>
                )}

                {/* Posts Feed */}
                {!postsLoading && !postsError && filteredPosts.length > 0 && (
                  <div className="space-y-3 pr-1">
                    {filteredPosts.map((post, idx) => (
                      <article
                        key={post.id}
                        className="p-4 sm:p-5 rounded-xl bg-zinc-950/80 border border-zinc-850 transition-all duration-150 space-y-2 group hover:border-zinc-700"
                        style={{
                          '--post-accent': activePreset.hex,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                          <span
                            className="px-2 py-0.5 rounded font-bold transition-colors"
                            style={{
                              backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                              border: `1px solid ${activePreset.hex}50`,
                              color: activePreset.hex,
                            }}
                          >
                            DISPATCH #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-zinc-500 font-mono">
                            POST_ID: {post.id}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-zinc-100 transition-colors capitalize font-sans leading-snug">
                          {post.title}
                        </h4>

                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {post.body}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Bottom Modal Footer with Layout Smoothing ────────────── */}
        <div className="bg-zinc-950/95 border-t border-zinc-900 px-5 sm:px-8 py-3.5 flex items-center justify-between font-mono text-xs shrink-0">
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            // NODE_RECORD_SYNCED • JSONPLACEHOLDER_API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors ml-auto cursor-pointer"
          >
            [DISMISS]
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailModal;
