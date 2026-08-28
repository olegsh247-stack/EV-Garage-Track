/**
 * Курсы валют ЦБ РФ
 * Обновляется ежедневно в 17:00 МСК
 * Источник: https://www.cbr-xml-daily.ru/daily_json.js
 */

export const exchangeRates = {
  cnyToRub: 12.7691, // Юань → Рубль
  updatedAt: "2026-08-28T11:30:00+03:00", // Дата последнего обновления
} as const;

/**
 * Получить актуальный курс CNY→RUB
 */
export function getCnyRubRate(): number {
  return exchangeRates.cnyToRub;
}

/**
 * Конвертировать юани в рубли
 */
export function cnyToRub(cny: number): number {
  return cny * exchangeRates.cnyToRub;
}
