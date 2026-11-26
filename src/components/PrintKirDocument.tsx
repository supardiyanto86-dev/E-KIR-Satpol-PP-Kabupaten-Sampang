import React from 'react';
import { BarangInventaris, Ruangan } from '../types/inventory';

interface PrintKirDocumentProps {
  ruangan: Ruangan;
  items: BarangInventaris[];
}

export const PrintKirDocument: React.FC<PrintKirDocumentProps> = ({
  ruangan,
  items,
}) => {
  const todayLabel = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const totals = items.reduce(
    (acc, b) => ({
      total: acc.total + b.baik + b.rusakRingan + b.rusakBerat,
      baik: acc.baik + b.baik,
      rr: acc.rr + b.rusakRingan,
      rb: acc.rb + b.rusakBerat,
    }),
    { total: 0, baik: 0, rr: 0, rb: 0 }
  );

  return (
    <div className="hidden print:block text-black bg-white p-2">
      {/* Official Header */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-lg font-bold uppercase tracking-wide">
          KARTU INVENTARIS RUANGAN (KIR)
        </h1>
        <p className="text-xs mt-0.5">
          Laporan Kondisi Barang Milik Instansi Secara Realtime
        </p>
      </div>

      {/* Room Metadata */}
      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-0.5 w-36 font-semibold">Kode Ruangan</td>
              <td className="py-0.5">: {ruangan.kode}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Nama Ruangan</td>
              <td className="py-0.5">: {ruangan.nama}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Lokasi</td>
              <td className="py-0.5">: {ruangan.lokasi}</td>
            </tr>
          </tbody>
        </table>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-0.5 w-40 font-semibold">Penanggung Jawab</td>
              <td className="py-0.5">: {ruangan.pjNama}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">NIP</td>
              <td className="py-0.5 font-mono">: {ruangan.pjNip}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Tanggal Cetak</td>
              <td className="py-0.5">: {todayLabel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Official KIR Table */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-slate-100">
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-center w-8">
              No
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-left">
              Nama Barang / Jenis Barang
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-left">
              Merk / Spesifikasi
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-left">
              Kode Register
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-center w-14">
              Tahun
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-center w-14">
              Jumlah
            </th>
            <th colSpan={3} className="border border-black px-2 py-1 text-center">
              Keadaan Barang
            </th>
            <th rowSpan={2} className="border border-black px-2 py-1.5 text-left">
              ASN Pengguna & NIP
            </th>
          </tr>
          <tr className="bg-slate-100">
            <th className="border border-black px-2 py-1 text-center w-10">B</th>
            <th className="border border-black px-2 py-1 text-center w-10">RR</th>
            <th className="border border-black px-2 py-1 text-center w-10">RB</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={10} className="border border-black px-3 py-4 text-center">
                Tidak ada barang inventaris tercatat pada ruangan ini.
              </td>
            </tr>
          ) : (
            items.map((item, idx) => {
              const total = item.baik + item.rusakRingan + item.rusakBerat;
              return (
                <tr key={item.id}>
                  <td className="border border-black px-2 py-1.5 text-center tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-medium">
                    {item.nama}
                  </td>
                  <td className="border border-black px-2 py-1.5">
                    {item.merk || '-'}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-mono">
                    {item.kode}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center tabular-nums">
                    {item.tahun}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center font-semibold tabular-nums">
                    {total}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center tabular-nums">
                    {item.baik}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center tabular-nums">
                    {item.rusakRingan}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center tabular-nums">
                    {item.rusakBerat}
                  </td>
                  <td className="border border-black px-2 py-1.5">
                    <div className="font-medium">{item.asnNama}</div>
                    <div className="font-mono text-[10px]">NIP. {item.asnNip}</div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-slate-50">
            <td colSpan={5} className="border border-black px-2 py-1.5 text-right">
              Jumlah Total
            </td>
            <td className="border border-black px-2 py-1.5 text-center tabular-nums">
              {totals.total}
            </td>
            <td className="border border-black px-2 py-1.5 text-center tabular-nums">
              {totals.baik}
            </td>
            <td className="border border-black px-2 py-1.5 text-center tabular-nums">
              {totals.rr}
            </td>
            <td className="border border-black px-2 py-1.5 text-center tabular-nums">
              {totals.rb}
            </td>
            <td className="border border-black px-2 py-1.5" />
          </tr>
        </tfoot>
      </table>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-12 mt-8 text-xs">
        <div className="text-center">
          <p>Mengetahui,</p>
          <p className="font-semibold">Pengurus Barang Milik Daerah</p>
          <div className="h-16" />
          <p className="font-bold underline">...........................................</p>
          <p className="font-mono mt-0.5">NIP. ...........................................</p>
        </div>
        <div className="text-center">
          <p>Penanggung Jawab Ruangan,</p>
          <p className="font-semibold">{ruangan.pjJabatan}</p>
          <div className="h-16" />
          <p className="font-bold underline">{ruangan.pjNama}</p>
          <p className="font-mono mt-0.5">NIP. {ruangan.pjNip}</p>
        </div>
      </div>
    </div>
  );
};
