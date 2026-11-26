import React from 'react';
import {
  ArrowLeftRight,
  ChevronDown,
  Plus,
  Printer,
} from 'lucide-react';
import { Ruangan } from '../types/inventory';
import { MediaThumb } from './MediaThumb';

interface RoomHeaderProfileProps {
  ruangan: Ruangan[];
  activeRuangan: Ruangan;
  onSelectRoom: (id: string) => void;
  onOpenAddBarang: () => void;
  onOpenMutasi: () => void;
  onPrintKir: () => void;
  onPreviewPhoto: (src: string, caption: string) => void;
}

export const RoomHeaderProfile: React.FC<RoomHeaderProfileProps> = ({
  ruangan,
  activeRuangan,
  onSelectRoom,
  onOpenAddBarang,
  onOpenMutasi,
  onPrintKir,
  onPreviewPhoto,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
      {/* Top Row: Room Selector + Primary Workspace Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex-1 min-w-0">
          <label
            htmlFor="selectRuangan"
            className="block text-xs font-medium text-slate-500 mb-1.5"
          >
            Ruangan Kantor Aktif
          </label>
          <div className="relative max-w-md">
            <select
              id="selectRuangan"
              value={activeRuangan.id}
              onChange={(e) => onSelectRoom(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-lg pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors cursor-pointer"
            >
              {ruangan.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.kode}] {r.nama}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            type="button"
            onClick={onOpenAddBarang}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Barang</span>
          </button>
          <button
            type="button"
            onClick={onOpenMutasi}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-800" />
            <span>Catat Mutasi</span>
          </button>
          <button
            type="button"
            onClick={onPrintKir}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak KIR</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Room Identity & Penanggung Jawab (Clean whitespace & hairline separation) */}
      <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-blue-700">
              Kode Ruang {activeRuangan.kode}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeRuangan.lokasi || 'Gedung Kantor Utama'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            {activeRuangan.nama}
          </h1>
        </div>

        <div className="lg:col-span-5 flex items-center gap-4 lg:pl-6 lg:border-l lg:border-slate-200">
          <MediaThumb
            src={activeRuangan.pjFoto}
            alt={activeRuangan.pjNama}
            variant="avatar"
            onClick={
              activeRuangan.pjFoto
                ? () =>
                    onPreviewPhoto(
                      activeRuangan.pjFoto,
                      `Penanggung Jawab: ${activeRuangan.pjNama} (NIP. ${activeRuangan.pjNip})`
                    )
                : undefined
            }
            className="w-12 h-12 rounded-full border border-slate-200"
          />
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500">
              Penanggung Jawab Ruangan
            </div>
            <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {activeRuangan.pjNama}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <span className="font-mono tabular-nums">
                NIP. {activeRuangan.pjNip}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{activeRuangan.pjJabatan}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
