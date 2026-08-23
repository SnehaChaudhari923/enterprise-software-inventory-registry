import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner.js';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  message,
  confirmLabel = 'Delete System',
  cancelLabel = 'Cancel',
  isConfirming = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isConfirming) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirming, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isConfirming && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start gap-4">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1">
                <h3 className="text-lg font-semibold leading-6 text-slate-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isConfirming}
                className="text-slate-400 hover:text-slate-500 rounded-lg p-1.5 transition-colors absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isConfirming}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-2xs ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isConfirming}
              onClick={onConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-colors disabled:opacity-50"
            >
              {isConfirming && <LoadingSpinner size="sm" color="text-white" />}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
