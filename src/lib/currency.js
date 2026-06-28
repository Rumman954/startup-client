export const PREMIUM_PRICE_USD = 29.99;

export const CURRENCIES = {
  usd: { code: 'usd', label: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
  bdt: { code: 'bdt', label: 'BDT', symbol: 'BDT', flag: '🇧🇩', rate: 127.6672 },
  eur: { code: 'eur', label: 'EUR', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  gbp: { code: 'gbp', label: 'GBP', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  inr: { code: 'inr', label: 'INR', symbol: '₹', flag: '🇮🇳', rate: 83.12 },
};

export const detectDefaultCurrency = () => {
  const locale = navigator.language?.toLowerCase() || '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  if (locale.includes('bn') || tz.includes('Dhaka')) return 'bdt';
  if (locale.includes('en-gb') || tz.includes('London')) return 'gbp';
  if (locale.includes('de') || locale.includes('fr') || locale.includes('es-it')) return 'eur';
  if (locale.includes('hi') || locale.includes('en-in') || tz.includes('Kolkata')) return 'inr';
  return 'usd';
};

export const convertFromUsd = (usdAmount, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.usd;
  return usdAmount * currency.rate;
};

export const formatMoney = (amount, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.usd;
  const value = Number(amount);

  if (currencyCode === 'usd') {
    return `$${value.toFixed(2)}`;
  }

  if (currencyCode === 'bdt') {
    return `BDT ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${currency.symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatRate = (currencyCode) => {
  const currency = CURRENCIES[currencyCode];
  if (!currency || currencyCode === 'usd') return null;
  return `1 USD = ${currency.rate.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${currency.label}`;
};
