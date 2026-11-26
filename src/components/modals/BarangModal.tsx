import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BarangInventaris } from '../../types/inventory';
import { MediaThumb } from '../MediaThumb';

interface BarangModalProps {
  isOpen: boolean;
  editingItem: BarangInventaris | null;
  onClose: () => void;
  onSave: (
    payload: Omit<BarangInventaris, 'id' | 'ruanganId'>,
    editId?: string
  ) => boolean;
}

export const BarangModal: React.FC<BarangModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSave,
}) => {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [merk, setMerk] = useState('');
  const [tahun, setTahun] = useState(2025);
  const [baik, setBaik] = useState(1);
  const [rusakRingan, setRusakRingan] = useState(0);
  const [rusakBerat, setRusakBerat] = useState(0);
  const [fotoBarang, setFotoBarang] = useState('');
  const [asnNama, setAsnNama] = useState('');
  const [asnNip, setAsnNip] = useState('');
  const [asnFoto, setAsnFoto] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setKode(editingItem.kode);
      setNama(editingItem.nama);
      setMerk(editingItem.merk);
      setTahun(editingItem.tahun);
      setBaik(editingItem.baik);
      setRusakRingan(editingItem.rusakRingan);
      setRusakBerat(editingItem.rusakBerat);
      setFotoBarang(editingItem.fotoBarang);
      setAsnNama(editingItem.asnNama);
      setAsnNip(editingItem.asnNip);
      setAsnFoto(editingItem.asnFoto);
    } else {
      setKode('');
      setNama('');
      setMerk('');
      setTahun(new Date().getFullYear());
      setBaik(1);
      setRusakRingan(0);
      setRusakBerat(0);
      setFotoBarang('');
      setAsnNama('');
      setAsnNip('');
      setAsnFoto('');
    }
  }, [isOpen, editingItem]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileRead = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setter(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onSave(
      {
        kode: kode.trim(),
        nama: nama.trim(),
        merk: merk.trim(),
        tahun: Number(tahun) || new Date().getFullYear(),
        baik: Math.max(0, Number(baik) || 0),
        rusakRingan: Math.max(0, Number(rusakRingan) || 0),
        rusakBerat: Math.max(0, Number(rusakBerat) || 0),
        fotoBarang: fotoBarang.trim(),
        asnNama: asnNama.trim(),
        asnNip: asnNip.trim(),
        asnFoto: asnFoto.trim(),
      },
      editingItem?.id
    );
    if (ok) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-barang-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h2 id="modal-barang-title" className="text-base font-bold">
            {editingItem
              ? 'Edit Barang & Kondisi Realtime'
              : 'Tambah Barang Inventaris'}
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

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Barang / Register *
              </label>
              <input
                type="text"
                required
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Contoh: 3.10.01.02.001"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Barang *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Laptop Kerja Core i7"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Merk / Tipe / Spesifikasi
              </label>
              <input
                type="text"
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                placeholder="Contoh: Lenovo ThinkPad T14"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tahun Perolehan *
              </label>
              <input
                type="number"
                required
                min={1990}
                max={2035}
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Condition Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-700 mb-3">
              Rincian Jumlah Unit Berdasarkan Kondisi
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-emerald-800 mb-1">
                  Baik (B)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={baik}
                  onChange={(e) => setBaik(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-emerald-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-800 mb-1">
                  Rusak Ringan (RR)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={rusakRingan}
                  onChange={(e) => setRusakRingan(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-amber-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-rose-800 mb-1">
                  Rusak Berat (RB)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={rusakBerat}
                  onChange={(e) => setRusakBerat(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-rose-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Asset Photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Foto Barang (Unggah File atau URL Gambar)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <MediaThumb
                src={fotoBarang}
                alt={nama || 'Preview Barang'}
                variant="asset"
                className="w-16 h-16 rounded-lg border border-slate-200"
              />
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileRead(e, setFotoBarang)}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-50 cursor-pointer"
                />
                <input
                  type="url"
                  value={fotoBarang.startsWith('data:') ? '' : fotoBarang}
                  onChange={(e) => setFotoBarang(e.target.value)}
                  placeholder="Atau tempel tautan gambar (https://...)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ASN User */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <p className="text-xs font-semibold text-slate-700">
              ASN Pengguna / Pemegang Barang
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nama ASN & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={asnNama}
                  onChange={(e) => setAsnNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Kom"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  NIP ASN *
                </label>
                <input
                  type="text"
                  required
                  value={asnNip}
                  onChange={(e) => setAsnNip(e.target.value)}
                  placeholder="Contoh: 19880512 201503 1 002"
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MediaThumb
                src={asnFoto}
                alt={asnNama || 'ASN'}
                variant="avatar"
                className="w-11 h-11 rounded-full border border-slate-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileRead(e, setAsnFoto)}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-50 cursor-pointer"
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
              Simpan Data Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
