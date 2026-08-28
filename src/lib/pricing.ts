import type { Trim } from "@/data/vehicles";
import { getCnyRubRate } from "@/data/exchangeRates";

/**
 * Разбивка итоговой цены на составляющие
 * Расчёт снизу вверх: Китай → Таможня → Логистика → Итого
 */
export type FullPriceBreakdown = {
  chinaPrice: number; // цена у дилера в Китае, ₽
  customs: number; // таможенные платежи (сбор + пошлина 15% + НДС 22% + утильсбор), ₽
  logistics: number; // логистика (15% от цены в Китае, но не менее 300 000 ₽), ₽
  total: number; // итоговая цена «под ключ», ₽
};

/**
 * Таможенный сбор за оформление в зависимости от стоимости партии (ПП РФ №342)
 */
function calculateCustomsFee(chinaPrice: number): number {
  if (chinaPrice <= 200_000) return 500;
  if (chinaPrice <= 450_000) return 1_000;
  if (chinaPrice <= 1_200_000) return 2_000;
  if (chinaPrice <= 2_500_000) return 5_500;
  if (chinaPrice <= 5_000_000) return 7_500;
  if (chinaPrice <= 10_000_000) return 20_000;
  return 30_000;
}

/**
 * Утилизационный сбор для грузовых EV, физлицо
 * Если мощность ≤ 80 кВт → льготная ставка (3 400 ₽ для нового)
 * Иначе → коммерческая ставка (базовая 150 000 ₽ × коэффициент)
 */
function calculateRecyclingFee(motorPowerKw: number, gvwKg: number): number {
  if (motorPowerKw <= 80) {
    // Льгота для физлиц (новый автомобиль, до 80 кВт)
    return 3_400;
  }
  // Коммерческая ставка для грузовиков > 80 кВт
  // Базовая ставка 150 000 ₽, коэффициент зависит от массы и возраста
  // Для новых грузовиков 2.3-7.5 тонн коэффициент ≈ 1.0-1.5
  const baseRate = 150_000;
  let coefficient = 1.0;
  if (gvwKg >= 3500 && gvwKg <= 5000) coefficient = 1.2;
  else if (gvwKg > 5000) coefficient = 1.5;
  return Math.round(baseRate * coefficient);
}

/**
 * Расчёт полной стоимости с разбивкой по компонентам
 * Формула растаможки для грузовых EV (ТН ВЭД 8704.60), физлицо:
 * - Таможенный сбор (по стоимости партии)
 * - Пошлина 15% от таможенной стоимости
 * - НДС 22% от (таможенная стоимость + пошлина)
 * - Утилизационный сбор (по мощности и массе)
 * Логистика: 15% от цены в Китае, но не менее 300 000 ₽
 */
export function fullPriceBreakdown(
  trim: Trim,
  _cnyRubRate?: number // оставлен для совместимости, но используется getCnyRubRate()
): FullPriceBreakdown {
  const cnyRate = getCnyRubRate();
  
  // 1. Цена в Китае (юани → рубли)
  const chinaPrice = trim.priceCny
    ? Math.round(trim.priceCny * cnyRate)
    : Math.round(trim.priceFrom * 0.35); // fallback, если priceCny не указана

  // 2. Таможня = Сбор + Пошлина + НДС + Утильсбор
  const customsFee = calculateCustomsFee(chinaPrice);
  const duty = Math.round(chinaPrice * 0.15); // пошлина 15%
  const vat = Math.round((chinaPrice + duty) * 0.22); // НДС 22%
  const recyclingFee = calculateRecyclingFee(trim.motorPowerKw, trim.gvwKg);
  const customs = customsFee + duty + vat + recyclingFee;

  // 3. Логистика (15% от цены в Китае, но не менее 300 000 ₽)
  const logistics = Math.max(Math.round(chinaPrice * 0.15), 300_000);

  // 4. Итого
  const total = chinaPrice + customs + logistics;

  return { chinaPrice, customs, logistics, total };
}

/**
 * Быстрая итоговая цена — для карточек и списков
 */
export function totalPrice(trim: Trim, cnyRubRate?: number): number {
  return fullPriceBreakdown(trim, cnyRubRate).total;
}
