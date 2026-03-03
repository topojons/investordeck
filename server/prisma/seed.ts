import { PrismaClient } from '@prisma/client';
import { getMockFeaturedDeals, getAllMockMarkets } from '../src/services/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (optional - comment out if you want to preserve)
  await prisma.featuredDeal.deleteMany();
  await prisma.marketSnapshot.deleteMany();

  // Seed featured deals
  const featuredDeals = getMockFeaturedDeals();

  for (const deal of featuredDeals) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

    await prisma.featuredDeal.create({
      data: {
        propertyAddress: deal.address,
        dealType: deal.dealType as any,
        propertyData: {
          address: deal.address,
          city: deal.city,
          state: deal.state,
          zip: deal.zip,
          price: deal.price,
          beds: deal.beds,
          baths: deal.baths,
          sqft: deal.sqft,
          description: deal.description,
          imageUrl: deal.imageUrl,
          roi: deal.roi,
          estimatedProfit: deal.estimatedProfit,
        },
        expiresAt,
      },
    });
  }

  console.log(`Seeded ${featuredDeals.length} featured deals`);

  // Seed market snapshots
  const markets = getAllMockMarkets();

  for (const market of markets) {
    await prisma.marketSnapshot.create({
      data: {
        zipCode: market.zipCode,
        city: market.city,
        state: market.state,
        data: {
          medianPrice: market.medianPrice,
          medianDom: market.medianDom,
          inventory: market.inventory,
          pricePerSqft: market.pricePerSqft,
          priceHistory: market.priceHistory,
          trends: market.trends,
        },
        snapshotDate: new Date(),
      },
    });
  }

  console.log(`Seeded ${markets.length} market snapshots`);

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
