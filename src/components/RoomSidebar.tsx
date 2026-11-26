import React from 'react';
import { Building2, Plus, RotateCcw, X } from 'lucide-react';
import { BarangInventaris, Ruangan } from '../types/inventory';

interface RoomSidebarProps {
  ruangan: Ruangan[];
  barang: BarangInventaris[];
  activeRuanganId: string;
  onSelectRoom: (id: string) => void;
  onOpenAddRoom: () => void;
  onResetData: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  ruangan,
  barang,
  activeRuanganId,
  onSelectRoom,
  onOpenAddRoom,
  onResetData,
  mobileOpen,
  onCloseMobile,
}) => {
  const getRoomUnitCount = (roomId: string) =>
    barang
      .filter((b) => b.ruanganId === roomId)
      .reduce((acc, b) => acc + b.baik + b.rusakRingan + b.rusakBerat, 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Daftar Ruangan</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Tutup daftar ruangan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {ruangan.map((r) => {
          const isActive = r.id === activeRuanganId;
          const unitCount = getRoomUnitCount(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelectRoom(r.id);
                onCloseMobile();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start justify-between gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isActive
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <span className={isActive ? 'text-blue-700 font-semibold' : ''}>
                    {r.kode}
                  </span>
                </div>
                <div
                  className={`text-sm truncate mt-0.5 ${
                    isActive ? 'font-semibold text-blue-950' : 'font-medium text-slate-800'
                  }`}
                >
                  {r.nama}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {r.pjNama}
                </div>
              </div>
              <span
                className={`text-xs font-mono tabular-nums shrink-0 mt-0.5 ${
                  isActive ? 'text-blue-700 font-semibold' : 'text-slate-500'
                }`}
              >
                {unitCount}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 space-y-2">
        <button
          type="button"
          onClick={() => {
            onOpenAddRoom();
            onCloseMobile();
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ruangan</span>
        </button>
        <button
          type="button"
          onClick={onResetData}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Pulihkan Data Awal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:block w-[264px] shrink-0 no-print">
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{sidebarContent}</div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
