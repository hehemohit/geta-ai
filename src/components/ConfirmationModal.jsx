import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { ButtonSpinner } from './Loader';

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
 * ConfirmationModal — Animated Cyberpunk High-Contrast Alert Dialog.
 */
const ConfirmationModal = ({
  title = 'TERMINATE RECORD',
  message,
  confirmLabel = '[CONFIRM_DELETE]',
  cancelLabel = '[ABORT]',
  onConfirm,
  onCancel,
  isLoading = false,
  danger = true,
}) => {
  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, isLoading]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-msg"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onCancel}
      />

      {/* Modal Dialog */}
      <motion.div
        className="relative z-10 bg-zinc-950 border border-red-900/60 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl shadow-red-950/50"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-600 transition-colors cursor-pointer"
          aria-label="Close confirmation dialog"
        >
          <X size={14} />
        </button>

        {/* Warning Icon */}
        <div className="w-13 h-13 rounded-xl mx-auto mb-4 flex items-center justify-center bg-red-950/50 text-red-500 border border-red-600/40 shadow-inner">
          {danger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </div>

        <h2 id="confirm-title" className="text-sm font-bold text-zinc-100 uppercase tracking-wide mb-2">
          {title}
        </h2>
        <p id="confirm-msg" className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
          {message}
        </p>

        <div className="flex gap-2.5 justify-center">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span>TERMINATING...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
