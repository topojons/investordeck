import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitCompare, MapPin, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import { getPropertyComps } from '@/services/properties'
import { formatCurrency, formatNumber } from '@/utils/formatters'

export default function CompsEngine() {
  const [propertyId, setPropertyId] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { data: comps, isLoading } = useQuery({
    queryKey: ['comps', propertyId],
    queryFn: () => getPropertyComps(propertyId),
    enabled: submitted && !!propertyId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (propertyId) {
      setSubmitted(true)
    }
  }

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
          <h2 className="text-lg font-semibold text-white">Search Property</h2>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Property ID or Address"
              placeholder="Enter property ID or MLS number"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            />
            <div className="flex items-end gap-3">
              <Button variant="primary" type="submit" fullWidth>
                Find Comps
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Results */}
      {submitted && isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" count={3} />
        </div>
      )}

      {comps && (
        <div className="space-y-6">
          {/* Subject Property */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white">Subject Property</h2>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-white mb-4">
                  {comps.property.address}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    {comps.property.city}, {comps.property.state}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-gray-400 mb-1">Bedrooms</p>
                      <p className="text-white font-semibold">
                        {comps.property.bedrooms}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Bathrooms</p>
                      <p className="text-white font-semibold">
                        {comps.property.bathrooms}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial */}
              <div>
                <h4 className="font-semibold text-white mb-4">Financial Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">List Price</p>
                    <p className="text-accent-500 font-bold text-lg">
                      {formatCurrency(comps.property.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Last Sold Price</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(comps.property.lastSoldPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Price per Sq Ft</p>
                    <p className="text-white font-semibold">
                      ${formatNumber(comps.pricePerSqft, 2)}/sqft
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div>
                <h4 className="font-semibold text-white mb-4">Market Metrics</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Avg Days on Market</p>
                    <p className="text-white font-semibold">
                      {comps.marketTrends.avgDaysOnMarket} days
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Avg Price Change</p>
                    <p className={`font-semibold ${
                      comps.marketTrends.avgPriceChange >= 0
                        ? 'text-profit-400'
                        : 'text-loss-400'
                    }`}>
                      {comps.marketTrends.avgPriceChange >= 0 ? '+' : ''}
                      {formatCurrency(comps.marketTrends.avgPriceChange)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Comparable Properties */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white">
                Comparable Properties ({comps.comps.length})
              </h2>
            }
          >
            <div className="space-y-4">
              {comps.comps.map((comp, index) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-lg bg-primary-800 border border-primary-700 hover:border-primary-600 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Info */}
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">
                        Comp #{index + 1}
                      </p>
                      <h4 className="text-white font-semibold mb-2">
                        {comp.address}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin size={14} />
                        {comp.city}, {comp.state}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="text-sm">
                      <div className="mb-2">
                        <p className="text-gray-400 text-xs mb-1">Beds / Baths</p>
                        <p className="text-white font-semibold">
                          {comp.bedrooms} / {comp.bathrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Square Feet</p>
                        <p className="text-white font-semibold">
                          {formatNumber(comp.squareFeet)}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-sm">
                      <p className="text-gray-400 text-xs mb-1">Last Sold Price</p>
                      <p className="text-accent-500 font-bold mb-2">
                        {formatCurrency(comp.lastSoldPrice)}
                      </p>
                      <p className="text-gray-400 text-xs mb-1">Price/Sq Ft</p>
                      <p className="text-white font-semibold">
                        ${formatNumber(comp.lastSoldPrice / comp.squareFeet, 2)}
                      </p>
                    </div>

                    {/* Comparison Badge */}
                    <div className="flex items-center justify-end">
                      <Badge
                        variant={
                          comp.lastSoldPrice > comps.property.price
                            ? 'error'
                            : 'success'
                        }
                      >
                        {comp.lastSoldPrice > comps.property.price ? 'Higher' : 'Lower'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis Summary */}
          <Card
            header={
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp size={20} />
                Valuation Summary
              </h2>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Subject Listing Price</p>
                <p className="text-2xl font-bold text-accent-500">
                  {formatCurrency(comps.property.price)}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Average Comp Price</p>
                <p className="text-2xl font-bold text-profit-400">
                  {formatCurrency(comps.averagePrice)}
                </p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Market Analysis</p>
                <p className={`text-2xl font-bold ${
                  comps.property.price <= comps.averagePrice
                    ? 'text-profit-400'
                    : 'text-loss-400'
                }`}>
                  {comps.property.price <= comps.averagePrice
                    ? 'Good Value'
                    : 'Premium Price'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
