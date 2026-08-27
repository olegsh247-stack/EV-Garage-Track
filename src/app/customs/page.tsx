import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import {
  FileText,
  Percent,
  Receipt,
  Recycle,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Таможня — растаможка электрогрузовиков из Китая | EV-Garage-Trucks",
  description:
    "Таможенное оформление коммерческого электротранспорта из Китая: код ТН ВЭД 8704, пошлина, НДС, утилизационный сбор, таможенный сбор, сертификация ОТТС/СБКТС/ЭПТС. Логика расчёта без гарантированных ставок.",
};

const sections = [
  {
    icon: FileText,
    title: "1. Код ТН ВЭД",
    body: (
      <>
        Грузовой электротранспорт классифицируется по группе{" "}
        <strong className="text-ink">8704</strong> ТН ВЭД ЕАЭС — «моторные
        транспортные средства для перевозки грузов», подкатегории для машин с
        электрическим двигателем. Точный десятизначный код зависит от полной
        массы, типа кузова и конструкции конкретной модели. От выбранного кода
        напрямую зависит ставка ввозной пошлины, поэтому его определяют по
        документации производителя ещё до расчёта платежей.
      </>
    ),
  },
  {
    icon: Percent,
    title: "2. Таможенная пошлина",
    body: (
      <>
        Ставка ввозной пошлины определяется кодом ТН ВЭД и рассчитывается как
        процент от таможенной стоимости (стоимость техники + доставка до границы
        ЕАЭС). Для разных подкатегорий группы 8704 ставки различаются, а на
        отдельные позиции могут действовать особые условия. Конкретный процент
        всегда сверяется с действующим Единым таможенным тарифом ЕАЭС на дату
        оформления.
      </>
    ),
  },
  {
    icon: Receipt,
    title: "3. НДС",
    body: (
      <>
        При ввозе начисляется НДС по ставке{" "}
        <strong className="text-ink">22% (с 2026 года; ранее — 20%)</strong>.
        База для НДС — сумма таможенной стоимости и начисленной пошлины (а при
        наличии — и акциза). Юридические лица на общей системе налогообложения,
        как правило, могут принять уплаченный при ввозе НДС к вычету — порядок
        уточняйте у своего бухгалтера.
      </>
    ),
  },
  {
    icon: Recycle,
    title: "4. Утилизационный сбор",
    body: (
      <>
        Для юридических лиц льготные («личные») коэффициенты не применяются —
        действует полная коммерческая ставка. Размер сбора считается как базовая
        ставка, умноженная на коэффициент, который для электрической техники
        зависит от массы и категории транспортного средства. Коэффициенты и
        базовые ставки регулярно пересматриваются постановлениями Правительства
        РФ, поэтому сумму всегда проверяют по актуальной редакции на дату ввоза.
      </>
    ),
  },
  {
    icon: Receipt,
    title: "5. Таможенный сбор за оформление",
    body: (
      <>
        Отдельный фиксированный сбор за таможенные операции. Его размер зависит
        от таможенной стоимости партии и устанавливается постановлением
        Правительства РФ — это не процент, а ступенчатая шкала фиксированных
        сумм.
      </>
    ),
  },
];

const certifications = [
  {
    abbr: "ОТТС",
    title: "Одобрение типа транспортного средства",
    text: "Требуется для серийного ввоза одинаковых машин. Подтверждает соответствие типа ТС техрегламенту ТР ТС 018/2011.",
  },
  {
    abbr: "СБКТС",
    title: "Свидетельство безопасности конструкции ТС",
    text: "Оформляется для единичных ввозимых машин, когда нет ОТТС. Подтверждает безопасность конкретного экземпляра.",
  },
  {
    abbr: "ЭПТС",
    title: "Электронный паспорт транспортного средства",
    text: "Обязателен с 2019 года. Оформляется на основании ОТТС или СБКТС, без него невозможна постановка на учёт.",
  },
];

export default function CustomsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1000px] px-5 pb-8 pt-10">
          <Breadcrumbs
            items={[{ label: "Все марки", href: "/" }, { label: "Таможня" }]}
          />
          <p className="mt-6 font-mono text-xs uppercase tracking-wide text-charge">
            Растаможка · коммерческий электротранспорт
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Таможенное оформление электрогрузовиков из Китая
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
            Ниже — общая логика расчёта платежей и обязательная сертификация при
            ввозе коммерческого электротранспорта из Китая для юридических лиц.
            Материал носит справочный характер: конкретные суммы и проценты
            зависят от кода ТН ВЭД, характеристик машины и актуальных ставок,
            которые регулярно меняются.
          </p>
        </section>

        <section className="mx-auto max-w-[1000px] px-5 py-8">
          <div className="grid gap-4">
            {sections.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-line bg-surface-card p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
                    <s.icon className="text-charge" size={18} />
                  </span>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    {s.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Сертификация */}
        <section className="mx-auto max-w-[1000px] px-5 py-8">
          <div className="flex items-center gap-3">
            <BadgeCheck className="text-charge" size={20} />
            <h2 className="font-display text-2xl font-semibold text-ink">
              6. Обязательная сертификация
            </h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {certifications.map((c) => (
              <div
                key={c.abbr}
                className="rounded-2xl border border-line bg-surface-card p-5"
              >
                <p className="font-display text-xl font-bold text-ink">
                  {c.abbr}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Дисклеймер + CTA */}
        <section className="mx-auto max-w-[1000px] px-5 py-8">
          <div className="rounded-2xl border border-charge/30 bg-charge/5 p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-charge" size={20} />
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Точный расчёт стоимости растаможки — по запросу
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Ставки пошлин, НДС и утилизационного сбора, а также
                  коэффициенты и правила меняются. Мы не публикуем конкретные
                  суммы как гарантированные — итоговую стоимость рассчитываем под
                  конкретную модель и партию вместе с таможенным брокером.
                  Всегда уточняйте актуальные данные перед сделкой.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ContactCTA modelName="растаможке под ваш проект" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
