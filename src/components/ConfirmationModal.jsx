import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { ButtonSpinner } from './Loader';

/**
 * ConfirmationModal — Accessible deletion/confirmation dialog.
 */
const ConfirmationModal = ({
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  danger = false,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-msg"
    >
      <div
        className="bg-gray-900 border border-gray-800 relative rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Close confirmation dialog"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            danger
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
          }`}
        >
          {danger ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
        </div>

        <h2 id="confirm-title" className="text-base font-bold text-gray-100 mb-2">
          {title}
        </h2>
        <p id="confirm-msg" className="text-sm text-gray-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              danger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span>Deleting...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
