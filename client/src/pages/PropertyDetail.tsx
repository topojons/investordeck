import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Calendar, DollarSign, Home, Share2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Tabs from '@/components/ui/Tabs'
import { getProperty, getPropertyHistory } from '@/services/properties'
import { formatCurrency, formatDate, formatSqft } from '@/utils/formatters'

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => id ? getProperty(id) : Promise.reject('No ID'),
    enabled: !!id,
  })

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['propertyHistory', id],
    queryFn: () => id ? getPropertyHistory(id) : Promise.reject('No ID'),
    enabled: !!id,
  })

  if (propertyLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-64" count={3} />
      </div>
    )
  }

  if (!property) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Property not found</p>
          <Button variant="secondary" onClick={() => navigate('/search')}>
            Back to Search
          </Button>
        </div>
      </Card>
    )
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Bedrooms</p>
              <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
            </div>
            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Bathrooms</p>
              <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
            </div>
            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Square Feet</p>
              <p className="text-2xl font-bold text-white">
                {(property.squareFeet / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Year Built</p>
              <p className="text-2xl font-bold text-white">{property.yearBuilt}</p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Property Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Property Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-primary-700 pb-2">
                  <span className="text-gray-400">Property Type</span>
                  <span className="text-white font-medium capitalize">
                    {property.propertyType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-primary-700 pb-2">
                  <span className="text-gray-400">Year Built</span>
                  <span className="text-white font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Sq Ft</span>
                  <span className="text-white font-medium">
                    ${(property.price / property.squareFeet).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Tax Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-primary-700 pb-2">
                  <span className="text-gray-400">Tax Assessed Value</span>
                  <span className="text-white font-medium">
                    {formatCurrency(property.taxAssessedValue)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-primary-700 pb-2">
                  <span className="text-gray-400">Annual Taxes</span>
                  <span className="text-white font-medium">
                    {formatCurrency(property.annualTaxes)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax Rate</span>
                  <span className="text-white font-medium">
                    {(
                      (property.annualTaxes / property.taxAssessedValue) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <div className="space-y-4">
          {historyLoading ? (
            <Skeleton className="h-32" count={3} />
          ) : history && history.length > 0 ? (
            history.map((event: any, index: number) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-primary-700">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{event.event}</h4>
                  <p className="text-gray-400 text-sm mb-2">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-accent-500 font-semibold">
                    {formatCurrency(event.price)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No history available</p>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-primary-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {property.address}
            </h1>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={18} />
              <span>
                {property.city}, {property.state} {property.zip}
              </span>
            </div>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Share2 size={18} />
          Share
        </Button>
      </div>

      {/* Price Section */}
      <Card className="bg-gradient-to-r from-accent-500/10 to-primary-800 border-accent-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-gray-400 text-sm mb-2">List Price</p>
            <p className="text-4xl font-bold text-accent-500">
              {formatCurrency(property.price)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Last Sold Price</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(property.lastSoldPrice)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Price per Sq Ft</p>
            <p className="text-3xl font-bold text-white">
              ${(property.price / property.squareFeet).toFixed(0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Details and History Tabs */}
      <Card header={<h2 className="text-lg font-semibold text-white">Details</h2>}>
        <Tabs tabs={tabs} />
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="primary" fullWidth size="lg">
          Run Comps Analysis
        </Button>
        <Button variant="secondary" fullWidth size="lg">
          Calculate Deal
        </Button>
        <Button variant="secondary" fullWidth size="lg">
          Save Property
        </Button>
      </div>
    </div>
  )
}
