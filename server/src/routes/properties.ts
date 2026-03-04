import { Router, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import {
  searchProperties,
  getPropertyByAddress,
  getPropertyComps,
} from '../services/realtyMole';
import { getMockFeaturedDeals } from '../services/mockData';

const router = Router();

// Search properties
router.get('/search', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);

    // Get state from query or from state dropdown
    const stateParam = req.query.state as string | undefined;
    let stateAbbrev: string | undefined;
    if (stateParam) {
      // If it's a full state name, we pass it through - the service will handle it
      stateAbbrev = stateParam;
    }

    const filters = {
      address: req.query.address as string | undefined,
      city: req.query.city as string | undefined,
      state: stateAbbrev,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      beds: req.query.beds ? parseInt(req.query.beds as string) : undefined,
      baths: req.query.baths ? parseInt(req.query.baths as string) : undefined,
      page,
      limit,
    };

    const { properties, total } = await searchProperties(filters);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    throw error;
  }
});

// Get featured deals
router.get('/featured', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealType = req.query.type as string | undefined;
    const deals = getMockFeaturedDeals(dealType);

    res.json({
      success: true,
      data: {
        deals,
        total: deals.length,
      },
    });
  } catch (error) {
    throw error;
  }
});

// Get property detail
router.get('/:id', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const property = await getPropertyByAddress(decodeURIComponent(req.params.id));

    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
      return;
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    throw error;
  }
});

// Get comparable properties
router.get('/:id/comps', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const radius = parseInt(req.query.radius as string) || 1;

    const result = await getPropertyComps(decodeURIComponent(req.params.id), radius);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
      return;
    }

    const { property, comps } = result;

    // Calculate statistics
    const soldPrices = comps.map((c: any) => c.soldPrice).filter((p: number) => p > 0);
    const avgPrice = soldPrices.length > 0
      ? Math.round(soldPrices.reduce((a: number, b: number) => a + b, 0) / soldPrices.length)
      : 0;
    const minPrice = soldPrices.length > 0 ? Math.min(...soldPrices) : 0;
    const maxPrice = soldPrices.length > 0 ? Math.max(...soldPrices) : 0;

    const compsWithSqft = comps.filter((c: any) => c.sqft > 0 && c.soldPrice > 0);
    const pricePerSqft = compsWithSqft.length > 0
      ? Math.round(compsWithSqft.reduce((sum: number, c: any) => sum + c.soldPrice / c.sqft, 0) / compsWithSqft.length)
      : 0;

    res.json({
      success: true,
      data: {
        property,
        comps,
        statistics: {
          avgPrice,
          minPrice,
          maxPrice,
          pricePerSqft,
          count: comps.length,
        },
      },
    });
  } catch (error) {
    throw error;
  }
});

export default router;
