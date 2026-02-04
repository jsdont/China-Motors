import { getMRP, UTIL_RULES } from "./calc.config.js";

// Утильсбор
export function calcUtil(type, year) {
  const mrp = getMRP(year);

  const coef = UTIL_RULES[type] ?? 0;

  return coef * mrp;
}

// Первичная регистрация
export function calcFirstReg(type, year, isInternational) {
  if (type === "tractor" && isInternational) return 0;

  return 1.25 * getMRP(year);
}
