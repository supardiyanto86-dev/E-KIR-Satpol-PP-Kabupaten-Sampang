export type KondisiCode = 'B' | 'RR' | 'RB';

export type JenisMutasi = 'MASUK' | 'KELUAR';

export type ActiveView = 'barang' | 'mutasi' | 'rekap';

export type FilterMutasi = 'SEMUA' | JenisMutasi;

export type FilterKondisi = 'SEMUA' | KondisiCode;

export interface Ruangan {
  id: string;
  kode: string;
  nama: string;
  lokasi: string;
  pjNama: string;
  pjNip: string;
  pjJabatan: string;
  pjFoto: string;
}

export interface BarangInventaris {
  id: string;
  ruanganId: string;
  kode: string;
  nama: string;
  merk: string;
  tahun: number;
  baik: number;
  rusakRingan: number;
  rusakBerat: number;
  fotoBarang: string;
  asnNama: string;
  asnNip: string;
  asnFoto: string;
}

export interface RiwayatMutasi {
  id: string;
  ruanganId: string;
  jenis: JenisMutasi;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  kondisi: KondisiCode;
  asalTujuan: string;
  keterangan: string;
  petugas: string;
}

export interface InventoryState {
  activeRuanganId: string;
  ruangan: Ruangan[];
  barang: BarangInventaris[];
  mutasi: RiwayatMutasi[];
  lastUpdated: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
