import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { getMockMortgageRates } from '../services/mockData';

const router = Router();

// Get current mortgage rates
router.get('/mortgage', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const rates = getMockMortgageRates();

    res.json({
      success: true,
      data: {
        rates: {
          thirtyYear: rates.thirtyYear,
          fifteenYear: rates.fifteenYear,
          fha: rates.fha,
          va: rates.va,
          hardMoney: rates.hardMoney,
        },
        lastUpdated: rates.lastUpdated,
        source: 'Mock Data - Real rates would come from external API',
      },
    });
  } catch (error) {
    throw error;
  }
});

export default router;
