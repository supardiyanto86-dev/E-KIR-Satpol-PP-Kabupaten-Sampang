import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarangInventaris,
  InventoryState,
  KondisiCode,
  RiwayatMutasi,
  Ruangan,
  ToastMessage,
} from '../types/inventory';
import { getFormattedNow, INITIAL_INVENTORY_STATE } from '../data/initialData';

const STORAGE_KEY = 'ekir_pro_inventory_state_v1';
const CHANNEL_NAME = 'ekir_pro_realtime_sync_v1';

function loadStoredState(): InventoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY_STATE;
    const parsed = JSON.parse(raw) as InventoryState;
    if (!parsed || !Array.isArray(parsed.ruangan) || parsed.ruangan.length === 0) {
      return INITIAL_INVENTORY_STATE;
    }
    return parsed;
  } catch {
    return INITIAL_INVENTORY_STATE;
  }
}

export interface MutasiKeluarPayload {
  jenis: 'KELUAR';
  barangId: string;
  tujuanId: string;
  jumlah: number;
  kondisi: KondisiCode;
  keterangan: string;
}

export interface MutasiMasukPayload {
  jenis: 'MASUK';
  namaBarang: string;
  kodeBarang: string;
  tahun: number;
  asal: string;
  jumlah: number;
  kondisi: KondisiCode;
  keterangan: string;
}

export type MutasiPayload = MutasiKeluarPayload | MutasiMasukPayload;

export function useInventoryStore() {
  const [state, setState] = useState<InventoryState>(loadStoredState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const persistAndBroadcast = useCallback((next: InventoryState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      channelRef.current?.postMessage(next);
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, []);

  const updateState = useCallback(
    (updater: (prev: InventoryState) => InventoryState) => {
      setState((prev) => {
        const next = updater(prev);
        const stamped: InventoryState = { ...next, lastUpdated: Date.now() };
        persistAndBroadcast(stamped);
        return stamped;
      });
    },
    [persistAndBroadcast]
  );

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;
      channel.onmessage = (event: MessageEvent<InventoryState>) => {
        if (event.data && Array.isArray(event.data.ruangan)) {
          setState(event.data);
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as InventoryState;
          if (parsed && Array.isArray(parsed.ruangan)) {
            setState(parsed);
          }
        } catch {
          // Ignore malformed storage payload
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      channelRef.current?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeRuangan: Ruangan =
    state.ruangan.find((r) => r.id === state.activeRuanganId) || state.ruangan[0];

  const selectRoom = useCallback(
    (ruanganId: string, silent = false) => {
      const target = state.ruangan.find((r) => r.id === ruanganId);
      if (!target) return;
      updateState((prev) => ({ ...prev, activeRuanganId: ruanganId }));
      if (!silent) {
        showToast(`Memuat Kartu Inventaris: ${target.nama}`, 'info');
      }
    },
    [state.ruangan, updateState, showToast]
  );

  const addRoom = useCallback(
    (newRoomInput: Omit<Ruangan, 'id'>) => {
      const newId = `R-${Date.now()}`;
      const newRoom: Ruangan = { id: newId, ...newRoomInput };
      updateState((prev) => ({
        ...prev,
        activeRuanganId: newId,
        ruangan: [...prev.ruangan, newRoom],
      }));
      showToast(`Ruangan "${newRoom.nama}" berhasil ditambahkan.`, 'success');
    },
    [updateState, showToast]
  );

  const saveBarang = useCallback(
    (
      payload: Omit<BarangInventaris, 'id' | 'ruanganId'>,
      editId?: string
    ): boolean => {
      if (payload.baik + payload.rusakRingan + payload.rusakBerat <= 0) {
        showToast('Jumlah total unit barang minimal harus 1.', 'error');
        return false;
      }

      if (editId) {
        updateState((prev) => ({
          ...prev,
          barang: prev.barang.map((b) =>
            b.id === editId ? { ...b, ...payload } : b
          ),
        }));
        showToast('Data dan kondisi barang berhasil diperbarui.', 'success');
      } else {
        const newItem: BarangInventaris = {
          id: `BRG-${Date.now()}`,
          ruanganId: state.activeRuanganId,
          ...payload,
        };
        const totalUnits = payload.baik + payload.rusakRingan + payload.rusakBerat;
        const primaryKondisi: KondisiCode =
          payload.baik > 0 ? 'B' : payload.rusakRingan > 0 ? 'RR' : 'RB';

        updateState((prev) => ({
          ...prev,
          barang: [newItem, ...prev.barang],
          mutasi: [
            {
              id: `MUT-${Date.now()}`,
              ruanganId: prev.activeRuanganId,
              jenis: 'MASUK',
              tanggal: getFormattedNow(),
              kodeBarang: newItem.kode,
              namaBarang: newItem.nama,
              jumlah: totalUnits,
              kondisi: primaryKondisi,
              asalTujuan: 'Pencatatan Inventaris Baru',
              keterangan: `Input baru pemegang: ${newItem.asnNama}`,
              petugas: activeRuangan.pjNama,
            },
            ...prev.mutasi,
          ],
        }));
        showToast('Barang baru berhasil ditambahkan ke KIR.', 'success');
      }
      return true;
    },
    [state.activeRuanganId, activeRuangan.pjNama, updateState, showToast]
  );

  const deleteBarang = useCallback(
    (id: string) => {
      const target = state.barang.find((b) => b.id === id);
      if (!target) return;
      updateState((prev) => ({
        ...prev,
        barang: prev.barang.filter((b) => b.id !== id),
      }));
      showToast(`Barang "${target.nama}" dihapus dari daftar.`, 'info');
    },
    [state.barang, updateState, showToast]
  );

  const processMutasi = useCallback(
    (payload: MutasiPayload): boolean => {
      if (payload.jumlah <= 0) {
        showToast('Jumlah unit mutasi minimal harus 1.', 'error');
        return false;
      }

      if (payload.jenis === 'KELUAR') {
        const barang = state.barang.find((b) => b.id === payload.barangId);
        if (!barang) {
          showToast('Pilih barang yang valid untuk mutasi keluar.', 'error');
          return false;
        }

        const totalTersedia = barang.baik + barang.rusakRingan + barang.rusakBerat;
        if (payload.jumlah > totalTersedia) {
          showToast(
            `Jumlah mutasi (${payload.jumlah}) melebihi stok tersedia (${totalTersedia}).`,
            'error'
          );
          return false;
        }

        let nextBaik = barang.baik;
        let nextRR = barang.rusakRingan;
        let nextRB = barang.rusakBerat;
        let sisa = payload.jumlah;

        if (payload.kondisi === 'B' && nextBaik >= sisa) {
          nextBaik -= sisa;
          sisa = 0;
        } else if (payload.kondisi === 'RR' && nextRR >= sisa) {
          nextRR -= sisa;
          sisa = 0;
        } else if (payload.kondisi === 'RB' && nextRB >= sisa) {
          nextRB -= sisa;
          sisa = 0;
        } else {
          const pB = Math.min(nextBaik, sisa);
          nextBaik -= pB;
          sisa -= pB;
          const pRR = Math.min(nextRR, sisa);
          nextRR -= pRR;
          sisa -= pRR;
          const pRB = Math.min(nextRB, sisa);
          nextRB -= pRB;
          sisa -= pRB;
        }

        const ruangTujuan = state.ruangan.find((r) => r.id === payload.tujuanId);
        const namaTujuan = ruangTujuan
          ? `[${ruangTujuan.kode}] ${ruangTujuan.nama}`
          : 'Gudang Aset / Usulan Penghapusan';
        const nowLabel = getFormattedNow();
        const stamp = Date.now();

        updateState((prev) => {
          const updatedBarangList = prev.barang
            .map((b) =>
              b.id === barang.id
                ? { ...b, baik: nextBaik, rusakRingan: nextRR, rusakBerat: nextRB }
                : b
            )
            .filter((b) => b.baik + b.rusakRingan + b.rusakBerat > 0);

          const nextBarangList = ruangTujuan
            ? [
                {
                  ...barang,
                  id: `BRG-${stamp}`,
                  ruanganId: ruangTujuan.id,
                  baik: payload.kondisi === 'B' ? payload.jumlah : 0,
                  rusakRingan: payload.kondisi === 'RR' ? payload.jumlah : 0,
                  rusakBerat: payload.kondisi === 'RB' ? payload.jumlah : 0,
                },
                ...updatedBarangList,
              ]
            : updatedBarangList;

          const newMutasiLogs: RiwayatMutasi[] = [
            {
              id: `MUT-OUT-${stamp}`,
              ruanganId: prev.activeRuanganId,
              jenis: 'KELUAR',
              tanggal: nowLabel,
              kodeBarang: barang.kode,
              namaBarang: barang.nama,
              jumlah: payload.jumlah,
              kondisi: payload.kondisi,
              asalTujuan: namaTujuan,
              keterangan: payload.keterangan,
              petugas: activeRuangan.pjNama,
            },
          ];

          if (ruangTujuan) {
            newMutasiLogs.unshift({
              id: `MUT-IN-${stamp + 1}`,
              ruanganId: ruangTujuan.id,
              jenis: 'MASUK',
              tanggal: nowLabel,
              kodeBarang: barang.kode,
              namaBarang: barang.nama,
              jumlah: payload.jumlah,
              kondisi: payload.kondisi,
              asalTujuan: `[${activeRuangan.kode}] ${activeRuangan.nama}`,
              keterangan: payload.keterangan,
              petugas: activeRuangan.pjNama,
            });
          }

          return {
            ...prev,
            barang: nextBarangList,
            mutasi: [...newMutasiLogs, ...prev.mutasi],
          };
        });

        showToast(
          `Mutasi keluar ${payload.jumlah} unit ${barang.nama} berhasil dicatat.`,
          'success'
        );
        return true;
      } else {
        if (!payload.namaBarang.trim() || !payload.asal.trim()) {
          showToast('Lengkapi nama barang dan asal mutasi.', 'error');
          return false;
        }

        const stamp = Date.now();
        const kode = payload.kodeBarang.trim() || '3.10.01.99.001';

        updateState((prev) => ({
          ...prev,
          barang: [
            {
              id: `BRG-${stamp}`,
              ruanganId: prev.activeRuanganId,
              kode,
              nama: payload.namaBarang.trim(),
              merk: 'Mutasi Masuk',
              tahun: payload.tahun,
              baik: payload.kondisi === 'B' ? payload.jumlah : 0,
              rusakRingan: payload.kondisi === 'RR' ? payload.jumlah : 0,
              rusakBerat: payload.kondisi === 'RB' ? payload.jumlah : 0,
              fotoBarang: '',
              asnNama: activeRuangan.pjNama,
              asnNip: activeRuangan.pjNip,
              asnFoto: activeRuangan.pjFoto,
            },
            ...prev.barang,
          ],
          mutasi: [
            {
              id: `MUT-IN-${stamp}`,
              ruanganId: prev.activeRuanganId,
              jenis: 'MASUK',
              tanggal: getFormattedNow(),
              kodeBarang: kode,
              namaBarang: payload.namaBarang.trim(),
              jumlah: payload.jumlah,
              kondisi: payload.kondisi,
              asalTujuan: payload.asal.trim(),
              keterangan: payload.keterangan,
              petugas: activeRuangan.pjNama,
            },
            ...prev.mutasi,
          ],
        }));

        showToast(
          `Mutasi masuk ${payload.jumlah} unit ${payload.namaBarang} berhasil dicatat.`,
          'success'
        );
        return true;
      }
    },
    [state.barang, state.ruangan, activeRuangan, updateState, showToast]
  );

  const resetDemoData = useCallback(() => {
    const fresh: InventoryState = {
      ...INITIAL_INVENTORY_STATE,
      lastUpdated: Date.now(),
    };
    setState(fresh);
    persistAndBroadcast(fresh);
    showToast('Data inventaris awal berhasil dipulihkan.', 'info');
  }, [persistAndBroadcast, showToast]);

  return {
    state,
    activeRuangan,
    toasts,
    dismissToast,
    showToast,
    selectRoom,
    addRoom,
    saveBarang,
    deleteBarang,
    processMutasi,
    resetDemoData,
  };
}
