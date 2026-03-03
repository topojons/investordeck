import apiClient from './api'

export interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  yearBuilt: number
  lastSoldDate: string
  lastSoldPrice: number
  taxAssessedValue: number
  annualTaxes: number
  listingDate?: string
  daysOnMarket?: number
  photos?: string[]
  description?: string
}

export interface PropertyComps {
  property: Property
  comps: Property[]
  averagePrice: number
  pricePerSqft: number
  marketTrends: {
    avgDaysOnMarket: number
    avgPriceChange: number
  }
}

export interface FeaturedDeal {
  id: string
  property: Property
  dealType: string
  estimatedAfterRepairValue: number
  estimatedRepairCosts: number
  potentialProfit: number
  capRate?: number
  cashOnCashReturn?: number
}

export async function searchProperties(filters: Record<string, any>) {
  const response = await apiClient.get('/properties/search', {
    params: filters,
  })
  return response.data
}

export async function getProperty(id: string) {
  const response = await apiClient.get(`/properties/${id}`)
  return response.data as Property
}

export async function getPropertyComps(id: string) {
  const response = await apiClient.get(`/properties/${id}/comps`)
  return response.data as PropertyComps
}

export async function getFeaturedDeals() {
  const response = await apiClient.get('/properties/featured-deals')
  return response.data as FeaturedDeal[]
}

export async function getPropertyHistory(id: string) {
  const response = await apiClient.get(`/properties/${id}/history`)
  return response.data
}

export async function getPropertyTaxInfo(id: string) {
  const response = await apiClient.get(`/properties/${id}/tax-info`)
  return response.data
}
