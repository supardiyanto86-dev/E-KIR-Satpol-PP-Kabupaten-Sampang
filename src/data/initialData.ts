import { InventoryState } from '../types/inventory';

import assetPcWorkstation from '../assets/images/asset_pc_workstation_1795675672506.jpg';
import assetArchiveCabinet from '../assets/images/asset_archive_cabinet_1795675673642.jpg';
import assetAcSplit from '../assets/images/asset_ac_split_1795675673779.jpg';
import assetLaptopBusiness from '../assets/images/asset_laptop_business_1795675676088.jpg';

import avatarPjAhmad from '../assets/images/avatar_pj_ahmad_1795675674522.jpg';
import avatarPjRina from '../assets/images/avatar_pj_rina_1795675674923.jpg';
import avatarAsnSiti from '../assets/images/avatar_asn_siti_1795675675410.jpg';
import avatarAsnDimas from '../assets/images/avatar_asn_dimas_1795675675800.jpg';

export function getFormattedNow(): string {
  const now = new Date();
  const datePart = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart}, ${timePart}`;
}

export const INITIAL_INVENTORY_STATE: InventoryState = {
  activeRuanganId: 'R-01',
  lastUpdated: 1795675676088,
  ruangan: [
    {
      id: 'R-01',
      kode: 'R.101',
      nama: 'Ruang Sekretariat & Tata Usaha',
      lokasi: 'Lantai 1 - Gedung Utama',
      pjNama: 'Drs. H. Ahmad Fauzi, M.AP',
      pjNip: '19750412 200003 1 004',
      pjJabatan: 'Kepala Sub Bagian Umum & Kepegawaian',
      pjFoto: avatarPjAhmad,
    },
    {
      id: 'R-02',
      kode: 'R.202',
      nama: 'Ruang Bidang Perencanaan & IT',
      lokasi: 'Lantai 2 - Sayap Barat',
      pjNama: 'Rina Kartika Dewi, S.T., M.Kom',
      pjNip: '19841120 200902 2 007',
      pjJabatan: 'Kepala Bidang Infrastruktur & TIK',
      pjFoto: avatarPjRina,
    },
    {
      id: 'R-03',
      kode: 'R.301',
      nama: 'Ruang Rapat Pimpinan',
      lokasi: 'Lantai 3 - Gedung Utama',
      pjNama: 'Bambang Sutrisno, S.Sos',
      pjNip: '19800215 200604 1 011',
      pjJabatan: 'Pengelola Barang Milik Daerah',
      pjFoto: '',
    },
  ],
  barang: [
    {
      id: 'BRG-001',
      ruanganId: 'R-01',
      kode: '3.10.01.02.001',
      nama: 'Komputer All-in-One (PC Workstation)',
      merk: 'HP ProOne 440 G9 Core i7',
      tahun: 2024,
      baik: 3,
      rusakRingan: 1,
      rusakBerat: 0,
      fotoBarang: assetPcWorkstation,
      asnNama: 'Siti Nurhaliza, S.E.',
      asnNip: '19920315 201903 2 012',
      asnFoto: avatarAsnSiti,
    },
    {
      id: 'BRG-002',
      ruanganId: 'R-01',
      kode: '3.05.01.04.002',
      nama: 'Lemari Arsip Besi Pintu Kaca',
      merk: 'Brother B-304 Heavy Duty',
      tahun: 2021,
      baik: 2,
      rusakRingan: 0,
      rusakBerat: 0,
      fotoBarang: assetArchiveCabinet,
      asnNama: 'Hendra Wijaya, A.Md',
      asnNip: '19900722 201502 1 003',
      asnFoto: avatarAsnDimas,
    },
    {
      id: 'BRG-003',
      ruanganId: 'R-01',
      kode: '3.05.02.04.006',
      nama: 'AC Split Wall Mounted 2 PK',
      merk: 'Daikin Inverter FTKC50',
      tahun: 2020,
      baik: 1,
      rusakRingan: 0,
      rusakBerat: 1,
      fotoBarang: assetAcSplit,
      asnNama: 'Drs. H. Ahmad Fauzi, M.AP',
      asnNip: '19750412 200003 1 004',
      asnFoto: avatarPjAhmad,
    },
    {
      id: 'BRG-004',
      ruanganId: 'R-02',
      kode: '3.10.01.02.002',
      nama: 'Laptop Operasional Lapangan',
      merk: 'Lenovo ThinkPad X1 Carbon',
      tahun: 2025,
      baik: 4,
      rusakRingan: 0,
      rusakBerat: 0,
      fotoBarang: assetLaptopBusiness,
      asnNama: 'Dimas Pratama, S.Kom',
      asnNip: '19950810 202012 1 005',
      asnFoto: avatarAsnDimas,
    },
  ],
  mutasi: [
    {
      id: 'MUT-01',
      ruanganId: 'R-01',
      jenis: 'MASUK',
      tanggal: '26 Nov 2026, 09.15',
      kodeBarang: '3.10.01.02.001',
      namaBarang: 'Komputer All-in-One (PC Workstation)',
      jumlah: 2,
      kondisi: 'B',
      asalTujuan: 'Gudang Pengadaan Aset 2024',
      keterangan: 'BAST No. 112/ASET/2024 - Penambahan unit staf TU',
      petugas: 'Admin Pengurus Barang',
    },
    {
      id: 'MUT-02',
      ruanganId: 'R-01',
      jenis: 'KELUAR',
      tanggal: '20 Nov 2026, 14.30',
      kodeBarang: '3.10.02.03.003',
      namaBarang: 'Printer Epson EcoTank L3210',
      jumlah: 1,
      kondisi: 'RR',
      asalTujuan: 'Ruang Bidang Perencanaan & IT (R.202)',
      keterangan: 'BAST No. 108/MUT/2026 - Dipinjamkan untuk operasional',
      petugas: 'Siti Nurhaliza, S.E.',
    },
  ],
};
