import { Calculator } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'

const calculators = [
  {
    id: 'flip',
    title: 'Fix & Flip Calculator',
    description: 'Calculate profit potential for fix & flip deals',
    icon: '🔧',
    metrics: ['Gross Profit', 'ROI', 'Timeline'],
  },
  {
    id: 'rental',
    title: 'Rental Analysis Calculator',
    description: 'Analyze long-term buy & hold rental properties',
    icon: '🏠',
    metrics: ['Cap Rate', 'Cash Flow', 'CoC Return'],
  },
  {
    id: 'wholesale',
    title: 'Wholesale Calculator',
    description: 'Find assignment fees and wholesale profits',
    icon: '💰',
    metrics: ['Assignment Fee', 'End Buyer Price'],
  },
  {
    id: 'brrrr',
    title: 'BRRRR Calculator',
    description: 'Analyze buy, rehab, rent, refinance, repeat deals',
    icon: '🔄',
    metrics: ['Refinance Amount', 'Cash Flow', 'ROI'],
  },
  {
    id: 'mortgage',
    title: 'Mortgage Comparison',
    description: 'Compare different loan options side by side',
    icon: '📊',
    metrics: ['Monthly Payment', 'Total Interest', 'Breakeven'],
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate return on investment for any deal',
    icon: '📈',
    metrics: ['Total ROI', 'Annual Return', 'Payback Period'],
  },
]

export default function CalculatorSuite() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <Calculator className="text-accent-500" size={32} />
          Deal Calculators
        </h1>
        <p className="text-gray-400">
          Advanced tools to analyze and evaluate real estate investments
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link key={calc.id} to={`/calculators/${calc.id}`}>
            <Card hoverable className="cursor-pointer h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{calc.icon}</div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {calc.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 flex-1">
                {calc.description}
              </p>

              {/* Metrics */}
              <div className="mb-6 pt-4 border-t border-primary-700">
                <p className="text-xs text-gray-500 mb-2 font-medium">Key Metrics:</p>
                <div className="flex flex-wrap gap-2">
                  {calc.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="inline-block text-xs px-2 py-1 rounded bg-primary-800 text-gray-300"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>

              {/* Button */}
              <Button variant="secondary" fullWidth size="sm">
                Open Calculator
              </Button>
            </Card>
          </Link>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-accent-500/10 to-primary-800 border-accent-500/30">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Need Help Choosing?
          </h3>
          <p className="text-gray-400 mb-4">
            Use our calculators to evaluate different deal types and find the best
            strategy for your investment goals.
          </p>
          <p className="text-sm text-accent-400 font-medium">
            Each calculator provides detailed analysis and actionable insights
          </p>
        </div>
      </Card>
    </div>
  )
}
