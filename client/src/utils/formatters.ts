import { format, parseISO, isValid } from 'date-fns'

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyDetailed(
  value: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(
  value: number,
  decimals: number = 1,
  includeSymbol: boolean = true
): string {
  const formatted = value.toFixed(decimals)
  return includeSymbol ? `${formatted}%` : formatted
}

export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDate(
  date: Date | string,
  formatStr: string = 'MMM d, yyyy'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return format(dateObj, formatStr)
  } catch {
    return 'Invalid date'
  }
}

export function formatSqft(value: number): string {
  return value.toLocaleString('en-US') + ' sq ft'
}

export function abbreviateNumber(value: number): string {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B'
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M'
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K'
  }
  return value.toString()
}

export function formatROI(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatCapRate(value: number): string {
  return `${value.toFixed(2)}%`
}

export function formatMonthly(value: number): string {
  return `$${(value / 12).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}/mo`
}
