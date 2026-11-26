import React from 'react';
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { BarangInventaris } from '../types/inventory';

interface StatsStripProps {
  barangRuangan: BarangInventaris[];
}

export const StatsStrip: React.FC<StatsStripProps> = ({ barangRuangan }) => {
  const totals = barangRuangan.reduce(
    (acc, item) => {
      acc.baik += item.baik;
      acc.rr += item.rusakRingan;
      acc.rb += item.rusakBerat;
      return acc;
    },
    { baik: 0, rr: 0, rb: 0 }
  );

  const totalUnit = totals.baik + totals.rr + totals.rb;

  const stats = [
    {
      label: 'Total Unit Barang',
      value: totalUnit,
      sub: `${barangRuangan.length} jenis aset`,
      icon: Boxes,
      valueClass: 'text-slate-900',
      iconClass: 'text-blue-600',
    },
    {
      label: 'Kondisi Baik (B)',
      value: totals.baik,
      sub: totalUnit > 0 ? `${Math.round((totals.baik / totalUnit) * 100)}% laik pakai` : '0% laik pakai',
      icon: CheckCircle2,
      valueClass: 'text-emerald-700',
      iconClass: 'text-emerald-600',
    },
    {
      label: 'Rusak Ringan (RR)',
      value: totals.rr,
      sub: 'Perlu pemeliharaan',
      icon: AlertTriangle,
      valueClass: 'text-amber-700',
      iconClass: 'text-amber-600',
    },
    {
      label: 'Rusak Berat (RB)',
      value: totals.rb,
      sub: 'Usulan penghapusan',
      icon: XCircle,
      valueClass: 'text-rose-700',
      iconClass: 'text-rose-600',
    },
  ];

  return (
    <section
      aria-label="Ringkasan Statistik Ruangan"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p
                className={`text-2xl font-bold font-mono tabular-nums mt-1 ${s.valueClass}`}
              >
                {s.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
            </div>
            <Icon className={`w-5 h-5 shrink-0 ${s.iconClass}`} />
          </div>
        );
      })}
    </section>
  );
};
