import React, { useState } from 'react';
import {
  ArrowLeftRight,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { BarangInventaris, FilterKondisi } from '../types/inventory';
import { MediaThumb } from './MediaThumb';

interface InventoryTableProps {
  items: BarangInventaris[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEdit: (item: BarangInventaris) => void;
  onQuickMutasi: (item: BarangInventaris) => void;
  onDeleteRequest: (item: BarangInventaris) => void;
  onAddBarang: () => void;
  onPreviewPhoto: (src: string, caption: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  searchQuery,
  onSearchChange,
  onEdit,
  onQuickMutasi,
  onDeleteRequest,
  onAddBarang,
  onPreviewPhoto,
}) => {
  const [kondisiFilter, setKondisiFilter] = useState<FilterKondisi>('SEMUA');

  const q = searchQuery.trim().toLowerCase();
  const filtered = items.filter((b) => {
    const matchQuery =
      !q ||
      b.nama.toLowerCase().includes(q) ||
      b.kode.toLowerCase().includes(q) ||
      b.merk.toLowerCase().includes(q) ||
      b.asnNama.toLowerCase().includes(q);
    if (!matchQuery) return false;
    if (kondisiFilter === 'B') return b.baik > 0;
    if (kondisiFilter === 'RR') return b.rusakRingan > 0;
    if (kondisiFilter === 'RB') return b.rusakBerat > 0;
    return true;
  });

  const filterButtons: { id: FilterKondisi; label: string }[] = [
    { id: 'SEMUA', label: 'Semua' },
    { id: 'B', label: 'Baik (B)' },
    { id: 'RR', label: 'Rusak Ringan (RR)' },
    { id: 'RB', label: 'Rusak Berat (RB)' },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Toolbar: Segmented condition filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 no-print">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {filterButtons.map((btn) => {
            const active = kondisiFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setKondisiFilter(btn.id)}
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
            placeholder="Cari nama, kode, merk, atau ASN..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Barang Inventaris</th>
                <th className="py-3 px-4">Kode Register</th>
                <th className="py-3 px-4 text-right">Tahun</th>
                <th className="py-3 px-4 text-right">Unit</th>
                <th className="py-3 px-4">Rincian Kondisi</th>
                <th className="py-3 px-4">ASN Pengguna</th>
                <th className="py-3 px-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((item) => {
                const totalUnit =
                  item.baik + item.rusakRingan + item.rusakBerat;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <MediaThumb
                          src={item.fotoBarang}
                          alt={item.nama}
                          variant="asset"
                          onClick={
                            item.fotoBarang
                              ? () =>
                                  onPreviewPhoto(
                                    item.fotoBarang,
                                    `${item.nama} (${item.kode})`
                                  )
                              : undefined
                          }
                          className="w-11 h-11 rounded-lg border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 leading-snug">
                            {item.nama}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {item.merk || 'Tanpa keterangan merk'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-slate-700">
                        {item.kode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-mono tabular-nums text-slate-700">
                        {item.tahun}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {totalUnit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums">
                        {item.baik > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                            Baik: {item.baik}
                          </span>
                        )}
                        {item.rusakRingan > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                            RR: {item.rusakRingan}
                          </span>
                        )}
                        {item.rusakBerat > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                            RB: {item.rusakBerat}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <MediaThumb
                          src={item.asnFoto}
                          alt={item.asnNama}
                          variant="avatar"
                          onClick={
                            item.asnFoto
                              ? () =>
                                  onPreviewPhoto(
                                    item.asnFoto,
                                    `Pengguna: ${item.asnNama} (NIP. ${item.asnNip})`
                                  )
                              : undefined
                          }
                          className="w-8 h-8 rounded-full border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
                            {item.asnNama}
                          </div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500 truncate">
                            NIP. {item.asnNip}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onQuickMutasi(item)}
                          title="Mutasikan barang ini"
                          aria-label={`Mutasikan ${item.nama}`}
                          className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Edit data dan kondisi"
                          aria-label={`Edit ${item.nama}`}
                          className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRequest(item)}
                          title="Hapus barang"
                          aria-label={`Hapus ${item.nama}`}
                          className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            {items.length === 0
              ? 'Belum ada barang di ruangan ini'
              : 'Tidak ada barang yang cocok dengan filter'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {items.length === 0
              ? 'Tambahkan barang inventaris baru atau catat mutasi masuk ke ruangan ini.'
              : 'Coba ubah kata kunci pencarian atau pilih filter kondisi lainnya.'}
          </p>
          {items.length === 0 ? (
            <button
              type="button"
              onClick={onAddBarang}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Barang Pertama</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setKondisiFilter('SEMUA');
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Reset Pencarian & Filter</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
