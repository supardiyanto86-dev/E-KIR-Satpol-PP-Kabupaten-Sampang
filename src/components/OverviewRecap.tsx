import React from 'react';
import { ArrowRight, Building2, Plus } from 'lucide-react';
import {
  BarangInventaris,
  RiwayatMutasi,
  Ruangan,
} from '../types/inventory';

interface OverviewRecapProps {
  ruangan: Ruangan[];
  barang: BarangInventaris[];
  mutasi: RiwayatMutasi[];
  activeRuanganId: string;
  onSelectRoomAndOpen: (roomId: string) => void;
  onOpenAddRoom: () => void;
}

export const OverviewRecap: React.FC<OverviewRecapProps> = ({
  ruangan,
  barang,
  mutasi,
  activeRuanganId,
  onSelectRoomAndOpen,
  onOpenAddRoom,
}) => {
  const rows = ruangan.map((r) => {
    const items = barang.filter((b) => b.ruanganId === r.id);
    const baik = items.reduce((s, b) => s + b.baik, 0);
    const rr = items.reduce((s, b) => s + b.rusakRingan, 0);
    const rb = items.reduce((s, b) => s + b.rusakBerat, 0);
    const total = baik + rr + rb;
    const mutasiCount = mutasi.filter((m) => m.ruanganId === r.id).length;
    return {
      ruang: r,
      jenisCount: items.length,
      baik,
      rr,
      rb,
      total,
      mutasiCount,
    };
  });

  const grandTotals = rows.reduce(
    (acc, r) => ({
      jenisCount: acc.jenisCount + r.jenisCount,
      baik: acc.baik + r.baik,
      rr: acc.rr + r.rr,
      rb: acc.rb + r.rb,
      total: acc.total + r.total,
      mutasiCount: acc.mutasiCount + r.mutasiCount,
    }),
    { jenisCount: 0, baik: 0, rr: 0, rb: 0, total: 0, mutasiCount: 0 }
  );

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Rekapitulasi Aset Seluruh Ruangan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan kondisi barang inventaris dan riwayat mutasi pada{' '}
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {ruangan.length}
            </span>{' '}
            ruangan terdaftar
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddRoom}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ruangan</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Kode & Nama Ruangan</th>
              <th className="py-3 px-4">Penanggung Jawab</th>
              <th className="py-3 px-4 text-right">Jenis</th>
              <th className="py-3 px-4 text-right">Baik (B)</th>
              <th className="py-3 px-4 text-right">Rusak Ringan</th>
              <th className="py-3 px-4 text-right">Rusak Berat</th>
              <th className="py-3 px-4 text-right">Total Unit</th>
              <th className="py-3 px-4 text-right">Mutasi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rows.map(({ ruang, jenisCount, baik, rr, rb, total, mutasiCount }) => {
              const isCurrent = ruang.id === activeRuanganId;
              return (
                <tr
                  key={ruang.id}
                  className={`transition-colors ${
                    isCurrent ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {ruang.nama}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="font-mono">{ruang.kode}</span>
                          <span className="mx-1.5" aria-hidden="true">
                            ·
                          </span>
                          <span>{ruang.lokasi}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 text-xs">
                      {ruang.pjNama}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500">
                      NIP. {ruang.pjNip}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {jenisCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                    {baik}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-amber-700">
                    {rr}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-rose-700">
                    {rb}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {total}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                    {mutasiCount}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectRoomAndOpen(ruang.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Buka KIR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-sm text-slate-900">
              <td colSpan={2} className="py-3.5 px-4">
                Total Keseluruhan Instansi
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                {grandTotals.jenisCount}
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700">
                {grandTotals.baik}
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-amber-700">
                {grandTotals.rr}
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-rose-700">
                {grandTotals.rb}
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                {grandTotals.total}
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                {grandTotals.mutasiCount}
              </td>
              <td className="py-3.5 px-4" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
