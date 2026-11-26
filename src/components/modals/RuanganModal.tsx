import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Ruangan } from '../../types/inventory';

interface RuanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Ruangan, 'id'>) => void;
}

export const RuanganModal: React.FC<RuanganModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [pjNama, setPjNama] = useState('');
  const [pjJabatan, setPjJabatan] = useState('');
  const [pjNip, setPjNip] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setKode('');
    setNama('');
    setLokasi('Gedung Kantor Utama');
    setPjNama('');
    setPjJabatan('Penanggung Jawab Ruangan');
    setPjNip('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      kode: kode.trim(),
      nama: nama.trim(),
      lokasi: lokasi.trim() || 'Gedung Kantor Instansi',
      pjNama: pjNama.trim(),
      pjJabatan: pjJabatan.trim() || 'Penanggung Jawab Ruangan',
      pjNip: pjNip.trim(),
      pjFoto: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-ruangan-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h2 id="modal-ruangan-title" className="text-base font-bold">
            Tambah Ruangan Kantor
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Ruang *
              </label>
              <input
                type="text"
                required
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="R.204"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lokasi / Lantai
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Lantai 2 - Gedung Utama"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Ruangan *
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ruang Bidang Anggaran"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Penanggung Jawab Ruangan *
            </label>
            <input
              type="text"
              required
              value={pjNama}
              onChange={(e) => setPjNama(e.target.value)}
              placeholder="Contoh: Dra. Siti Aminah, M.Si"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jabatan
              </label>
              <input
                type="text"
                value={pjJabatan}
                onChange={(e) => setPjJabatan(e.target.value)}
                placeholder="Kepala Bidang"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIP Penanggung Jawab *
              </label>
              <input
                type="text"
                required
                value={pjNip}
                onChange={(e) => setPjNip(e.target.value)}
                placeholder="19790814 200501 2 009"
                className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Simpan Ruangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
