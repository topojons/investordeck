import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { getMockMarketData, getMockMarketComparison } from '../services/mockData';

const router = Router();

// Get market data for a zip code
router.get('/:zipcode', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const zipCode = req.params.zipcode;

    if (!zipCode || zipCode.length < 5) {
      res.status(400).json({
        success: false,
        message: 'Valid zip code required',
      });
      return;
    }

    // Map common zip codes to cities, default to generic city
    const zipCityMap: Record<string, { city: string; state: string }> = {
      '30309': { city: 'Atlanta', state: 'GA' },
      '85018': { city: 'Phoenix', state: 'AZ' },
      '32806': { city: 'Orlando', state: 'FL' },
      '75204': { city: 'Dallas', state: 'TX' },
      '38103': { city: 'Memphis', state: 'TN' },
      '78704': { city: 'Austin', state: 'TX' },
      '32207': { city: 'Jacksonville', state: 'FL' },
      '28202': { city: 'Charlotte', state: 'NC' },
      '89104': { city: 'Las Vegas', state: 'NV' },
      '80202': { city: 'Denver', state: 'CO' },
      '97201': { city: 'Portland', state: 'OR' },
      '46201': { city: 'Indianapolis', state: 'IN' },
      '43085': { city: 'Columbus', state: 'OH' },
    };

    const cityState = zipCityMap[zipCode] || { city: 'City', state: 'ST' };
    const marketData = getMockMarketData(zipCode, cityState.city, cityState.state);

    res.json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    throw error;
  }
});

// Compare multiple markets
router.get('/compare', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const zipsParam = req.query.zips as string | undefined;

    if (!zipsParam) {
      res.status(400).json({
        success: false,
        message: 'zips query parameter required (comma-separated)',
      });
      return;
    }

    const zips = zipsParam
      .split(',')
      .map((z) => z.trim())
      .filter((z) => z.length >= 5)
      .slice(0, 3); // Max 3 markets

    if (zips.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one valid zip code required',
      });
      return;
    }

    const comparison = getMockMarketComparison(zips);

    res.json({
      success: true,
      data: {
        markets: comparison,
        count: comparison.length,
      },
    });
  } catch (error) {
    throw error;
  }
});

export default router;
