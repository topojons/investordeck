import { useQuery } from '@tanstack/react-query'
import { Kanban, MapPin, DollarSign, Archive } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Tabs from '@/components/ui/Tabs'
import { getSavedProperties } from '@/services/user'
import { formatCurrency } from '@/utils/formatters'
import { Link } from 'react-router-dom'

const PIPELINE_STAGES = [
  { id: 'lead', label: 'Lead', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'negotiating', label: 'Negotiating', color: 'bg-yellow-500' },
  { id: 'under-contract', label: 'Under Contract', color: 'bg-orange-500' },
  { id: 'closed', label: 'Closed', color: 'bg-profit-500' },
]

export default function SavedDeals() {
  const { data: savedProperties = [], isLoading } = useQuery({
    queryKey: ['savedProperties'],
    queryFn: getSavedProperties,
  })

  // Group properties by status
  const groupedByStatus = savedProperties.reduce(
    (acc: Record<string, any[]>, prop) => {
      const status = prop.status || 'lead'
      if (!acc[status]) acc[status] = []
      acc[status].push(prop)
      return acc
    },
    {}
  )

  const tabs = PIPELINE_STAGES.map((stage) => ({
    id: stage.id,
    label: `${stage.label} (${groupedByStatus[stage.id]?.length || 0})`,
    content: (
      <div className="grid gap-4">
        {isLoading ? (
          <Skeleton className="h-32" count={3} />
        ) : groupedByStatus[stage.id]?.length > 0 ? (
          groupedByStatus[stage.id].map((prop) => (
            <Link key={prop.id} to={`/property/${prop.propertyId}`}>
              <Card hoverable className="cursor-pointer">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      {prop.property.address}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={16} />
                      {prop.property.city}, {prop.property.state}
                    </div>
                    {prop.tags && prop.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {prop.tags.map((tag: string) => (
                          <Badge key={tag} variant="primary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="text-sm">
                    <p className="text-gray-400 mb-1">Beds / Baths</p>
                    <p className="text-white font-semibold mb-3">
                      {prop.property.bedrooms} / {prop.property.bathrooms}
                    </p>
                    <p className="text-gray-400 mb-1">Square Feet</p>
                    <p className="text-white font-semibold">
                      {(prop.property.squareFeet / 1000).toFixed(1)}K
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-sm">
                    <p className="text-gray-400 mb-1">List Price</p>
                    <p className="text-accent-500 font-bold mb-3">
                      {formatCurrency(prop.property.price)}
                    </p>
                    <p className="text-gray-400 mb-1">Price/Sq Ft</p>
                    <p className="text-white font-semibold">
                      ${(prop.property.price / prop.property.squareFeet).toFixed(0)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm" fullWidth>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth>
                      Edit Notes
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {prop.notes && (
                  <div className="mt-4 pt-4 border-t border-primary-700">
                    <p className="text-sm text-gray-400">Notes:</p>
                    <p className="text-gray-300 text-sm mt-1">{prop.notes}</p>
                  </div>
                )}
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <Archive size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400">No properties in this stage</p>
          </div>
        )}
      </div>
    ),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <Kanban className="text-accent-500" size={32} />
          My Pipeline
        </h1>
        <p className="text-gray-400">
          Track your deals from lead to closed
        </p>
      </div>

      {/* Pipeline Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {PIPELINE_STAGES.map((stage) => (
          <Card key={stage.id} hoverable>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">{stage.label}</p>
              <p className="text-3xl font-bold text-white">
                {groupedByStatus[stage.id]?.length || 0}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Pipeline Tabs */}
      <Card>
        {tabs.length > 0 ? (
          <Tabs tabs={tabs} defaultTab="lead" />
        ) : (
          <div className="text-center py-12">
            <Archive size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 mb-4">No saved properties yet</p>
            <Link to="/search">
              <Button variant="primary">Search Properties</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white">Pipeline Summary</h2>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Properties</p>
            <p className="text-2xl font-bold text-white">
              {savedProperties.length}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Investment</p>
            <p className="text-2xl font-bold text-accent-500">
              {formatCurrency(
                savedProperties.reduce(
                  (sum, prop) => sum + prop.property.price,
                  0
                )
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Closed Deals</p>
            <p className="text-2xl font-bold text-profit-400">
              {groupedByStatus['closed']?.length || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
