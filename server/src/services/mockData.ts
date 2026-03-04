export interface MockProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  type: string;
  imageUrl: string;
  description: string;
}

export interface MockComp {
  id: string;
  address: string;
  soldPrice: number;
  soldDate: string;
  beds: number;
  baths: number;
  sqft: number;
  distance: number; // miles
  imageUrl: string;
}

export interface MockFeaturedDeal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dealType: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  imageUrl: string;
  roi: number;
  estimatedProfit: number;
}

export interface MockMarketData {
  zipCode: string;
  city: string;
  state: string;
  medianPrice: number;
  medianDom: number;
  inventory: number;
  pricePerSqft: number;
  priceHistory: Array<{ month: string; price: number }>;
  trends: {
    priceChange: number;
    domChange: number;
    inventoryChange: number;
  };
}

export interface MockMortgageRates {
  thirtyYear: number;
  fifteenYear: number;
  fha: number;
  va: number;
  hardMoney: number;
  lastUpdated: string;
}

// Mock Properties Database
const mockPropertiesDatabase: MockProperty[] = [
  {
    id: '1',
    address: '1452 Peachtree St',
    city: 'Atlanta',
    state: 'GA',
    zip: '30309',
    price: 285000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 1998,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    description: 'Charming 3-bed home in desirable neighborhood, great for fix and flip',
  },
  {
    id: '2',
    address: '8745 Desert Rose Rd',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85018',
    price: 325000,
    beds: 4,
    baths: 2.5,
    sqft: 2200,
    yearBuilt: 2001,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    description: 'Desert living - spacious home with pool potential',
  },
  {
    id: '3',
    address: '5632 Lakeside Ave',
    city: 'Orlando',
    state: 'FL',
    zip: '32806',
    price: 215000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    yearBuilt: 1995,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    description: 'Waterfront property with good rental potential',
  },
  {
    id: '4',
    address: '3210 Oak Glen Dr',
    city: 'Dallas',
    state: 'TX',
    zip: '75204',
    price: 395000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    yearBuilt: 2005,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    description: 'Modern home with strong cash flow potential',
  },
  {
    id: '5',
    address: '7891 Sunset Blvd',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85020',
    price: 245000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    yearBuilt: 1999,
    type: 'Condo',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    description: 'Turnkey investment property, ready to rent',
  },
  {
    id: '6',
    address: '4125 Maple Grove Ct',
    city: 'Atlanta',
    state: 'GA',
    zip: '30315',
    price: 195000,
    beds: 2,
    baths: 1.5,
    sqft: 1200,
    yearBuilt: 1992,
    type: 'Townhouse',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    description: 'Great entry-level investment in growing area',
  },
  {
    id: '7',
    address: '9234 Riverside Park',
    city: 'Memphis',
    state: 'TN',
    zip: '38103',
    price: 185000,
    beds: 3,
    baths: 2,
    sqft: 1700,
    yearBuilt: 1994,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    description: 'Excellent rental market, strong tenant demand',
  },
  {
    id: '8',
    address: '6543 Garden Valley Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    price: 520000,
    beds: 5,
    baths: 3,
    sqft: 3200,
    yearBuilt: 2010,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    description: 'Premium location with commercial opportunities',
  },
  {
    id: '9',
    address: '2847 Pine Forest Rd',
    city: 'Jacksonville',
    state: 'FL',
    zip: '32207',
    price: 235000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    yearBuilt: 2000,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    description: 'Growing market with appreciation potential',
  },
  {
    id: '10',
    address: '5019 Colonial Heights',
    city: 'Charlotte',
    state: 'NC',
    zip: '28202',
    price: 325000,
    beds: 4,
    baths: 2,
    sqft: 2100,
    yearBuilt: 2003,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    description: 'Strong appreciation area, great for long-term holds',
  },
  {
    id: '11',
    address: '8762 Hillside Terrace',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89104',
    price: 275000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    yearBuilt: 2002,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    description: 'Investment-friendly market with growing demand',
  },
  {
    id: '12',
    address: '3456 Summit Ridge Ave',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    price: 435000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2008,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    description: 'Tech hub with strong tenant pool',
  },
  {
    id: '13',
    address: '7124 Brookside Drive',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    price: 385000,
    beds: 3,
    baths: 2.5,
    sqft: 2000,
    yearBuilt: 2006,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    description: 'Emerging market with strong growth indicators',
  },
  {
    id: '14',
    address: '4678 Crescent Park Ln',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    price: 165000,
    beds: 3,
    baths: 1.5,
    sqft: 1500,
    yearBuilt: 1991,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    description: 'Affordable market with good rental demand',
  },
  {
    id: '15',
    address: '9847 Westchester Blvd',
    city: 'Columbus',
    state: 'OH',
    zip: '43085',
    price: 245000,
    beds: 4,
    baths: 2.5,
    sqft: 2100,
    yearBuilt: 2004,
    type: 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    description: 'College town with stable tenant base',
  },
];

// Mock comps data
const generateMockComps = (radius: number = 1, months: number = 6): MockComp[] => {
  return [
    {
      id: 'comp1',
      address: '1450 Peachtree St',
      soldPrice: 295000,
      soldDate: '2024-02-15',
      beds: 3,
      baths: 2,
      sqft: 1900,
      distance: 0.2,
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    },
    {
      id: 'comp2',
      address: '1455 Peachtree St',
      soldPrice: 280000,
      soldDate: '2024-01-20',
      beds: 3,
      baths: 2,
      sqft: 1850,
      distance: 0.3,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    },
    {
      id: 'comp3',
      address: '1460 Peachtree Ave',
      soldPrice: 305000,
      soldDate: '2023-12-10',
      beds: 3,
      baths: 2,
      sqft: 1950,
      distance: 0.4,
      imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    },
    {
      id: 'comp4',
      address: '1448 Peachtree St',
      soldPrice: 285000,
      soldDate: '2023-11-05',
      beds: 3,
      baths: 2,
      sqft: 1850,
      distance: 0.1,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    },
    {
      id: 'comp5',
      address: '1470 Peachtree Rd',
      soldPrice: 310000,
      soldDate: '2023-10-18',
      beds: 3,
      baths: 3,
      sqft: 2000,
      distance: 0.6,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    },
    {
      id: 'comp6',
      address: '1440 Peachtree St',
      soldPrice: 275000,
      soldDate: '2023-09-25',
      beds: 2,
      baths: 2,
      sqft: 1700,
      distance: 0.5,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    },
    {
      id: 'comp7',
      address: '1465 Peachtree Ave',
      soldPrice: 290000,
      soldDate: '2023-08-12',
      beds: 3,
      baths: 2,
      sqft: 1850,
      distance: 0.7,
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    },
    {
      id: 'comp8',
      address: '1475 Peachtree Parkway',
      soldPrice: 300000,
      soldDate: '2023-07-30',
      beds: 3,
      baths: 2,
      sqft: 1900,
      distance: 0.8,
      imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    },
  ];
};

// Mock featured deals
const mockFeaturedDeals: MockFeaturedDeal[] = [
  {
    id: 'featured1',
    address: '1521 Main St',
    city: 'Memphis',
    state: 'TN',
    zip: '38103',
    dealType: 'FORECLOSURE',
    price: 125000,
    beds: 3,
    baths: 2,
    sqft: 1700,
    description: 'Bank-owned foreclosure in rentable area',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    roi: 45,
    estimatedProfit: 75000,
  },
  {
    id: 'featured2',
    address: '3847 Oak Ridge Ln',
    city: 'Atlanta',
    state: 'GA',
    zip: '30309',
    dealType: 'FSBO',
    price: 195000,
    beds: 3,
    baths: 1.5,
    sqft: 1600,
    description: 'Motivated seller, for-sale-by-owner opportunity',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    roi: 38,
    estimatedProfit: 62000,
  },
  {
    id: 'featured3',
    address: '2156 Phoenix Pkwy',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85018',
    dealType: 'SHORT_SALE',
    price: 215000,
    beds: 4,
    baths: 2,
    sqft: 2000,
    description: 'Short sale opportunity with quick close potential',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15cd100fcf8f?w=400',
    roi: 52,
    estimatedProfit: 85000,
  },
  {
    id: 'featured4',
    address: '5432 Rental Row',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    dealType: 'REO',
    price: 145000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    description: 'Bank-owned rental property, move-in ready',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    roi: 55,
    estimatedProfit: 68000,
  },
  {
    id: 'featured5',
    address: '7823 Investment Ave',
    city: 'Dallas',
    state: 'TX',
    zip: '75204',
    dealType: 'AUCTION',
    price: 185000,
    beds: 3,
    baths: 2,
    sqft: 1750,
    description: 'Upcoming auction - good value opportunity',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    roi: 41,
    estimatedProfit: 60000,
  },
  {
    id: 'featured6',
    address: '4567 Tax Lien Lane',
    city: 'Jacksonville',
    state: 'FL',
    zip: '32207',
    dealType: 'TAX_LIEN',
    price: 95000,
    beds: 2,
    baths: 1,
    sqft: 1200,
    description: 'Tax lien redemption opportunity',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    roi: 65,
    estimatedProfit: 55000,
  },
];

// Market data templates
const generateMarketData = (zipCode: string, city: string, state: string): MockMarketData => {
  const basePrice = 280000;
  const variation = Math.sin(zipCode.charCodeAt(0)) * 50000;
  const medianPrice = basePrice + variation;

  // Generate 12 months of price history
  const priceHistory = [];
  for (let i = 11; i >= 0; i--) {
    const trend = i % 3 === 0 ? 0.02 : -0.01;
    const monthPrice = medianPrice * (1 + trend * (11 - i));
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    priceHistory.push({
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      price: Math.round(monthPrice),
    });
  }

  return {
    zipCode,
    city,
    state,
    medianPrice: Math.round(medianPrice),
    medianDom: 45 + Math.floor(Math.random() * 30),
    inventory: 85 + Math.floor(Math.random() * 50),
    pricePerSqft: Math.round(medianPrice / 1800),
    priceHistory,
    trends: {
      priceChange: 3.5 + Math.random() * 4,
      domChange: -2 + Math.random() * 5,
      inventoryChange: -1 + Math.random() * 3,
    },
  };
};

// Mortgage rates
const mockMortgageRates: MockMortgageRates = {
  thirtyYear: 6.85,
  fifteenYear: 6.15,
  fha: 7.25,
  va: 6.45,
  hardMoney: 12.5,
  lastUpdated: new Date().toISOString(),
};

// Exports
export const getMockProperties = (
  page: number = 1,
  limit: number = 20,
  filters?: {
    address?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
  }
): { properties: MockProperty[]; total: number } => {
  let filtered = [...mockPropertiesDatabase];

  if (filters) {
    if (filters.address) {
      filtered = filtered.filter((p) =>
        p.address.toLowerCase().includes(filters.address!.toLowerCase())
      );
    }
    if (filters.city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.beds) {
      filtered = filtered.filter((p) => p.beds >= filters.beds!);
    }
    if (filters.baths) {
      filtered = filtered.filter((p) => p.baths >= filters.baths!);
    }
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    properties: filtered.slice(start, end),
    total: filtered.length,
  };
};

export const getMockPropertyById = (id: string): MockProperty | null => {
  // Search by ID first, then by partial address match
  const byId = mockPropertiesDatabase.find((p) => p.id === id);
  if (byId) return byId;

  const byAddress = mockPropertiesDatabase.find((p) =>
    p.address.toLowerCase().includes(id.toLowerCase()) ||
    p.city.toLowerCase().includes(id.toLowerCase()) ||
    p.zip.includes(id)
  );
  return byAddress || null;
};

export const getMockComps = (
  propertyId: string,
  radius: number = 1,
  months: number = 6
): MockComp[] => {
  return generateMockComps(radius, months);
};

export const getMockFeaturedDeals = (
  dealType?: string
): MockFeaturedDeal[] => {
  if (!dealType) return mockFeaturedDeals;
  return mockFeaturedDeals.filter(
    (d) => d.dealType === dealType.toUpperCase()
  );
};

export const getMockMarketData = (
  zipCode: string,
  city: string = 'Atlanta',
  state: string = 'GA'
): MockMarketData => {
  return generateMarketData(zipCode, city, state);
};

export const getMockMarketComparison = (
  zips: string[]
): MockMarketData[] => {
  return zips.map((zip) => generateMarketData(zip, 'City', 'ST'));
};

export const getMockMortgageRates = (): MockMortgageRates => {
  // Update the lastUpdated timestamp
  return {
    ...mockMortgageRates,
    lastUpdated: new Date().toISOString(),
  };
};

export const getAllMockMarkets = (): MockMarketData[] => {
  const uniqueMarkets = [
    { zip: '30309', city: 'Atlanta', state: 'GA' },
    { zip: '85018', city: 'Phoenix', state: 'AZ' },
    { zip: '32806', city: 'Orlando', state: 'FL' },
    { zip: '75204', city: 'Dallas', state: 'TX' },
    { zip: '38103', city: 'Memphis', state: 'TN' },
    { zip: '78704', city: 'Austin', state: 'TX' },
    { zip: '32207', city: 'Jacksonville', state: 'FL' },
    { zip: '28202', city: 'Charlotte', state: 'NC' },
    { zip: '89104', city: 'Las Vegas', state: 'NV' },
    { zip: '80202', city: 'Denver', state: 'CO' },
  ];

  return uniqueMarkets.map((m) => generateMarketData(m.zip, m.city, m.state));
};
