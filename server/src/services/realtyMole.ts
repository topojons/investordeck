import axios from 'axios';
import { getMockProperties, getMockPropertyById, getMockComps } from './mockData';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'realty-mole-property-api.p.rapidapi.com';

const realtyMoleClient = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

// Check if API key is configured
function hasApiKey(): boolean {
  return RAPIDAPI_KEY.length > 10;
}

// ---- Property Search ----

export interface RealProperty {
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
  lotSize?: number;
  lastSoldDate?: string;
  lastSoldPrice?: number;
  taxAssessedValue?: number;
  annualTaxes?: number;
  ownerName?: string;
}

function normalizeProperty(raw: any): RealProperty {
  return {
    id: raw.id || raw.parcelId || String(Math.random()).slice(2, 10),
    address: raw.formattedAddress || raw.addressLine1 || raw.address || 'Unknown',
    city: raw.city || '',
    state: raw.state || '',
    zip: raw.zipCode || raw.zip || '',
    price: raw.price || raw.estimatedValue || raw.assessorMarketValue || raw.taxAssessment?.value || 0,
    beds: raw.bedrooms || raw.beds || 0,
    baths: raw.bathrooms || raw.baths || 0,
    sqft: raw.squareFootage || raw.sqft || 0,
    yearBuilt: raw.yearBuilt || 0,
    type: raw.propertyType || raw.type || 'Single Family',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
    description: `${raw.propertyType || 'Property'} in ${raw.city || 'Unknown'}, ${raw.state || ''}`,
    lotSize: raw.lotSize || undefined,
    lastSoldDate: raw.lastSaleDate || undefined,
    lastSoldPrice: raw.lastSalePrice || undefined,
    taxAssessedValue: raw.taxAssessment?.value || undefined,
    annualTaxes: raw.taxAssessment?.tax || undefined,
    ownerName: raw.owner || raw.ownerName || undefined,
  };
}

// Search properties by city/state or address
export async function searchProperties(filters: {
  address?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  page?: number;
  limit?: number;
}): Promise<{ properties: RealProperty[]; total: number }> {
  // Fall back to mock data if no API key
  if (!hasApiKey()) {
    const mock = getMockProperties(filters.page || 1, filters.limit || 20, {
      address: filters.address,
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      beds: filters.beds,
      baths: filters.baths,
    });
    return { properties: mock.properties as any, total: mock.total };
  }

  try {
    // If we have an address, use the address lookup
    if (filters.address) {
      const response = await realtyMoleClient.get('/properties', {
        params: { address: filters.address },
      });

      const data = Array.isArray(response.data) ? response.data : [response.data];
      const properties = data.map(normalizeProperty);

      return { properties, total: properties.length };
    }

    // If we have city/state, use the city search
    if (filters.city) {
      const stateAbbrev = filters.state || getStateAbbreviation(filters.city);
      const response = await realtyMoleClient.get('/saleListings', {
        params: {
          city: filters.city,
          state: stateAbbrev,
          limit: filters.limit || 20,
          offset: ((filters.page || 1) - 1) * (filters.limit || 20),
        },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      let properties = data.map(normalizeProperty);

      // Apply client-side filters
      if (filters.minPrice) {
        properties = properties.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        properties = properties.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.beds) {
        properties = properties.filter((p) => p.beds >= filters.beds!);
      }
      if (filters.baths) {
        properties = properties.filter((p) => p.baths >= filters.baths!);
      }

      return { properties, total: properties.length };
    }

    // No filters - return mock
    const mock = getMockProperties(1, 20);
    return { properties: mock.properties as any, total: mock.total };
  } catch (error: any) {
    console.error('Realty Mole search error:', error.response?.data || error.message);
    // Fall back to mock data on error
    const mock = getMockProperties(filters.page || 1, filters.limit || 20, {
      city: filters.city,
      address: filters.address,
    });
    return { properties: mock.properties as any, total: mock.total };
  }
}

// Get property by address
export async function getPropertyByAddress(addressOrId: string): Promise<RealProperty | null> {
  if (!hasApiKey()) {
    const mock = getMockPropertyById(addressOrId);
    return mock as any;
  }

  try {
    // Try as a direct address lookup
    const response = await realtyMoleClient.get('/properties', {
      params: { address: addressOrId },
    });

    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    if (data && (data.formattedAddress || data.addressLine1)) {
      return normalizeProperty(data);
    }

    // Fall back to mock
    const mock = getMockPropertyById(addressOrId);
    return mock as any;
  } catch (error: any) {
    console.error('Realty Mole property lookup error:', error.response?.data || error.message);
    const mock = getMockPropertyById(addressOrId);
    return mock as any;
  }
}

// Get comps for a property address
export async function getPropertyComps(
  addressOrId: string,
  radius: number = 1
): Promise<{ property: RealProperty; comps: any[] } | null> {
  // First get the subject property
  const property = await getPropertyByAddress(addressOrId);
  if (!property) return null;

  if (!hasApiKey()) {
    const mockComps = getMockComps(addressOrId, radius, 6);
    return { property, comps: mockComps };
  }

  try {
    // Use the full address for comps lookup
    const lookupAddress = property.address;

    const response = await realtyMoleClient.get('/salePrice', {
      params: {
        address: lookupAddress,
        compCount: 8,
        squareFootageRange: 0.2,
      },
    });

    if (response.data && response.data.comparables) {
      const comps = response.data.comparables.map((comp: any, index: number) => ({
        id: `comp-${index + 1}`,
        address: comp.formattedAddress || comp.address || 'Unknown',
        city: comp.city || property.city,
        state: comp.state || property.state,
        soldPrice: comp.price || comp.lastSalePrice || 0,
        soldDate: comp.lastSaleDate || 'N/A',
        beds: comp.bedrooms || 0,
        baths: comp.bathrooms || 0,
        sqft: comp.squareFootage || 0,
        distance: comp.distance || (Math.random() * radius).toFixed(1),
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45201003c6c7?w=400',
      }));

      return { property, comps };
    }

    // Fall back to mock comps
    const mockComps = getMockComps(addressOrId, radius, 6);
    return { property, comps: mockComps };
  } catch (error: any) {
    console.error('Realty Mole comps error:', error.response?.data || error.message);
    const mockComps = getMockComps(addressOrId, radius, 6);
    return { property, comps: mockComps };
  }
}

// Helper: guess state abbreviation from city name
function getStateAbbreviation(city: string): string {
  const cityStateMap: Record<string, string> = {
    'new york': 'NY', 'los angeles': 'CA', 'chicago': 'IL', 'houston': 'TX',
    'phoenix': 'AZ', 'philadelphia': 'PA', 'san antonio': 'TX', 'san diego': 'CA',
    'dallas': 'TX', 'austin': 'TX', 'san jose': 'CA', 'jacksonville': 'FL',
    'fort worth': 'TX', 'columbus': 'OH', 'charlotte': 'NC', 'indianapolis': 'IN',
    'san francisco': 'CA', 'seattle': 'WA', 'denver': 'CO', 'nashville': 'TN',
    'oklahoma city': 'OK', 'el paso': 'TX', 'boston': 'MA', 'portland': 'OR',
    'las vegas': 'NV', 'memphis': 'TN', 'louisville': 'KY', 'baltimore': 'MD',
    'milwaukee': 'WI', 'albuquerque': 'NM', 'tucson': 'AZ', 'fresno': 'CA',
    'mesa': 'AZ', 'sacramento': 'CA', 'atlanta': 'GA', 'kansas city': 'MO',
    'miami': 'FL', 'orlando': 'FL', 'tampa': 'FL', 'raleigh': 'NC',
    'upper marlboro': 'MD', 'bowie': 'MD', 'largo': 'MD', 'clinton': 'MD',
  };

  return cityStateMap[city.toLowerCase()] || 'GA';
}
