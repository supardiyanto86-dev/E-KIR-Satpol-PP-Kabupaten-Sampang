import React from 'react';
import { ArrowLeftRight, Menu } from 'lucide-react';
import { ActiveView } from '../types/inventory';

interface TopBarProps {
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onOpenMutasi: () => void;
  onToggleMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onChangeView,
  onOpenMutasi,
  onToggleMobileSidebar,
}) => {
  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'barang', label: 'Inventaris Ruangan' },
    { id: 'mutasi', label: 'Riwayat Mutasi' },
    { id: 'rekap', label: 'Rekapitulasi Aset' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Buka daftar ruangan"
          >
            <Menu className="w-5 h-5" />
          </button>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onChangeView('barang');
            }}
            className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            E-KIR PRO
          </a>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeView(item.id)}
                className={`relative py-5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenMutasi}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Catat Mutasi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
