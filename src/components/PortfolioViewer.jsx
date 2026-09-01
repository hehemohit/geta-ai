import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw, Globe, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * PortfolioViewer — Embedded Iframe Viewer for hehemohit.vercel.app with Cyberpunk HUD frame.
 */
const PortfolioViewer = ({ onBack }) => {
  const { activePreset } = useTheme();
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className="w-full max-w-[1240px] flex flex-col gap-4 font-mono"
    >
      {/* ── Top HUD Control Bar ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-850 backdrop-blur-md">
        
        {/* Left: Back & Live Node Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>[DASHBOARD]</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300">
            <Globe size={14} style={{ color: activePreset.hex }} />
            <span className="font-bold text-zinc-200 truncate">hehemohit.vercel.app</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleRefresh}
            title="Reload Portfolio Frame"
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">RELOAD</span>
          </button>

          <a
            href="https://hehemohit.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-lg cursor-pointer"
            style={{
              backgroundColor: activePreset.hex,
              boxShadow: `0 0 14px ${activePreset.glow}`,
            }}
          >
            <span>[OPEN_TAB]</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* ── Iframe Viewport Container ────────────────────────────── */}
      <div
        className="relative w-full h-[calc(100vh-210px)] min-h-[560px] rounded-2xl sm:rounded-3xl border bg-zinc-950 overflow-hidden shadow-2xl transition-colors"
        style={{
          borderColor: `${activePreset.hex}60`,
          boxShadow: `0 0 24px rgba(${activePreset.rgb}, 0.15)`,
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 animate-bounce"
              style={{
                borderColor: activePreset.hex,
                backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                color: activePreset.hex,
                boxShadow: `0 0 18px ${activePreset.glow}`,
              }}
            >
              <Globe size={22} />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300">
              ESTABLISHING_UPLINK...
            </p>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              https://hehemohit.vercel.app
            </p>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          src="https://hehemohit.vercel.app"
          title="Mohit Portfolio Uplink"
          className="w-full h-full border-0 rounded-2xl sm:rounded-3xl bg-black"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        />
      </div>
    </motion.div>
  );
};

export default PortfolioViewer;
