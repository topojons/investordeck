import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import {
  getMockProperties,
  getMockPropertyById,
  getMockComps,
  getMockFeaturedDeals,
} from '../services/mockData';

const router = Router();

// Search properties
router.get('/search', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);

    const filters = {
      address: req.query.address as string | undefined,
      city: req.query.city as string | undefined,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      beds: req.query.beds ? parseInt(req.query.beds as string) : undefined,
      baths: req.query.baths ? parseInt(req.query.baths as string) : undefined,
    };

    const { properties, total } = getMockProperties(page, limit, filters);

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
router.get('/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const property = getMockPropertyById(req.params.id);

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
router.get('/:id/comps', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const radius = parseInt(req.query.radius as string) || 1;
    const months = parseInt(req.query.months as string) || 6;

    const property = getMockPropertyById(req.params.id);

    if (!property) {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
      return;
    }

    const comps = getMockComps(req.params.id, radius, months);

    // Calculate statistics
    const soldPrices = comps.map((c) => c.soldPrice);
    const avgPrice = Math.round(soldPrices.reduce((a, b) => a + b) / soldPrices.length);
    const minPrice = Math.min(...soldPrices);
    const maxPrice = Math.max(...soldPrices);

    const pricePerSqft = Math.round(
      comps.reduce((sum, c) => sum + c.soldPrice / c.sqft, 0) / comps.length
    );

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
