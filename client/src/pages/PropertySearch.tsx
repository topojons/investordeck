import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MapPin, Home, DollarSign } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import { searchProperties } from '@/services/properties'
import { useSearchStore } from '@/store/searchStore'
import { PROPERTY_TYPES, STATES } from '@/utils/constants'
import { formatCurrency, formatSqft } from '@/utils/formatters'
import { Link } from 'react-router-dom'

export default function PropertySearch() {
  const { filters, setFilters } = useSearchStore()
  const [submitted, setSubmitted] = useState(false)

  const { data: results, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => searchProperties(filters),
    enabled: submitted,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
    setSubmitted(false)
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
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="Enter city name"
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

          {/* Price Range */}
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

          {/* Size */}
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

          {/* Bedrooms and Bathrooms */}
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

          {/* Property Type */}
          <Select
            label="Property Type"
            options={PROPERTY_TYPES}
            placeholder="All types"
            value={filters.propertyType || ''}
            onChange={(e) => setFilters({ propertyType: e.target.value })}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" fullWidth>
              Search Properties
            </Button>
            <Button variant="secondary" type="button" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {submitted && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {isLoading ? 'Loading results...' : `Found ${results?.length || 0} properties`}
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32" count={5} />
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((property: any) => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <Card hoverable className="cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Main Info */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {property.address}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                          <MapPin size={16} />
                          <span className="text-sm">
                            {property.city}, {property.state} {property.zip}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Badge variant="primary" size="sm">
                              {property.bedrooms} Bed
                            </Badge>
                            <Badge variant="primary" size="sm">
                              {property.bathrooms} Bath
                            </Badge>
                            <Badge variant="primary" size="sm">
                              {formatSqft(property.squareFeet)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="md:col-span-2">
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">List Price</p>
                            <p className="text-2xl font-bold text-accent-500">
                              {formatCurrency(property.price)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="text-gray-400">Price/Sq Ft</p>
                              <p className="text-white font-semibold">
                                ${(property.price / property.squareFeet).toFixed(0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Year Built</p>
                              <p className="text-white font-semibold">{property.yearBuilt}</p>
                            </div>
                          </div>
                          <Button variant="secondary" size="sm" fullWidth>
                            View Details
                          </Button>
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
                <Home size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">No properties found matching your criteria</p>
                <Button variant="secondary" className="mt-4" onClick={handleReset}>
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
