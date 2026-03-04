import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { PrismaClient, PipelineStage, CalculatorType } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const SavePropertySchema = z.object({
  propertyAddress: z.string().min(3, 'Address required'),
  propertyData: z.record(z.any()).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const UpdatePropertySchema = z.object({
  pipelineStage: z.enum(['RESEARCHING', 'ANALYZING', 'MAKING_OFFER', 'UNDER_CONTRACT', 'CLOSED']).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const SaveSearchSchema = z.object({
  name: z.string().min(2, 'Name required'),
  searchCriteria: z.record(z.any()),
  alertEnabled: z.boolean().default(false),
});

const SaveAnalysisSchema = z.object({
  propertyAddress: z.string().min(3, 'Address required'),
  calculatorType: z.enum(['FLIP', 'RENTAL', 'WHOLESALE', 'BRRRR', 'MORTGAGE']),
  inputs: z.record(z.any()),
  outputs: z.record(z.any()),
});

// Get saved properties
router.get('/saved-properties', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.savedProperty.findMany({
        where: { userId: req.user!.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedProperty.count({
        where: { userId: req.user!.userId },
      }),
    ]);

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

// Save a property
router.post('/saved-properties', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = SavePropertySchema.parse(req.body);

    const savedProperty = await prisma.savedProperty.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: data.propertyAddress,
        propertyData: data.propertyData || {},
        notes: data.notes,
        tags: data.tags || [],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Property saved successfully',
      data: savedProperty,
    });
  } catch (error) {
    throw error;
  }
});

// Update saved property
router.put('/saved-properties/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = UpdatePropertySchema.parse(req.body);

    const property = await prisma.savedProperty.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.userId !== req.user!.userId) {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
      return;
    }

    const updated = await prisma.savedProperty.update({
      where: { id: req.params.id },
      data: {
        ...data,
        pipelineStage: data.pipelineStage ? (data.pipelineStage as PipelineStage) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updated,
    });
  } catch (error) {
    throw error;
  }
});

// Delete saved property
router.delete('/saved-properties/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const property = await prisma.savedProperty.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.userId !== req.user!.userId) {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
      return;
    }

    await prisma.savedProperty.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    throw error;
  }
});

// Get saved searches
router.get('/saved-searches', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        searches,
        total: searches.length,
      },
    });
  } catch (error) {
    throw error;
  }
});

// Create saved search
router.post('/saved-searches', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = SaveSearchSchema.parse(req.body);

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: req.user!.userId,
        name: data.name,
        searchCriteria: data.searchCriteria,
        alertEnabled: data.alertEnabled,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Search saved successfully',
      data: savedSearch,
    });
  } catch (error) {
    throw error;
  }
});

// Delete saved search
router.delete('/saved-searches/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const search = await prisma.savedSearch.findUnique({
      where: { id: req.params.id },
    });

    if (!search || search.userId !== req.user!.userId) {
      res.status(404).json({
        success: false,
        message: 'Search not found',
      });
      return;
    }

    await prisma.savedSearch.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Search deleted successfully',
    });
  } catch (error) {
    throw error;
  }
});

// Get deal analyses
router.get('/deal-analyses', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      prisma.dealAnalysis.findMany({
        where: { userId: req.user!.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dealAnalysis.count({
        where: { userId: req.user!.userId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        analyses,
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

// Save deal analysis
router.post('/deal-analyses', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = SaveAnalysisSchema.parse(req.body);

    const analysis = await prisma.dealAnalysis.create({
      data: {
        userId: req.user!.userId,
        propertyAddress: data.propertyAddress,
        calculatorType: data.calculatorType as CalculatorType,
        inputs: data.inputs,
        outputs: data.outputs,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Analysis saved successfully',
      data: analysis,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
