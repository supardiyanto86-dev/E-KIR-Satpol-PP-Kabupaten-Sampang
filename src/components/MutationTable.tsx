import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Plus,
  Search,
} from 'lucide-react';
import { FilterMutasi, RiwayatMutasi } from '../types/inventory';

interface MutationTableProps {
  mutasiList: RiwayatMutasi[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMutasi: () => void;
}

export const MutationTable: React.FC<MutationTableProps> = ({
  mutasiList,
  searchQuery,
  onSearchChange,
  onOpenMutasi,
}) => {
  const [filterTipe, setFilterTipe] = useState<FilterMutasi>('SEMUA');

  const q = searchQuery.trim().toLowerCase();
  const filtered = mutasiList.filter((m) => {
    const matchTipe = filterTipe === 'SEMUA' || m.jenis === filterTipe;
    const matchQuery =
      !q ||
      m.namaBarang.toLowerCase().includes(q) ||
      m.kodeBarang.toLowerCase().includes(q) ||
      m.asalTujuan.toLowerCase().includes(q) ||
      m.keterangan.toLowerCase().includes(q);
    return matchTipe && matchQuery;
  });

  const filterButtons: { id: FilterMutasi; label: string }[] = [
    { id: 'SEMUA', label: 'Semua Mutasi' },
    { id: 'MASUK', label: 'Mutasi Masuk' },
    { id: 'KELUAR', label: 'Mutasi Keluar' },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 no-print">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {filterButtons.map((btn) => {
            const active = filterTipe === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterTipe(btn.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari barang, ruangan, atau BAST..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Jenis & Waktu</th>
                <th className="py-3 px-4">Barang Inventaris</th>
                <th className="py-3 px-4 text-right">Unit</th>
                <th className="py-3 px-4">Asal / Tujuan</th>
                <th className="py-3 px-4">Keterangan & Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((m) => {
                const isMasuk = m.jenis === 'MASUK';
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                          isMasuk
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {isMasuk ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        <span>{isMasuk ? 'Mutasi Masuk' : 'Mutasi Keluar'}</span>
                      </div>
                      <div className="text-xs font-mono tabular-nums text-slate-500 mt-1">
                        {m.tanggal}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {m.namaBarang}
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">
                        {m.kodeBarang || '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div
                        className={`font-mono tabular-nums font-bold ${
                          isMasuk ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isMasuk ? '+' : '-'}
                        {m.jumlah} Unit
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Kondisi: {m.kondisi}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-500">
                        {isMasuk ? 'Dari' : 'Tujuan'}
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {m.asalTujuan}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-800">
                        {m.keterangan}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Petugas: {m.petugas}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            {mutasiList.length === 0
              ? 'Belum ada riwayat mutasi di ruangan ini'
              : 'Tidak ada catatan mutasi yang sesuai'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Catatan perpindahan barang masuk dan keluar ruangan beserta nomor BAST akan muncul di sini.
          </p>
          {mutasiList.length === 0 && (
            <button
              type="button"
              onClick={onOpenMutasi}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Mutasi Pertama</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
