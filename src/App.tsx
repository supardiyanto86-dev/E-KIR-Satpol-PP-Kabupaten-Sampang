import { useState } from 'react';
import { Clock, ListChecks } from 'lucide-react';
import { ActiveView, BarangInventaris } from './types/inventory';
import { useInventoryStore } from './hooks/useInventoryStore';
import { TopBar } from './components/TopBar';
import { RoomSidebar } from './components/RoomSidebar';
import { RoomHeaderProfile } from './components/RoomHeaderProfile';
import { StatsStrip } from './components/StatsStrip';
import { InventoryTable } from './components/InventoryTable';
import { MutationTable } from './components/MutationTable';
import { OverviewRecap } from './components/OverviewRecap';
import { PrintKirDocument } from './components/PrintKirDocument';
import { ToastContainer } from './components/ToastContainer';
import { BarangModal } from './components/modals/BarangModal';
import { MutasiModal } from './components/modals/MutasiModal';
import { RuanganModal } from './components/modals/RuanganModal';
import { PhotoPreviewModal } from './components/modals/PhotoPreviewModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';

export default function App() {
  const {
    state,
    activeRuangan,
    toasts,
    dismissToast,
    selectRoom,
    addRoom,
    saveBarang,
    deleteBarang,
    processMutasi,
    resetDemoData,
  } = useInventoryStore();

  const [activeView, setActiveView] = useState<ActiveView>('barang');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [barangModalOpen, setBarangModalOpen] = useState(false);
  const [editingBarang, setEditingBarang] = useState<BarangInventaris | null>(null);

  const [mutasiModalOpen, setMutasiModalOpen] = useState(false);
  const [preselectedMutasiItem, setPreselectedMutasiItem] =
    useState<BarangInventaris | null>(null);

  const [ruanganModalOpen, setRuanganModalOpen] = useState(false);
  const [deletingBarang, setDeletingBarang] = useState<BarangInventaris | null>(
    null
  );
  const [previewPhoto, setPreviewPhoto] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  const barangRuangan = state.barang.filter(
    (b) => b.ruanganId === state.activeRuanganId
  );
  const mutasiRuangan = state.mutasi.filter(
    (m) => m.ruanganId === state.activeRuanganId
  );
  const ruanganLain = state.ruangan.filter(
    (r) => r.id !== state.activeRuanganId
  );

  const handleOpenAddBarang = () => {
    setEditingBarang(null);
    setBarangModalOpen(true);
  };

  const handleOpenEditBarang = (item: BarangInventaris) => {
    setEditingBarang(item);
    setBarangModalOpen(true);
  };

  const handleOpenMutasi = (preselect?: BarangInventaris) => {
    setPreselectedMutasiItem(preselect || null);
    setMutasiModalOpen(true);
  };

  const handleSelectRoomAndOpen = (roomId: string) => {
    selectRoom(roomId);
    setActiveView('barang');
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenMutasi={() => handleOpenMutasi()}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      <div className="max-w-[1440px] mx-auto flex min-h-[calc(100vh-4rem)] no-print">
        <RoomSidebar
          ruangan={state.ruangan}
          barang={state.barang}
          activeRuanganId={state.activeRuanganId}
          onSelectRoom={(id) => {
            selectRoom(id);
            if (activeView === 'rekap') setActiveView('barang');
          }}
          onOpenAddRoom={() => setRuanganModalOpen(true)}
          onResetData={resetDemoData}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {activeView === 'rekap' ? (
            <OverviewRecap
              ruangan={state.ruangan}
              barang={state.barang}
              mutasi={state.mutasi}
              activeRuanganId={state.activeRuanganId}
              onSelectRoomAndOpen={handleSelectRoomAndOpen}
              onOpenAddRoom={() => setRuanganModalOpen(true)}
            />
          ) : (
            <>
              <RoomHeaderProfile
                ruangan={state.ruangan}
                activeRuangan={activeRuangan}
                onSelectRoom={(id) => selectRoom(id)}
                onOpenAddBarang={handleOpenAddBarang}
                onOpenMutasi={() => handleOpenMutasi()}
                onPrintKir={() => window.print()}
                onPreviewPhoto={(src, caption) =>
                  setPreviewPhoto({ src, caption })
                }
              />

              <StatsStrip barangRuangan={barangRuangan} />

              {/* Main Workspace Table Section */}
              <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Workspace Sub-Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 bg-slate-50/70 overflow-x-auto">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setActiveView('barang')}
                      className={`relative py-3.5 text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        activeView === 'barang'
                          ? 'font-semibold text-blue-700'
                          : 'font-medium text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ListChecks className="w-4 h-4" />
                      <span>Daftar Barang Inventaris</span>
                      <span className="font-mono tabular-nums text-xs text-slate-500">
                        ({barangRuangan.length})
                      </span>
                      {activeView === 'barang' && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveView('mutasi')}
                      className={`relative py-3.5 text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        activeView === 'mutasi'
                          ? 'font-semibold text-blue-700'
                          : 'font-medium text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Riwayat Mutasi Masuk &amp; Keluar</span>
                      <span className="font-mono tabular-nums text-xs text-slate-500">
                        ({mutasiRuangan.length})
                      </span>
                      {activeView === 'mutasi' && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                      )}
                    </button>
                  </div>
                </div>

                {activeView === 'barang' ? (
                  <InventoryTable
                    items={barangRuangan}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onEdit={handleOpenEditBarang}
                    onQuickMutasi={(item) => handleOpenMutasi(item)}
                    onDeleteRequest={setDeletingBarang}
                    onAddBarang={handleOpenAddBarang}
                    onPreviewPhoto={(src, caption) =>
                      setPreviewPhoto({ src, caption })
                    }
                  />
                ) : (
                  <MutationTable
                    mutasiList={mutasiRuangan}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onOpenMutasi={() => handleOpenMutasi()}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Print-Only Official KIR Layout */}
      <PrintKirDocument ruangan={activeRuangan} items={barangRuangan} />

      {/* Interactive Modals */}
      <BarangModal
        isOpen={barangModalOpen}
        editingItem={editingBarang}
        onClose={() => setBarangModalOpen(false)}
        onSave={saveBarang}
      />

      <MutasiModal
        isOpen={mutasiModalOpen}
        preselectedBarang={preselectedMutasiItem}
        barangRuangan={barangRuangan}
        ruanganLain={ruanganLain}
        onClose={() => setMutasiModalOpen(false)}
        onSubmit={processMutasi}
      />

      <RuanganModal
        isOpen={ruanganModalOpen}
        onClose={() => setRuanganModalOpen(false)}
        onSave={addRoom}
      />

      <PhotoPreviewModal
        src={previewPhoto?.src || null}
        caption={previewPhoto?.caption || ''}
        onClose={() => setPreviewPhoto(null)}
      />

      <ConfirmDeleteModal
        item={deletingBarang}
        onCancel={() => setDeletingBarang(null)}
        onConfirm={deleteBarang}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
