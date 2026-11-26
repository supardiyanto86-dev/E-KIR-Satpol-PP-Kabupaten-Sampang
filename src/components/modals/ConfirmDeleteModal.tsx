import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BarangInventaris } from '../../types/inventory';

interface ConfirmDeleteModalProps {
  item: BarangInventaris | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  item,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onCancel]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Barang Inventaris?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Barang <span className="font-semibold text-slate-900">{item.nama}</span>{' '}
              (<span className="font-mono">{item.kode}</span>) akan dihapus dari daftar
              inventaris ruangan ini.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(item.id);
              onCancel();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
          >
            Hapus Barang
          </button>
        </div>
      </div>
    </div>
  );
};
