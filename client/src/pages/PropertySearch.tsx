import { useState } from 'react'
import { Search, MapPin, Home } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import apiClient from '@/services/api'
import { useSearchStore } from '@/store/searchStore'
import { PROPERTY_TYPES, STATES } from '@/utils/constants'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import { Link } from 'react-router-dom'

interface SearchResult {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  type: string
  imageUrl: string
  description: string
}

export default function PropertySearch() {
  const { filters, setFilters } = useSearchStore()
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSearched(true)

    try {
      const params: Record<string, string> = {}
      if (filters.city) params.city = filters.city
      if (filters.state) params.state = filters.state
      if (filters.minPrice && filters.minPrice > 0) params.minPrice = String(filters.minPrice)
      if (filters.maxPrice && filters.maxPrice < 1000000) params.maxPrice = String(filters.maxPrice)
      if (filters.minBedrooms && filters.minBedrooms > 0) params.beds = String(filters.minBedrooms)
      if (filters.minBathrooms && filters.minBathrooms > 0) params.baths = String(filters.minBathrooms)

      const response = await apiClient.get('/properties/search', { params })

      if (response.data.success) {
        setResults(response.data.data.properties)
        setTotal(response.data.data.pagination.total)
      } else {
        setResults([])
        setTotal(0)
      }
    } catch (err: any) {
      setError('Failed to search properties. Please try again.')
      setResults([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      propertyType: '',
      minPrice: 0,
      maxPrice: 1000000,
      minSquareFeet: 0,
      city: '',
      state: '',
    })
    setSearched(false)
    setResults([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search size={20} />
            Search Filters
          </h2>
        }
      >
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="e.g., Atlanta, Phoenix, Dallas..."
              value={filters.city || ''}
              onChange={(e) => setFilters({ city: e.target.value })}
            />
            <Select
              label="State"
              options={STATES}
              placeholder="Select state"
              value={filters.state || ''}
              onChange={(e) => setFilters({ state: e.target.value })}
            />
            <Input
              label="Radius (miles)"
              type="number"
              placeholder="25"
              value={filters.radius || 25}
              onChange={(e) => setFilters({ radius: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Price"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) })}
            />
            <Input
              label="Max Price"
              type="number"
              placeholder="1000000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Square Feet"
              type="number"
              placeholder="0"
              value={filters.minSquareFeet}
              onChange={(e) => setFilters({ minSquareFeet: parseInt(e.target.value) })}
            />
            <Input
              label="Max Square Feet"
              type="number"
              placeholder="100000"
              value={filters.maxSquareFeet}
              onChange={(e) => setFilters({ maxSquareFeet: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Min Beds"
              type="number"
              placeholder="0"
              value={filters.minBedrooms}
              onChange={(e) => setFilters({ minBedrooms: parseInt(e.target.value) })}
            />
            <Input
              label="Max Beds"
              type="number"
              placeholder="10"
              value={filters.maxBedrooms}
              onChange={(e) => setFilters({ maxBedrooms: parseInt(e.target.value) })}
            />
            <Input
              label="Min Baths"
              type="number"
              placeholder="0"
              onChange={(e) => setFilters({ minBathrooms: parseInt(e.target.value) })}
            />
            <Input
              label="Max Baths"
              type="number"
              placeholder="10"
              onChange={(e) => setFilters({ maxBathrooms: parseInt(e.target.value) })}
            />
          </div>

          <Select
            label="Property Type"
            options={PROPERTY_TYPES}
            placeholder="All types"
            value={filters.propertyType || ''}
            onChange={(e) => setFilters({ propertyType: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" fullWidth loading={isLoading}>
              Search Properties
            </Button>
            <Button variant="secondary" type="button" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {isLoading ? 'Searching...' : `Found ${total} properties`}
          </h2>

          {error && (
            <Card>
              <p className="text-center text-loss-400 py-4">{error}</p>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((property) => (
                <Link key={property.id} to={`/property/${encodeURIComponent(property.id)}`}>
                  <Card hoverable className="cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <img
                          src={property.imageUrl}
                          alt={property.address}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Main Info */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {property.address}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                          <MapPin size={16} />
                          <span className="text-sm">
                            {property.city}, {property.state} {property.zip}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="primary">{property.beds} Bed</Badge>
                          <Badge variant="primary">{property.baths} Bath</Badge>
                          <Badge variant="primary">{formatNumber(property.sqft)} sqft</Badge>
                          <Badge variant="info">{property.type}</Badge>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="md:col-span-2">
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">List Price</p>
                            <p className="text-2xl font-bold text-accent-500">
                              {formatCurrency(property.price)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="text-gray-400">$/Sq Ft</p>
                              <p className="text-white font-semibold">
                                {property.sqft > 0 ? `$${Math.round(property.price / property.sqft)}` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Year Built</p>
                              <p className="text-white font-semibold">
                                {property.yearBuilt || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <Home size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">No properties found matching your criteria</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try searching for: Atlanta, Phoenix, Dallas, Orlando, Memphis, Austin, or other major US cities
                </p>
                <Button variant="secondary" onClick={handleReset}>
                  Try Different Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
