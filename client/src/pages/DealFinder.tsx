import { useQuery } from '@tanstack/react-query'
import { Flame, TrendingUp, DollarSign, MapPin } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import { getFeaturedDeals } from '@/services/properties'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { Link } from 'react-router-dom'

export default function DealFinder() {
  const { data: deals, isLoading } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: getFeaturedDeals,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <Flame className="text-accent-500" size={32} />
          Featured Deals
        </h1>
        <p className="text-gray-400">
          Curated deals with strong profit potential
        </p>
      </div>

      {/* Deals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96" count={6} />
        </div>
      ) : deals && deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Link key={deal.id} to={`/property/${deal.property.id}`}>
              <Card hoverable className="cursor-pointer h-full flex flex-col">
                {/* Header */}
                <div className="pb-4 border-b border-primary-700 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary">{deal.dealType}</Badge>
                    <Badge variant="success" className="text-profit-400">
                      {formatPercent(25, 1)}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {deal.property.address}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={16} />
                    {deal.property.city}, {deal.property.state}
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-3 flex-1">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-primary-800 rounded-lg p-2">
                      <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                      <p className="text-lg font-bold text-white">
                        {deal.property.bedrooms}
                      </p>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-2">
                      <p className="text-xs text-gray-400 mb-1">Bathrooms</p>
                      <p className="text-lg font-bold text-white">
                        {deal.property.bathrooms}
                      </p>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-2">
                      <p className="text-xs text-gray-400 mb-1">Sq Ft</p>
                      <p className="text-lg font-bold text-white">
                        {(deal.property.squareFeet / 1000).toFixed(1)}K
                      </p>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="space-y-2 pt-3 border-t border-primary-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Purchase Price</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(deal.property.price)}
                      </span>
                    </div>
                    {deal.estimatedAfterRepairValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">After Repair Value</span>
                        <span className="font-semibold text-profit-400">
                          {formatCurrency(deal.estimatedAfterRepairValue)}
                        </span>
                      </div>
                    )}
                    {deal.estimatedRepairCosts && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Repair Costs</span>
                        <span className="font-semibold text-yellow-400">
                          {formatCurrency(deal.estimatedRepairCosts)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-primary-700 mt-2">
                      <span className="text-gray-300 text-sm font-medium">Potential Profit</span>
                      <span className="text-xl font-bold text-profit-400 flex items-center gap-1">
                        <TrendingUp size={18} />
                        {formatCurrency(deal.potentialProfit)}
                      </span>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  {(deal.capRate || deal.cashOnCashReturn) && (
                    <div className="space-y-2 pt-3 border-t border-primary-700 text-sm">
                      {deal.capRate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cap Rate</span>
                          <span className="text-white font-semibold">
                            {formatPercent(deal.capRate, 2)}
                          </span>
                        </div>
                      )}
                      {deal.cashOnCashReturn && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cash on Cash Return</span>
                          <span className="text-white font-semibold">
                            {formatPercent(deal.cashOnCashReturn, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-primary-700">
                  <Button variant="secondary" fullWidth size="sm">
                    Analyze Deal
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Flame size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg mb-4">No featured deals available</p>
            <p className="text-gray-500 text-sm mb-6">
              Check back soon for new investment opportunities
            </p>
            <Link to="/search">
              <Button variant="primary">Search Properties</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
