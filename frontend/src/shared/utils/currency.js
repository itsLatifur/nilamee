// Currency utilities for consistent BDT formatting across the app

export const CURRENCY_CODE = "BDT";

export const formatBDT = (amount, options = {}) => {
  try {
    const formatter = new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: CURRENCY_CODE,
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    });
    return formatter.format(Number(amount) || 0);
  } catch (e) {
    // Fallback: prefix with BDT if Intl lacks symbol support
    const n = Number(amount) || 0;
    return `BDT ${n.toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
};

export default {
  CURRENCY_CODE,
  formatBDT,
};
