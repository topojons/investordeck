import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Home, BarChart3, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import { getFeaturedDeals } from '@/services/properties'
import { getMortgageRates } from '@/services/market'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatPercent, abbreviateNumber } from '@/utils/formatters'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

// Mock data for trends
const mockTrendData = [
  { month: 'Jan', value: 4.5 },
  { month: 'Feb', value: 4.6 },
  { month: 'Mar', value: 4.7 },
  { month: 'Apr', value: 4.65 },
  { month: 'May', value: 4.8 },
  { month: 'Jun', value: 4.75 },
]

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const { data: featuredDeals, isLoading: dealsLoading } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: getFeaturedDeals,
  })

  const { data: mortgageRates, isLoading: ratesLoading } = useQuery({
    queryKey: ['mortgageRates'],
    queryFn: getMortgageRates,
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Investor'}
        </h1>
        <p className="text-gray-400">
          Track your deals and market insights in real-time
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Deals Card */}
        <Card hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Deals</p>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-profit-400 mt-2">+2 this month</p>
            </div>
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <BarChart3 size={24} className="text-accent-500" />
            </div>
          </div>
        </Card>

        {/* Saved Properties Card */}
        <Card hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Saved Properties</p>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-xs text-profit-400 mt-2">Avg: {formatCurrency(325000)}</p>
            </div>
            <div className="p-3 bg-profit-500/20 rounded-lg">
              <Home size={24} className="text-profit-400" />
            </div>
          </div>
        </Card>

        {/* Recent Analyses Card */}
        <Card hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Analyses</p>
              <p className="text-2xl font-bold text-white">15</p>
              <p className="text-xs text-blue-400 mt-2">Last 30 days</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Market Alerts Card */}
        <Card hoverable>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Market Alerts</p>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-yellow-400 mt-2">Unread</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertCircle size={24} className="text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Deals and Market Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Deals */}
        <div className="lg:col-span-2">
          <Card
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Featured Deals</h2>
                <Link to="/deals">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            }
          >
            {dealsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20" count={3} />
              </div>
            ) : (
              <div className="space-y-3">
                {featuredDeals?.slice(0, 3).map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {deal.property.address}
                      </p>
                      <p className="text-sm text-gray-400">
                        {deal.property.city}, {deal.property.state}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="primary" size="sm">
                          {deal.dealType}
                        </Badge>
                        <Badge variant="success" size="sm">
                          {formatCurrency(deal.potentialProfit)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent-500">
                        {formatCurrency(deal.property.price)}
                      </p>
                      <p className="text-xs text-gray-400">List Price</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Mortgage Rates */}
        <Card
          header={
            <h2 className="text-lg font-semibold text-white">Current Rates</h2>
          }
        >
          {ratesLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary-800">
                <span className="text-sm text-gray-300">30-Year Fixed</span>
                <span className="font-bold text-accent-500">
                  {formatPercent(mortgageRates?.rate30Year || 6.8, 2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary-800">
                <span className="text-sm text-gray-300">15-Year Fixed</span>
                <span className="font-bold text-accent-500">
                  {formatPercent(mortgageRates?.rate15Year || 6.2, 2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary-800">
                <span className="text-sm text-gray-300">7/1 ARM</span>
                <span className="font-bold text-accent-500">
                  {formatPercent(mortgageRates?.rate7Year || 5.9, 2)}
                </span>
              </div>
              <Link to="/market">
                <Button variant="secondary" size="sm" fullWidth className="mt-4">
                  View Full Rates
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Market Trends */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white">Market Trends</h2>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockTrendData}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a2332',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorTrend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <Card header={<h2 className="text-lg font-semibold text-white">Quick Actions</h2>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link to="/search">
            <Button variant="primary" fullWidth>
              Search Properties
            </Button>
          </Link>
          <Link to="/comps">
            <Button variant="primary" fullWidth>
              Run Comps Analysis
            </Button>
          </Link>
          <Link to="/calculators">
            <Button variant="primary" fullWidth>
              Calculate Deal
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
