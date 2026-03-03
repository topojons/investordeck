import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const FlipCalculatorSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  repairCosts: z.number().nonnegative('Repair costs must be non-negative'),
  closingCosts: z.number().nonnegative('Closing costs must be non-negative'),
  holdingCosts: z.number().nonnegative('Holding costs must be non-negative'),
  afterRepairValue: z.number().positive('After repair value must be positive'),
});

const RentalCalculatorSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  downPaymentPercent: z.number().min(0).max(100),
  interestRate: z.number().positive('Interest rate must be positive'),
  loanTermYears: z.number().int().positive('Loan term must be positive'),
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  vacancyRate: z.number().min(0).max(100, 'Vacancy rate must be 0-100'),
  propertyTaxMonthly: z.number().nonnegative('Property tax must be non-negative'),
  insuranceMonthly: z.number().nonnegative('Insurance must be non-negative'),
  maintenancePercent: z.number().min(0).max(100, 'Maintenance must be 0-100'),
  pmiMonthly: z.number().nonnegative('PMI must be non-negative'),
});

const WholesaleCalculatorSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  afterRepairValue: z.number().positive('After repair value must be positive'),
  repairCosts: z.number().nonnegative('Repair costs must be non-negative'),
  assignmentFee: z.number().nonnegative('Assignment fee must be non-negative'),
});

const BrrrrCalculatorSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  repairCosts: z.number().nonnegative('Repair costs must be non-negative'),
  downPaymentPercent: z.number().min(0).max(100),
  initialInterestRate: z.number().positive('Interest rate must be positive'),
  initialLoanTermYears: z.number().int().positive('Loan term must be positive'),
  refinanceAfterRepairsPercent: z.number().min(0).max(100),
  refinanceInterestRate: z.number().positive('Refinance interest rate must be positive'),
  refinanceLoanTermYears: z.number().int().positive('Refinance loan term must be positive'),
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  monthlyExpenses: z.number().nonnegative('Monthly expenses must be non-negative'),
});

const MortgageCalculatorSchema = z.object({
  loanAmount: z.number().positive('Loan amount must be positive'),
  scenarios: z.array(
    z.object({
      interestRate: z.number().positive('Interest rate must be positive'),
      loanTermYears: z.number().int().positive('Loan term must be positive'),
      label: z.string().optional(),
    })
  )
    .min(1, 'At least one scenario required')
    .max(3, 'Maximum 3 scenarios allowed'),
});

// Helper function to calculate monthly mortgage payment
const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  return (principal * numerator) / denominator;
};

// Helper function to generate amortization schedule
const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  years: number,
  monthsToShow: number = 12
) => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const schedule = [];

  let remainingBalance = principal;

  for (let i = 0; i < monthsToShow && remainingBalance > 0; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      month: i + 1,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(remainingBalance * 100) / 100),
    });
  }

  return schedule;
};

// Flip calculator
router.post('/flip', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = FlipCalculatorSchema.parse(req.body);

    const totalInvestment =
      data.purchasePrice + data.repairCosts + data.closingCosts + data.holdingCosts;
    const expectedProfit = data.afterRepairValue - totalInvestment;
    const roi = (expectedProfit / totalInvestment) * 100;
    const maxAllowableOffer = data.afterRepairValue * 0.7 - data.repairCosts;

    const output = {
      totalInvestment: Math.round(totalInvestment),
      expectedProfit: Math.round(expectedProfit),
      roi: Math.round(roi * 100) / 100,
      annualizedRoi: Math.round((roi / (6 / 12)) * 100) / 100, // Assumes 6-month flip
      maxAllowableOffer: Math.round(maxAllowableOffer),
      profitPerDay: Math.round((expectedProfit / 180) * 100) / 100, // 6-month flip
    };

    // Save to database
    await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: 'Flip Analysis',
        calculatorType: 'FLIP',
        inputs: data,
        outputs: output,
      },
    });

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    throw error;
  }
});

// Rental calculator
router.post('/rental', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = RentalCalculatorSchema.parse(req.body);

    const downPayment = (data.purchasePrice * data.downPaymentPercent) / 100;
    const loanAmount = data.purchasePrice - downPayment;
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      data.interestRate,
      data.loanTermYears
    );

    const monthlyIncome = data.monthlyRent * (1 - data.vacancyRate / 100);
    const maintenanceCosts = (data.monthlyRent * data.maintenancePercent) / 100;
    const totalMonthlyExpenses =
      monthlyPayment +
      data.propertyTaxMonthly +
      data.insuranceMonthly +
      maintenanceCosts +
      data.pmiMonthly;
    const monthlyCashFlow = monthlyIncome - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash = (annualCashFlow / downPayment) * 100;

    // Cap rate on total property value
    const capRate = (annualCashFlow / data.purchasePrice) * 100;

    // Debt Service Coverage Ratio
    const dscr = monthlyIncome / totalMonthlyExpenses;

    // 1% rule
    const onePercentRule = (monthlyIncome / data.purchasePrice) * 100;

    // Gross Rent Multiplier
    const grm = data.purchasePrice / (data.monthlyRent * 12);

    // Calculate total interest paid over loan term
    const totalPayments = monthlyPayment * data.loanTermYears * 12;
    const totalInterest = totalPayments - loanAmount;

    // 5, 10, 30 year projections (assuming 3% annual appreciation)
    const appreciationRate = 0.03;
    const projections = [5, 10, 30].map((years) => {
      const futureValue = data.purchasePrice * Math.pow(1 + appreciationRate, years);
      const cumulativeCashFlow = annualCashFlow * years;
      const totalEquity = downPayment + cumulativeCashFlow + (futureValue - data.purchasePrice);

      return {
        years,
        propertyValue: Math.round(futureValue),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        totalEquity: Math.round(totalEquity),
        roi: Math.round((totalEquity / downPayment - 1) * 10000) / 100,
      };
    });

    const output = {
      monthlyMortgage: Math.round(monthlyPayment * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(totalMonthlyExpenses * 100) / 100,
      monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
      annualCashFlow: Math.round(annualCashFlow * 100) / 100,
      cashOnCash: Math.round(cashOnCash * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      dscr: Math.round(dscr * 100) / 100,
      onePercentRule: Math.round(onePercentRule * 10000) / 10000,
      grossRentMultiplier: Math.round(grm * 100) / 100,
      totalInterestPaid: Math.round(totalInterest),
      projections,
    };

    // Save to database
    await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: 'Rental Analysis',
        calculatorType: 'RENTAL',
        inputs: data,
        outputs: output,
      },
    });

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    throw error;
  }
});

// Wholesale calculator
router.post('/wholesale', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = WholesaleCalculatorSchema.parse(req.body);

    const maxOffer = data.afterRepairValue * 0.7 - data.repairCosts;
    const endBuyerPrice = maxOffer + data.assignmentFee;
    const profit = data.afterRepairValue - endBuyerPrice - data.repairCosts;

    const output = {
      maxOffer: Math.round(maxOffer),
      assignmentFee: Math.round(data.assignmentFee),
      endBuyerPrice: Math.round(endBuyerPrice),
      estimatedProfit: Math.round(profit),
      roi: Math.round((profit / data.purchasePrice) * 10000) / 100,
    };

    // Save to database
    await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: 'Wholesale Analysis',
        calculatorType: 'WHOLESALE',
        inputs: data,
        outputs: output,
      },
    });

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    throw error;
  }
});

// BRRRR calculator
router.post('/brrrr', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = BrrrrCalculatorSchema.parse(req.body);

    // Initial loan
    const initialDownPayment = (data.purchasePrice * data.downPaymentPercent) / 100;
    const initialLoanAmount = data.purchasePrice - initialDownPayment;
    const initialMonthlyPayment = calculateMonthlyPayment(
      initialLoanAmount,
      data.initialInterestRate,
      data.initialLoanTermYears
    );

    // After repairs
    const propertyAfterRepairs = data.purchasePrice + data.repairCosts;

    // Refinance amount (percentage of property value after repairs)
    const refinanceAmount = (propertyAfterRepairs * data.refinanceAfterRepairsPercent) / 100;

    // Cash left in deal
    const cashLeftInDeal = refinanceAmount - initialLoanAmount - data.repairCosts;

    // New loan payment after refinance
    const refinanceMonthlyPayment = calculateMonthlyPayment(
      refinanceAmount,
      data.refinanceInterestRate,
      data.refinanceLoanTermYears
    );

    // Monthly cash flow
    const monthlyCashFlow = data.monthlyRent - refinanceMonthlyPayment - data.monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Cash on cash return
    const cashOnCashReturn = (annualCashFlow / initialDownPayment) * 100;

    const output = {
      totalInvestment: Math.round(data.purchasePrice + data.repairCosts),
      initialDownPayment: Math.round(initialDownPayment),
      initialLoanAmount: Math.round(initialLoanAmount),
      initialMonthlyPayment: Math.round(initialMonthlyPayment * 100) / 100,
      propertyAfterRepairs: Math.round(propertyAfterRepairs),
      refinanceAmount: Math.round(refinanceAmount),
      refinanceMonthlyPayment: Math.round(refinanceMonthlyPayment * 100) / 100,
      cashLeftInDeal: Math.round(cashLeftInDeal),
      monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
      annualCashFlow: Math.round(annualCashFlow),
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
    };

    // Save to database
    await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: 'BRRRR Analysis',
        calculatorType: 'BRRRR',
        inputs: data,
        outputs: output,
      },
    });

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    throw error;
  }
});

// Mortgage calculator
router.post('/mortgage', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = MortgageCalculatorSchema.parse(req.body);

    const scenarios = data.scenarios.map((scenario) => {
      const monthlyPayment = calculateMonthlyPayment(
        data.loanAmount,
        scenario.interestRate,
        scenario.loanTermYears
      );
      const totalPayments = monthlyPayment * scenario.loanTermYears * 12;
      const totalInterest = totalPayments - data.loanAmount;
      const totalCost = totalPayments;

      return {
        label: scenario.label || `${scenario.loanTermYears}yr @ ${scenario.interestRate}%`,
        interestRate: scenario.interestRate,
        loanTermYears: scenario.loanTermYears,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round(totalInterest),
        totalCost: Math.round(totalCost),
        amortizationSchedule: generateAmortizationSchedule(
          data.loanAmount,
          scenario.interestRate,
          scenario.loanTermYears,
          12
        ),
      };
    });

    const output = {
      loanAmount: Math.round(data.loanAmount),
      scenarios,
    };

    // Save to database
    await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: 'Mortgage Comparison',
        calculatorType: 'MORTGAGE',
        inputs: data,
        outputs: output,
      },
    });

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
