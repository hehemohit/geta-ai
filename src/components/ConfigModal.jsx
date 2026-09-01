import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Palette, Check, Sparkles, Sliders,
  RotateCcw, Eye, ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

/**
 * ConfigModal — Interactive Theme Configuration & Custom Color Picker Dialog.
 */
const ConfigModal = ({ onClose }) => {
  const { currentTheme, activePreset, customHex, selectTheme, applyCustomHex, presets } = useTheme();
  const [hexInput, setHexInput] = useState(activePreset.hex);

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

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      applyCustomHex(val);
    }
  };

  const handleColorPickerChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    applyCustomHex(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-sans overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="config-modal-title"
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

      {/* Main Dialog */}
      <motion.div
        className="relative z-10 bg-[#09090b] border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black overflow-hidden font-mono"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-zinc-950/95 border-b border-zinc-850 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors"
              style={{
                backgroundColor: activePreset.hex,
                boxShadow: `0 0 16px ${activePreset.glow}`,
              }}
            >
              <Palette size={18} />
            </div>
            <div>
              <h2 id="config-modal-title" className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-tight">
                [SYSTEM_CONFIG] THEME_CALIBRATION
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Customize dynamic neon accent frequencies & viewport styles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Close configuration modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Preset Palettes Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={13} style={{ color: activePreset.hex }} />
                // PRESET NEON CALIBRATIONS
              </span>
              <span className="text-[10px] text-zinc-500">
                ACTIVE: <strong style={{ color: activePreset.hex }}>{activePreset.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => {
                const isSelected = currentTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      selectTheme(preset.id);
                      setHexInput(preset.hex);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900/90 shadow-lg'
                        : 'bg-zinc-950/70 hover:bg-zinc-900/50 border-zinc-850 hover:border-zinc-750'
                    }`}
                    style={{
                      borderColor: isSelected ? preset.hex : undefined,
                      boxShadow: isSelected ? `0 0 14px ${preset.glow}` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && <Check size={14} className="text-black font-bold" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-100 truncate">
                          {preset.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate font-sans">
                          {preset.description}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400 shrink-0 font-semibold">
                      {preset.hex}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Frequency Input */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sliders size={13} style={{ color: activePreset.hex }} />
              // CUSTOM FREQUENCY CALIBRATION (ANY COLOR)
            </span>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-850 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Native Color Picker Swatch */}
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 shrink-0 cursor-pointer shadow-md">
                  <input
                    type="color"
                    value={activePreset.hex}
                    onChange={handleColorPickerChange}
                    className="absolute -inset-2 w-14 h-14 cursor-pointer opacity-100"
                    title="Click to open color spectrum"
                  />
                </div>
                <div>
                  <label htmlFor="hex-code-input" className="text-xs font-bold text-zinc-200 block">
                    Custom Hex Spectrum
                  </label>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    Pick from the color box or type an exact hex code
                  </p>
                </div>
              </div>

              {/* Hex Text Input */}
              <div className="flex items-center gap-2">
                <input
                  id="hex-code-input"
                  type="text"
                  value={hexInput}
                  onChange={handleHexChange}
                  placeholder="#10b981"
                  className="w-28 px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
                <button
                  onClick={() => applyCustomHex(hexInput)}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg text-white transition-all cursor-pointer shadow-md"
                  style={{
                    backgroundColor: activePreset.hex,
                    boxShadow: `0 0 10px ${activePreset.glow}`,
                  }}
                >
                  [APPLY]
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Component Preview HUD */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Eye size={13} style={{ color: activePreset.hex }} />
              // REAL-TIME COMPONENT PREVIEW
            </span>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: `rgba(${activePreset.rgb}, 0.2)`,
                    border: `1px solid ${activePreset.hex}`,
                    color: activePreset.hex,
                  }}
                >
                  HUD
                </div>
                <div className="text-xs">
                  <span className="text-zinc-200 font-bold block">Live Accent Calibration</span>
                  <span className="text-[10px] text-zinc-500 font-mono">RGB: {activePreset.rgb}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded font-mono text-[10px] font-bold"
                  style={{
                    backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                    color: activePreset.hex,
                    border: `1px solid ${activePreset.hex}40`,
                  }}
                >
                  [ACTIVE_BADGE]
                </span>

                <button
                  className="px-3 py-1 text-xs font-bold rounded text-white shadow-md"
                  style={{
                    backgroundColor: activePreset.hex,
                    boxShadow: `0 0 8px ${activePreset.glow}`,
                  }}
                >
                  [BUTTON]
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-zinc-950/95 border-t border-zinc-900 px-6 py-4 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={() => {
              selectTheme('cyan');
              setHexInput('#06b6d4');
            }}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>[RESET_DEFAULT]</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-bold text-white transition-all cursor-pointer shadow-lg"
            style={{
              backgroundColor: activePreset.hex,
              boxShadow: `0 0 14px ${activePreset.glow}`,
            }}
          >
            [SAVE_CALIBRATION]
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfigModal;
