import type { Trim } from "@/data/vehicles";

// Для коммерческого транспорта точный расчёт растаможки индивидуален и зависит
// от кода ТН ВЭД, полной массы, партии и актуальных ставок — поэтому на сайте
// показываем ориентировочную цену «под ключ» из данных модели, а точный
// расчёт таможни выносим на страницу «Таможня» и в заявку («расчёт по запросу»).
//
// Функции сохраняют прежнюю сигнатуру (принимают курс юаня) для совместимости
// с вызывающими страницами, но курс сейчас не участвует в расчёте цены.

// Ориентировочная разбивка итоговой цены «под ключ» на составляющие.
// Точные ставки таможни не публикуем — показываем только условную структуру
// стоимости, чтобы клиент понимал, из чего складывается цена.
export type FullPriceBreakdown = {
  chinaPrice: number; // цена в Китае, ₽ (ориентировочно ~60% от итога)
  customs: number; // таможня, ₽ (ориентировочно ~25% от итога)
  logistics: number; // логистика, ₽ (ориентировочно ~15% от итога)
  total: number; // итоговая цена «под ключ», ₽ (trim.priceFrom)
};

// Доли составляющих в итоговой цене. Приблизительные, для наглядности.
const CHINA_SHARE = 0.6;
const CUSTOMS_SHARE = 0.25;
// Логистика — остаток, чтобы сумма частей точно сходилась с итогом.

export function fullPriceBreakdown(
  trim: Trim,
  cnyRubRate?: number
): FullPriceBreakdown {
  const total = trim.priceFrom;

  // Если известна цена в юанях и есть курс — считаем «цену в Китае» точнее.
  const chinaPrice =
    trim.priceCny && cnyRubRate
      ? Math.round(trim.priceCny * cnyRubRate)
      : Math.round(total * CHINA_SHARE);

  const customs = Math.round(total * CUSTOMS_SHARE);
  const logistics = Math.max(0, total - chinaPrice - customs);

  return { chinaPrice, customs, logistics, total };
}

// Быстрая итоговая цена — для карточек и списков.
export function totalPrice(trim: Trim, _cnyRubRate?: number): number {
  return trim.priceFrom;
}
