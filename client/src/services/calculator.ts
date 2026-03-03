import apiClient from './api'

export interface FlipCalculation {
  purchasePrice: number
  repairCosts: number
  closingCosts: number
  afterRepairValue: number
  sellingCosts: number
  totalInvestment: number
  grossProfit: number
  profitMargin: number
  roi: number
  timeline: number
}

export interface RentalCalculation {
  purchasePrice: number
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  monthlyRent: number
  monthlyExpenses: number
  monthlyNetIncome: number
  capRate: number
  cashOnCashReturn: number
  breakEvenPrice: number
  years: number
}

export interface WholesaleCalculation {
  purchasePrice: number
  repairCosts: number
  maxOfferPrice: number
  wholesaleAssignmentFee: number
  endBuyerProfit: number
  endBuyerPrice: number
}

export interface BRRRRCalculation {
  purchasePrice: number
  repairCosts: number
  afterRepairValue: number
  refinanceAmount: number
  cashOut: number
  initialDownPayment: number
  newMonthlyPayment: number
  monthlyRent: number
  cashFlow: number
  roi: number
}

export interface MortgageComparison {
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
}

export async function calculateFlip(
  data: Partial<FlipCalculation>
): Promise<FlipCalculation> {
  const response = await apiClient.post('/calculators/flip', data)
  return response.data
}

export async function calculateRental(
  data: Partial<RentalCalculation>
): Promise<RentalCalculation> {
  const response = await apiClient.post('/calculators/rental', data)
  return response.data
}

export async function calculateWholesale(
  data: Partial<WholesaleCalculation>
): Promise<WholesaleCalculation> {
  const response = await apiClient.post('/calculators/wholesale', data)
  return response.data
}

export async function calculateBRRRR(
  data: Partial<BRRRRCalculation>
): Promise<BRRRRCalculation> {
  const response = await apiClient.post('/calculators/brrrr', data)
  return response.data
}

export async function compareMortgages(
  mortgages: Partial<MortgageComparison>[]
): Promise<MortgageComparison[]> {
  const response = await apiClient.post('/calculators/mortgage-compare', {
    mortgages,
  })
  return response.data
}
