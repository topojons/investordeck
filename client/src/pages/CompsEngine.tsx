import { useState } from 'react'
import { GitCompare, MapPin, TrendingUp, Search, Home } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import apiClient from '@/services/api'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface CompProperty {
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

interface Comp {
  id: string
  address: string
  soldPrice: number
  soldDate: string
  beds: number
  baths: number
  sqft: number
  distance: number
  imageUrl: string
}

interface CompsResponse {
  success: boolean
  data: {
    property: CompProperty
    comps: Comp[]
    statistics: {
      avgPrice: number
      minPrice: number
      maxPrice: number
      pricePerSqft: number
      count: number
    }
  }
}

export default function CompsEngine() {
  const [searchQuery, setSearchQuery] = useState('')
  const [compsData, setCompsData] = useState<CompsResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)
    setCompsData(null)

    try {
      const response = await apiClient.get<CompsResponse>(
        `/properties/${encodeURIComponent(searchQuery.trim())}/comps`
      )
      if (response.data.success) {
        setCompsData(response.data.data)
      } else {
        setError('No property found matching your search.')
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No property found. Try searching by city name (e.g., "Atlanta", "Phoenix") or an address from our database.')
      } else {
        setError('Failed to fetch comps. Make sure the backend is running.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sampleSearches = ['Atlanta', 'Phoenix', 'Dallas', 'Orlando', 'Memphis', 'Austin']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <GitCompare className="text-accent-500" size={32} />
          Comps Analysis Engine
        </h1>
        <p className="text-gray-400">
          Analyze comparable sales to determine fair market value
        </p>
      </div>

      {/* Search Form */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search size={18} />
            Search Property
          </h2>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                label="Address, City, or ZIP Code"
                placeholder="e.g., Atlanta, Phoenix, 1452 Peachtree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" type="submit" loading={isLoading}>
                Find Comps
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm">Try:</span>
            {sampleSearches.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setSearchQuery(s); }}
                className="text-sm px-3 py-1 rounded-full bg-primary-700 text-accent-500 hover:bg-primary-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </Card>

      {/* Error */}
      {error && (
        <Card>
          <div className="text-center py-8">
            <Home className="mx-auto text-gray-500 mb-3" size={48} />
            <p className="text-gray-400 mb-2">{error}</p>
            <p className="text-gray-500 text-sm">
              Available cities: Atlanta, Phoenix, Orlando, Dallas, Memphis, Austin, Jacksonville, Charlotte, Las Vegas, Denver, Portland, Indianapolis, Columbus
            </p>
          </div>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      )}

      {/* Results */}
      {compsData && (
        <div className="space-y-6">
          {/* Subject Property */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Home size={18} />
                Subject Property
              </h2>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <img
                  src={compsData.property.imageUrl}
                  alt={compsData.property.address}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {compsData.property.address}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <MapPin size={16} />
                    {compsData.property.city}, {compsData.property.state} {compsData.property.zip}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Beds</p>
                      <p className="text-white font-semibold">{compsData.property.beds}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Baths</p>
                      <p className="text-white font-semibold">{compsData.property.baths}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Sq Ft</p>
                      <p className="text-white font-semibold">{formatNumber(compsData.property.sqft)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Year Built</p>
                      <p className="text-white font-semibold">{compsData.property.yearBuilt}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">List Price</p>
                  <p className="text-accent-500 font-bold text-2xl mb-4">
                    {formatCurrency(compsData.property.price)}
                  </p>
                  <p className="text-gray-400 text-sm mb-1">Property Type</p>
                  <p className="text-white font-semibold">{compsData.property.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Price per Sq Ft</p>
                  <p className="text-white font-bold text-xl mb-4">
                    {formatCurrency(Math.round(compsData.property.price / compsData.property.sqft))}/sqft
                  </p>
                  <p className="text-gray-400 text-sm mb-1">{compsData.property.description}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Valuation Summary */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp size={20} />
                Valuation Summary
              </h2>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Subject Price</p>
                <p className="text-xl font-bold text-accent-500">
                  {formatCurrency(compsData.property.price)}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Avg Comp Price</p>
                <p className="text-xl font-bold text-profit-400">
                  {formatCurrency(compsData.statistics.avgPrice)}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Price Range</p>
                <p className="text-white font-bold text-sm">
                  {formatCurrency(compsData.statistics.minPrice)} – {formatCurrency(compsData.statistics.maxPrice)}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Avg $/Sq Ft</p>
                <p className="text-xl font-bold text-white">
                  ${compsData.statistics.pricePerSqft}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Verdict</p>
                <p className={`text-xl font-bold ${
                  compsData.property.price <= compsData.statistics.avgPrice
                    ? 'text-profit-400'
                    : 'text-loss-400'
                }`}>
                  {compsData.property.price <= compsData.statistics.avgPrice
                    ? 'Good Value'
                    : 'Above Market'}
                </p>
              </div>
            </div>
          </Card>

          {/* Comparable Properties */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white">
                Comparable Sales ({compsData.comps.length} properties)
              </h2>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary-700">
                    <th className="text-left text-gray-400 font-medium py-3 px-2">Address</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-2">Sale Price</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-2">Sale Date</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-2">Beds/Baths</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-2">Sq Ft</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-2">$/Sq Ft</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-2">Distance</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-2">vs Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {compsData.comps.map((comp) => {
                    const priceDiff = comp.soldPrice - compsData.property.price
                    const pricePerSqft = Math.round(comp.soldPrice / comp.sqft)
                    return (
                      <tr
                        key={comp.id}
                        className="border-b border-primary-800 hover:bg-primary-800/50 transition-colors"
                      >
                        <td className="py-3 px-2 text-white font-medium">{comp.address}</td>
                        <td className="py-3 px-2 text-right text-accent-500 font-semibold">
                          {formatCurrency(comp.soldPrice)}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-400">{comp.soldDate}</td>
                        <td className="py-3 px-2 text-center text-white">{comp.beds}/{comp.baths}</td>
                        <td className="py-3 px-2 text-right text-white">{formatNumber(comp.sqft)}</td>
                        <td className="py-3 px-2 text-right text-white">${pricePerSqft}</td>
                        <td className="py-3 px-2 text-right text-gray-400">{comp.distance} mi</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant={priceDiff > 0 ? 'error' : 'success'}>
                            {priceDiff > 0 ? '+' : ''}{formatCurrency(priceDiff)}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!compsData && !isLoading && !error && (
        <Card>
          <div className="text-center py-12">
            <GitCompare className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">Search for a Property</h3>
            <p className="text-gray-400 mb-6">
              Enter an address, city, or ZIP code to find comparable sales in the area.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSearchQuery(s); }}
                  className="px-4 py-2 rounded-lg bg-primary-700 text-accent-500 hover:bg-primary-600 transition-colors text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
