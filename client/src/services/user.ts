import apiClient from './api'
import { Property } from './properties'

export interface SavedProperty {
  id: string
  userId: string
  propertyId: string
  property: Property
  notes: string
  savedAt: string
  tags: string[]
  status: string
}

export interface SavedSearch {
  id: string
  userId: string
  name: string
  filters: Record<string, any>
  createdAt: string
  lastRun: string
}

export interface DealAnalysis {
  id: string
  userId: string
  propertyId: string
  dealType: string
  purchasePrice: number
  estimatedAfterRepairValue?: number
  estimatedRepairCosts?: number
  analysis: Record<string, any>
  notes: string
  createdAt: string
  updatedAt: string
}

export async function getSavedProperties(): Promise<SavedProperty[]> {
  const response = await apiClient.get('/user/saved-properties')
  return response.data
}

export async function saveProperty(
  propertyId: string,
  notes: string = '',
  tags: string[] = []
): Promise<SavedProperty> {
  const response = await apiClient.post('/user/saved-properties', {
    propertyId,
    notes,
    tags,
  })
  return response.data
}

export async function updateSavedProperty(
  id: string,
  data: Partial<SavedProperty>
): Promise<SavedProperty> {
  const response = await apiClient.put(`/user/saved-properties/${id}`, data)
  return response.data
}

export async function deleteSavedProperty(id: string): Promise<void> {
  await apiClient.delete(`/user/saved-properties/${id}`)
}

export async function getSavedSearches(): Promise<SavedSearch[]> {
  const response = await apiClient.get('/user/saved-searches')
  return response.data
}

export async function saveSearch(
  name: string,
  filters: Record<string, any>
): Promise<SavedSearch> {
  const response = await apiClient.post('/user/saved-searches', {
    name,
    filters,
  })
  return response.data
}

export async function deleteSearch(id: string): Promise<void> {
  await apiClient.delete(`/user/saved-searches/${id}`)
}

export async function getDealAnalyses(): Promise<DealAnalysis[]> {
  const response = await apiClient.get('/user/deal-analyses')
  return response.data
}

export async function saveDealAnalysis(
  data: Partial<DealAnalysis>
): Promise<DealAnalysis> {
  const response = await apiClient.post('/user/deal-analyses', data)
  return response.data
}

export async function updateDealAnalysis(
  id: string,
  data: Partial<DealAnalysis>
): Promise<DealAnalysis> {
  const response = await apiClient.put(`/user/deal-analyses/${id}`, data)
  return response.data
}

export async function deleteDealAnalysis(id: string): Promise<void> {
  await apiClient.delete(`/user/deal-analyses/${id}`)
}
