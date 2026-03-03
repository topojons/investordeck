import { create } from 'zustand'
import { DEFAULT_FILTERS } from '@/utils/constants'

export interface SearchFilters {
  propertyType: string
  minPrice: number
  maxPrice: number
  minSquareFeet: number
  maxSquareFeet: number
  minBedrooms: number
  maxBedrooms: number
  minBathrooms: number
  maxBathrooms: number
  city?: string
  state?: string
  radius?: number
  dealType?: string
  sortBy?: string
  [key: string]: any
}

export interface SearchResult {
  id: string
  [key: string]: any
}

interface SearchStore {
  filters: SearchFilters
  results: SearchResult[]
  loading: boolean
  error: string | null
  setFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
  setResults: (results: SearchResult[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetSearch: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: DEFAULT_FILTERS as SearchFilters,
  results: [],
  loading: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
  },

  clearFilters: () => {
    set({ filters: DEFAULT_FILTERS as SearchFilters })
  },

  setResults: (results) => {
    set({ results })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setError: (error) => {
    set({ error })
  },

  resetSearch: () => {
    set({
      filters: DEFAULT_FILTERS as SearchFilters,
      results: [],
      loading: false,
      error: null,
    })
  },
}))
