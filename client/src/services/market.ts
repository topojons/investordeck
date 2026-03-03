import apiClient from './api'

export interface MarketData {
  city: string
  state: string
  medianPrice: number
  averagePrice: number
  pricePerSqft: number
  daysOnMarket: number
  priceChange: number
  priceChangePercent: number
  soldListings: number
  activeListings: number
  priceHistory: {
    date: string
    price: number
  }[]
}

export interface MarketComparison {
  markets: MarketData[]
  trends: {
    appreciation: number
    priceVolatility: number
    demandLevel: string
  }
}

export interface MortgageRates {
  rate30Year: number
  rate15Year: number
  rate7Year: number
  rate5Year: number
  timestamp: string
  source: string
}

export interface MarketTrends {
  region: string
  inventory: number
  avgDaysOnMarket: number
  priceChange: number
  forecastedAppreciation: number
  rentalDemand: string
}

export async function getMarketData(
  city: string,
  state: string
): Promise<MarketData> {
  const response = await apiClient.get('/market/data', {
    params: { city, state },
  })
  return response.data
}

export async function compareMarkets(
  markets: Array<{ city: string; state: string }>
): Promise<MarketComparison> {
  const response = await apiClient.post('/market/compare', { markets })
  return response.data
}

export async function getMortgageRates(): Promise<MortgageRates> {
  const response = await apiClient.get('/market/mortgage-rates')
  return response.data
}

export async function getMarketTrends(state: string): Promise<MarketTrends[]> {
  const response = await apiClient.get('/market/trends', {
    params: { state },
  })
  return response.data
}

export async function getMarketForecast(
  city: string,
  state: string,
  years: number = 5
): Promise<any> {
  const response = await apiClient.get('/market/forecast', {
    params: { city, state, years },
  })
  return response.data
}
