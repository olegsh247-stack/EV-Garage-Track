import Link from "next/link";
import type { Brand, Model } from "@/data/vehicles";
import { baseTrim, BODY_TYPE_LABELS } from "@/data/vehicles";
import { CarPhoto } from "./CarPhoto";
import { formatPrice } from "@/lib/format";
import { totalPrice } from "@/lib/pricing";

export function ModelCard({
  brand,
  model,
  photoUrl,
}: {
  brand: Brand;
  model: Model;
  photoUrl?: string;
  // cnyRate больше не влияет на цену, оставлен для обратной совместимости
  cnyRate?: number;
}) {
  const trim = baseTrim(model);

  const kpis = [
    { label: "Грузоподъёмность", value: `${trim.payloadKg} кг` },
    { label: "Объём кузова", value: `${trim.cargoVolumeM3} м³` },
    { label: "Запас хода", value: `${trim.rangeKm} км` },
    { label: "Права", value: `кат. ${trim.licenseCategory}` },
  ];

  return (
    <Link
      href={`/brand/${brand.slug}/${model.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-card transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(19,26,36,0.08)]"
    >
      <div className="relative">
        <CarPhoto
          photoUrl={photoUrl ?? model.image}
          accent={brand.accent}
          className="h-44 w-full"
          alt={model.name}
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-surface">
          {BODY_TYPE_LABELS[model.bodyType]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {model.name}
          </h3>
          <p className="text-sm text-ink-soft">{model.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-surface px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">
                {kpi.label}
              </p>
              <p className="font-display text-sm font-semibold text-ink">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              Цена от
            </p>
            <p className="font-display text-lg font-semibold text-ink">
              {formatPrice(totalPrice(trim))}
            </p>
          </div>
          <span className="font-mono text-xs text-charge transition-transform group-hover:translate-x-1">
            Подробнее →
          </span>
        </div>
      </div>
    </Link>
  );
}
