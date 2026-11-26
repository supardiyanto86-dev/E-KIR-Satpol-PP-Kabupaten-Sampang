import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface PhotoPreviewModalProps {
  src: string | null;
  caption: string;
  onClose: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  src,
  caption,
  onClose,
}) => {
  useEffect(() => {
    if (!src) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out no-print"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full bg-white rounded-xl border border-slate-200 p-3 shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={src}
            alt={caption}
            referrerPolicy="no-referrer"
            className="w-full max-h-[72vh] object-contain"
          />
        </div>
        <div className="pt-3 px-1 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {caption}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
