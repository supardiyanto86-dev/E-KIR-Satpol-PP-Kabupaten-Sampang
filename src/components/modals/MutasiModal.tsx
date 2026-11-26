import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
import {
  BarangInventaris,
  JenisMutasi,
  KondisiCode,
  Ruangan,
} from '../../types/inventory';
import { MutasiPayload } from '../../hooks/useInventoryStore';

interface MutasiModalProps {
  isOpen: boolean;
  preselectedBarang: BarangInventaris | null;
  barangRuangan: BarangInventaris[];
  ruanganLain: Ruangan[];
  onClose: () => void;
  onSubmit: (payload: MutasiPayload) => boolean;
}

export const MutasiModal: React.FC<MutasiModalProps> = ({
  isOpen,
  preselectedBarang,
  barangRuangan,
  ruanganLain,
  onClose,
  onSubmit,
}) => {
  const [jenis, setJenis] = useState<JenisMutasi>('KELUAR');
  const [barangId, setBarangId] = useState('');
  const [tujuanId, setTujuanId] = useState('GUDANG_PENGHAPUSAN');
  const [namaBarang, setNamaBarang] = useState('');
  const [kodeBarang, setKodeBarang] = useState('');
  const [tahun, setTahun] = useState(2025);
  const [asal, setAsal] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [kondisi, setKondisi] = useState<KondisiCode>('B');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (preselectedBarang) {
      setJenis('KELUAR');
      setBarangId(preselectedBarang.id);
    } else {
      setJenis(barangRuangan.length > 0 ? 'KELUAR' : 'MASUK');
      setBarangId(barangRuangan[0]?.id || '');
    }
    setTujuanId(ruanganLain[0]?.id || 'GUDANG_PENGHAPUSAN');
    setNamaBarang('');
    setKodeBarang('');
    setTahun(new Date().getFullYear());
    setAsal('');
    setJumlah(1);
    setKondisi('B');
    setKeterangan('');
  }, [isOpen, preselectedBarang, barangRuangan, ruanganLain]);

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
    const ok =
      jenis === 'KELUAR'
        ? onSubmit({
            jenis: 'KELUAR',
            barangId,
            tujuanId,
            jumlah: Number(jumlah) || 1,
            kondisi,
            keterangan: keterangan.trim(),
          })
        : onSubmit({
            jenis: 'MASUK',
            namaBarang: namaBarang.trim(),
            kodeBarang: kodeBarang.trim(),
            tahun: Number(tahun) || new Date().getFullYear(),
            asal: asal.trim(),
            jumlah: Number(jumlah) || 1,
            kondisi,
            keterangan: keterangan.trim(),
          });
    if (ok) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-mutasi-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h2 id="modal-mutasi-title" className="text-base font-bold">
            Catat Mutasi Barang
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
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Mutasi *
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setJenis('KELUAR')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                  jenis === 'KELUAR'
                    ? 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Mutasi Keluar</span>
              </button>
              <button
                type="button"
                onClick={() => setJenis('MASUK')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                  jenis === 'MASUK'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Mutasi Masuk</span>
              </button>
            </div>
          </div>

          {jenis === 'KELUAR' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Barang dari Ruangan Ini *
                </label>
                <select
                  value={barangId}
                  onChange={(e) => setBarangId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {barangRuangan.length === 0 ? (
                    <option value="">Tidak ada barang di ruangan ini</option>
                  ) : (
                    barangRuangan.map((b) => {
                      const total = b.baik + b.rusakRingan + b.rusakBerat;
                      return (
                        <option key={b.id} value={b.id}>
                          {b.nama} (Tersedia: {total} unit)
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ruangan Tujuan / Penerima *
                </label>
                <select
                  value={tujuanId}
                  onChange={(e) => setTujuanId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {ruanganLain.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.kode}] {r.nama}
                    </option>
                  ))}
                  <option value="GUDANG_PENGHAPUSAN">
                    Gudang Aset / Usulan Penghapusan
                  </option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Barang Masuk *
                </label>
                <input
                  type="text"
                  required
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  placeholder="Contoh: Printer LaserJet Pro"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    value={kodeBarang}
                    onChange={(e) => setKodeBarang(e.target.value)}
                    placeholder="3.10.02.004"
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tahun Perolehan
                  </label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Asal Ruangan / Pengadaan *
                </label>
                <input
                  type="text"
                  required
                  value={asal}
                  onChange={(e) => setAsal(e.target.value)}
                  placeholder="Contoh: Gudang Aset Utama / Pengadaan APBD"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Unit Dimutasi *
              </label>
              <input
                type="number"
                min={1}
                required
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kondisi Barang
              </label>
              <select
                value={kondisi}
                onChange={(e) => setKondisi(e.target.value as KondisiCode)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="B">Baik (B)</option>
                <option value="RR">Rusak Ringan (RR)</option>
                <option value="RB">Rusak Berat (RB)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keterangan / Nomor Berita Acara (BAST) *
            </label>
            <input
              type="text"
              required
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: BAST No. 024/KIR/2026 - Pemindahan Staf"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
              Proses Mutasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
