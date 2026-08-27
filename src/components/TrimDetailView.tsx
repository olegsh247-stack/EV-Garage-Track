import Link from "next/link";
import type { Brand, Model, Trim } from "@/data/vehicles";
import {
  specSections,
  similarTrims,
  BODY_TYPE_LABELS,
  RANGE_SCALE_MAX,
} from "@/data/vehicles";
import { CarPhoto } from "./CarPhoto";
import { ChargeBar } from "./ChargeBar";
import { AddToCompareButton } from "./AddToCompareButton";
import { ContactCTA } from "./ContactCTA";
import { Breadcrumbs } from "./Breadcrumbs";
import { formatPrice } from "@/lib/format";
import { totalPrice } from "@/lib/pricing";
import { getPhotoMap, photoKey } from "@/lib/photos";

export async function TrimDetailView({
  brand,
  model,
  trim,
}: {
  brand: Brand;
  model: Model;
  trim: Trim;
}) {
  const hasMultipleTrims = model.trims.length > 1;
  const sections = specSections(model, trim);
  const photoMap = await getPhotoMap();
  const photoUrl = photoMap[photoKey(brand.slug, model.slug)] ?? model.image;

  const baseSlug = [...model.trims].sort(
    (a, b) => a.priceFrom - b.priceFrom
  )[0].slug;
  const trimHref = (t: Trim) =>
    t.slug === baseSlug
      ? `/brand/${brand.slug}/${model.slug}`
      : `/brand/${brand.slug}/${model.slug}/${t.slug}`;

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-10">
      <Breadcrumbs
        items={[
          { label: "Все марки", href: "/" },
          { label: brand.name, href: `/brand/${brand.slug}` },
          {
            label: model.name,
            href: hasMultipleTrims
              ? `/brand/${brand.slug}/${model.slug}`
              : undefined,
          },
          ...(hasMultipleTrims ? [{ label: trim.name }] : []),
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
            {brand.name} · {BODY_TYPE_LABELS[model.bodyType]}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {model.name}
            {hasMultipleTrims && (
              <span className="text-ink-soft"> · {trim.name}</span>
            )}
          </h1>
          <p className="mt-2 text-base text-ink-soft">
            {trim.highlight ?? model.tagline}
          </p>

          {/* Ключевые грузовые показатели */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Грузоподъёмность", value: `${trim.payloadKg} кг` },
              { label: "Объём кузова", value: `${trim.cargoVolumeM3} м³` },
              { label: "Запас хода", value: `${trim.rangeKm} км` },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-line bg-surface-card p-3 text-center"
              >
                <p className="font-display text-lg font-semibold text-ink">
                  {kpi.value}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>

          {hasMultipleTrims && (
            <div className="mt-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                Версия
              </p>
              <div className="flex flex-wrap gap-2">
                {model.trims.map((t) => {
                  const active = t.slug === trim.slug;
                  return (
                    <Link
                      key={t.slug}
                      href={trimHref(t)}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-ink bg-ink text-surface"
                          : "border-line bg-surface-card text-ink hover:border-ink"
                      }`}
                    >
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              Ориентировочная цена «под ключ»
            </p>
            <p className="font-display text-3xl font-bold text-ink">
              {formatPrice(totalPrice(trim))}
            </p>
            <p className="mt-2 text-xs text-ink-soft">
              Цена ориентировочная и зависит от комплектации, курса валют и
              актуальных условий поставки. Точный расчёт растаможки — по запросу:
              см. раздел{" "}
              <Link href="/customs" className="text-charge hover:underline">
                «Таможня»
              </Link>
              .
            </p>
          </div>

          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
              Запас хода
            </p>
            <div className="mt-2">
              <ChargeBar valueKm={trim.rangeKm} maxKm={RANGE_SCALE_MAX} />
            </div>
          </div>

          <div className="mt-6">
            <AddToCompareButton
              id={`${brand.slug}/${model.slug}/${trim.slug}`}
            />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft">
            {model.description}
          </p>

          {/* Характеристики — по разделам */}
          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                  {section.title}
                </p>
                <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface-card">
                  {section.rows.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <span className="text-sm text-ink-soft">
                        {spec.label}
                      </span>
                      <span className="text-right font-mono text-sm font-medium text-ink">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <CarPhoto
            photoUrl={photoUrl}
            accent={brand.accent}
            className="h-72 w-full rounded-2xl sm:h-96"
            alt={model.name}
          />

          <div className="mt-6 lg:sticky lg:top-24">
            <ContactCTA
              modelName={`${model.name}${hasMultipleTrims ? ` ${trim.name}` : ""}`}
            />

            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                Похожие модели
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {similarTrims(model.slug, trim.priceFrom).map((s) => (
                  <Link
                    key={`${s.brand.slug}/${s.model.slug}/${s.trim.slug}`}
                    href={`/brand/${s.brand.slug}/${s.model.slug}${
                      s.model.trims.length > 1 ? `/${s.trim.slug}` : ""
                    }`}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-surface-card p-2.5 transition-colors hover:border-ink"
                  >
                    <CarPhoto
                      photoUrl={
                        photoMap[photoKey(s.brand.slug, s.model.slug)] ??
                        s.model.image
                      }
                      accent={s.brand.accent}
                      className="h-12 w-16 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink group-hover:text-charge">
                        {s.model.name}
                      </p>
                      <p className="font-mono text-xs text-ink-soft">
                        {formatPrice(totalPrice(s.trim))}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
