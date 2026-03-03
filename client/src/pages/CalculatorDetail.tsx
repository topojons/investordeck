import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Calculator } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export default function CalculatorDetail() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  // Map calculator types to display names
  const titles: Record<string, string> = {
    flip: 'Fix & Flip Calculator',
    rental: 'Rental Analysis Calculator',
    wholesale: 'Wholesale Calculator',
    brrrr: 'BRRRR Calculator',
    mortgage: 'Mortgage Comparison',
    roi: 'ROI Calculator',
  }

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Simulate calculation
    setTimeout(() => {
      setResults({
        profit: 85000,
        roi: 34.5,
        timeline: 12,
        investmentRequired: 250000,
      })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/calculators')}
          className="p-2 hover:bg-primary-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calculator className="text-accent-500" size={32} />
            {titles[type || 'flip'] || 'Calculator'}
          </h1>
          <p className="text-gray-400 mt-1">Enter property details to analyze</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card
            header={
              <h2 className="text-lg font-semibold text-white">
                Property Details
              </h2>
            }
          >
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Purchase Details */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 text-gray-300">
                  Purchase Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Purchase Price"
                    type="number"
                    placeholder="250000"
                    required
                  />
                  <Input
                    label="Down Payment (%)"
                    type="number"
                    placeholder="20"
                  />
                </div>
              </div>

              {/* Rehabilitation/Analysis */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 text-gray-300">
                  Rehabilitation Costs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Estimated Repair Costs"
                    type="number"
                    placeholder="75000"
                    required
                  />
                  <Input
                    label="After Repair Value"
                    type="number"
                    placeholder="400000"
                  />
                </div>
              </div>

              {/* Financial Terms */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 text-gray-300">
                  Financing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Loan Amount"
                    type="number"
                    placeholder="200000"
                  />
                  <Input
                    label="Interest Rate (%)"
                    type="number"
                    placeholder="6.5"
                    step="0.1"
                  />
                  <Input
                    label="Loan Term (years)"
                    type="number"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Operational Costs */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 text-gray-300">
                  Operating Costs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Monthly Rent (if rental)"
                    type="number"
                    placeholder="2000"
                  />
                  <Input
                    label="Monthly Expenses"
                    type="number"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                variant="primary"
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
              >
                Calculate
              </Button>
            </form>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-1">
          {results ? (
            <Card
              header={
                <h2 className="text-lg font-semibold text-white">Results</h2>
              }
              className="sticky top-20"
            >
              <div className="space-y-4">
                <div className="bg-primary-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Investment Required</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(results.investmentRequired)}
                  </p>
                </div>

                <div className="bg-profit-500/10 border border-profit-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Potential Profit</p>
                  <p className="text-2xl font-bold text-profit-400">
                    {formatCurrency(results.profit)}
                  </p>
                </div>

                <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">ROI</p>
                  <p className="text-2xl font-bold text-accent-500">
                    {formatPercent(results.roi, 1)}
                  </p>
                </div>

                <div className="bg-primary-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Timeline</p>
                  <p className="text-2xl font-bold text-white">
                    {results.timeline} months
                  </p>
                </div>

                <Button variant="secondary" fullWidth>
                  Save Analysis
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-400">
                Fill in the form and click Calculate to see results
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
