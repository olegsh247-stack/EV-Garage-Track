import type { Trim } from "@/data/vehicles";

// Для коммерческого транспорта точный расчёт растаможки индивидуален и зависит
// от кода ТН ВЭД, полной массы, партии и актуальных ставок — поэтому на сайте
// показываем ориентировочную цену «под ключ» из данных модели, а точный
// расчёт таможни выносим на страницу «Таможня» и в заявку («расчёт по запросу»).
//
// Функции сохраняют прежнюю сигнатуру (принимают курс юаня) для совместимости
// с вызывающими страницами, но курс сейчас не участвует в расчёте цены.

export type FullPriceBreakdown = {
  price: number; // ориентировочная цена «под ключ», ₽
  total: number; // то же значение — для совместимости со старым кодом
};

export function fullPriceBreakdown(
  trim: Trim,
  _cnyRubRate?: number
): FullPriceBreakdown {
  const price = trim.priceFrom;
  return { price, total: price };
}

// Быстрая итоговая цена — для карточек и списков.
export function totalPrice(trim: Trim, _cnyRubRate?: number): number {
  return trim.priceFrom;
}
