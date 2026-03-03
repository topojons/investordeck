import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, MapPin } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Skeleton from '@/components/ui/Skeleton'
import { getMarketData, getMortgageRates } from '@/services/market'
import { STATES } from '@/utils/constants'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const mockMarketTrends = [
  { month: 'Jan', medianPrice: 425000, avgDaysOnMarket: 35 },
  { month: 'Feb', medianPrice: 432000, avgDaysOnMarket: 33 },
  { month: 'Mar', medianPrice: 441000, avgDaysOnMarket: 31 },
  { month: 'Apr', medianPrice: 438000, avgDaysOnMarket: 32 },
  { month: 'May', medianPrice: 450000, avgDaysOnMarket: 29 },
  { month: 'Jun', medianPrice: 458000, avgDaysOnMarket: 28 },
]

export default function MarketAnalysis() {
  const [city, setCity] = useState('Miami')
  const [state, setState] = useState('FL')
  const [submitted, setSubmitted] = useState(true)

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketData', city, state],
    queryFn: () => getMarketData(city, state),
    enabled: submitted && !!city && !!state,
  })

  const { data: rates, isLoading: ratesLoading } = useQuery({
    queryKey: ['mortgageRates'],
    queryFn: getMortgageRates,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <BarChart3 className="text-accent-500" size={32} />
          Market Analysis
        </h1>
        <p className="text-gray-400">
          Real-time market data and investment insights
        </p>
      </div>

      {/* Search Form */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white">Select Market</h2>
        }
      >
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Select
            options={STATES}
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
          <Button variant="primary" type="submit">
            Search
          </Button>
        </form>
      </Card>

      {/* Market Overview */}
      {marketLoading ? (
        <Skeleton className="h-32" />
      ) : marketData ? (
        <Card
          header={
            <h2 className="text-lg font-semibold text-white">
              Market Overview - {marketData.city}, {marketData.state}
            </h2>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Median Price</p>
              <p className="text-2xl font-bold text-accent-500">
                {formatCurrency(marketData.medianPrice)}
              </p>
              <p className="text-xs text-profit-400 mt-2">
                {marketData.priceChange >= 0 ? '+' : ''}
                {formatPercent(marketData.priceChangePercent, 1)}
              </p>
            </div>

            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Price per Sq Ft</p>
              <p className="text-2xl font-bold text-white">
                ${formatNumber(marketData.pricePerSqft, 0)}
              </p>
              <p className="text-xs text-gray-400 mt-2">Average</p>
            </div>

            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Days on Market</p>
              <p className="text-2xl font-bold text-white">
                {marketData.daysOnMarket}
              </p>
              <p className="text-xs text-gray-400 mt-2">Average</p>
            </div>

            <div className="bg-primary-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Active Listings</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(marketData.activeListings)}
              </p>
              <p className="text-xs text-gray-400 mt-2">Current</p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Price Trends */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp size={20} />
            Market Trends (6 Months)
          </h2>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockMarketTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a2332',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="medianPrice"
              stroke="#f59e0b"
              name="Median Price"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgDaysOnMarket"
              stroke="#10b981"
              name="Avg Days on Market"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Mortgage Rates */}
      {ratesLoading ? (
        <Skeleton className="h-64" />
      ) : rates ? (
        <Card
          header={
            <h2 className="text-lg font-semibold text-white">Current Mortgage Rates</h2>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-primary-800 rounded-lg">
                <span className="text-gray-300 font-medium">30-Year Fixed</span>
                <span className="text-2xl font-bold text-accent-500">
                  {formatPercent(rates.rate30Year, 2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary-800 rounded-lg">
                <span className="text-gray-300 font-medium">15-Year Fixed</span>
                <span className="text-2xl font-bold text-accent-500">
                  {formatPercent(rates.rate15Year, 2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-primary-800 rounded-lg">
                <span className="text-gray-300 font-medium">7/1 ARM</span>
                <span className="text-2xl font-bold text-accent-500">
                  {formatPercent(rates.rate7Year, 2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary-800 rounded-lg">
                <span className="text-gray-300 font-medium">5/1 ARM</span>
                <span className="text-2xl font-bold text-accent-500">
                  {formatPercent(rates.rate5Year, 2)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Last updated: {new Date(rates.timestamp).toLocaleDateString()}
          </p>
        </Card>
      ) : null}

      {/* Market Comparison */}
      <Card
        header={
          <h2 className="text-lg font-semibold text-white">Comparable Markets</h2>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  City
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Median Price
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Avg Days
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Price Change
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Demand
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  city: 'Miami',
                  state: 'FL',
                  price: 458000,
                  days: 28,
                  change: 5.2,
                },
                {
                  city: 'Austin',
                  state: 'TX',
                  price: 512000,
                  days: 26,
                  change: 8.1,
                },
                {
                  city: 'Denver',
                  state: 'CO',
                  price: 492000,
                  days: 31,
                  change: 3.8,
                },
              ].map((market) => (
                <tr
                  key={`${market.city}-${market.state}`}
                  className="border-b border-primary-700 hover:bg-primary-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-white font-medium">
                    {market.city}, {market.state}
                  </td>
                  <td className="text-right py-3 px-4 text-accent-500 font-semibold">
                    {formatCurrency(market.price)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    {market.days} days
                  </td>
                  <td className={`text-right py-3 px-4 font-semibold ${
                    market.change >= 0 ? 'text-profit-400' : 'text-loss-400'
                  }`}>
                    {market.change >= 0 ? '+' : ''}
                    {formatPercent(market.change, 1)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    High
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
