# DealScope API Documentation

Complete API reference for the DealScope real estate investor platform backend.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token**: 15-minute expiration, used for API requests
- **Refresh Token**: 7-day expiration, used to obtain new access tokens

---

## Authentication Endpoints

### Register User

Create a new user account.

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "investor@example.com",
  "password": "SecurePassword123!",
  "name": "John Investor"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clxxxxxx",
      "email": "investor@example.com",
      "name": "John Investor"
    },
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Validation Rules:**
- Email must be valid and unique
- Password must be at least 8 characters
- Name must be at least 2 characters

---

### Login User

Authenticate and receive tokens.

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "investor@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clxxxxxx",
      "email": "investor@example.com",
      "name": "John Investor"
    },
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

### Refresh Access Token

Obtain a new access token using a refresh token.

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

### Get Current User

Retrieve the authenticated user's profile.

```http
GET /auth/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxx",
    "email": "investor@example.com",
    "name": "John Investor",
    "avatarUrl": null,
    "createdAt": "2024-03-01T10:30:00Z"
  }
}
```

---

## Property Endpoints

### Search Properties

Search for investment properties with filters.

```http
GET /properties/search?address=Atlanta&city=&minPrice=100000&maxPrice=500000&beds=3&baths=2&page=1&limit=20
```

**Query Parameters:**
- `address` (string, optional) - Property address substring
- `city` (string, optional) - City name
- `zip` (string, optional) - Zip code
- `state` (string, optional) - State code
- `minPrice` (number, optional) - Minimum price
- `maxPrice` (number, optional) - Maximum price
- `beds` (number, optional) - Minimum bedrooms
- `baths` (number, optional) - Minimum bathrooms
- `minSqft` (number, optional) - Minimum square footage
- `maxSqft` (number, optional) - Maximum square footage
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Results per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "1",
        "address": "1452 Peachtree St",
        "city": "Atlanta",
        "state": "GA",
        "zip": "30309",
        "price": 285000,
        "beds": 3,
        "baths": 2,
        "sqft": 1850,
        "yearBuilt": 1998,
        "type": "Single Family",
        "imageUrl": "https://images.unsplash.com/...",
        "description": "Charming 3-bed home..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### Get Featured Deals

Retrieve featured investment opportunities.

```http
GET /properties/featured?type=FORECLOSURE
```

**Query Parameters:**
- `type` (string, optional) - Deal type filter: FSBO, FORECLOSURE, AUCTION, SHORT_SALE, REO, TAX_LIEN

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "featured1",
        "address": "1521 Main St",
        "city": "Memphis",
        "state": "TN",
        "zip": "38103",
        "dealType": "FORECLOSURE",
        "price": 125000,
        "beds": 3,
        "baths": 2,
        "sqft": 1700,
        "description": "Bank-owned foreclosure...",
        "imageUrl": "https://images.unsplash.com/...",
        "roi": 45,
        "estimatedProfit": 75000
      }
    ],
    "total": 6
  }
}
```

---

### Get Property Detail

Retrieve detailed information about a specific property.

```http
GET /properties/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "address": "1452 Peachtree St",
    "city": "Atlanta",
    "state": "GA",
    "zip": "30309",
    "price": 285000,
    "beds": 3,
    "baths": 2,
    "sqft": 1850,
    "yearBuilt": 1998,
    "type": "Single Family",
    "imageUrl": "https://images.unsplash.com/...",
    "description": "Charming 3-bed home in desirable neighborhood..."
  }
}
```

---

### Get Comparable Properties

Retrieve comparable sales for a property.

```http
GET /properties/:id/comps?radius=1&months=6
```

**Query Parameters:**
- `radius` (number, default: 1) - Search radius in miles
- `months` (number, default: 6) - Number of months to look back

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "property": { /* main property object */ },
    "comps": [
      {
        "id": "comp1",
        "address": "1450 Peachtree St",
        "soldPrice": 295000,
        "soldDate": "2024-02-15",
        "beds": 3,
        "baths": 2,
        "sqft": 1900,
        "distance": 0.2,
        "imageUrl": "https://images.unsplash.com/..."
      }
    ],
    "statistics": {
      "avgPrice": 290000,
      "minPrice": 275000,
      "maxPrice": 310000,
      "pricePerSqft": 157,
      "count": 8
    }
  }
}
```

---

## Calculator Endpoints

All calculator endpoints are **protected** and require authentication.

### Flip Calculator

Calculate fix & flip profitability.

```http
POST /calculator/flip
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "purchasePrice": 150000,
  "repairCosts": 75000,
  "closingCosts": 4500,
  "holdingCosts": 2500,
  "afterRepairValue": 285000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvestment": 232000,
    "expectedProfit": 53000,
    "roi": 22.84,
    "annualizedRoi": 45.67,
    "maxAllowableOffer": 134500,
    "profitPerDay": 294.44
  }
}
```

---

### Rental Calculator

Comprehensive rental property analysis.

```http
POST /calculator/rental
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "purchasePrice": 250000,
  "downPaymentPercent": 25,
  "interestRate": 6.5,
  "loanTermYears": 30,
  "monthlyRent": 2000,
  "vacancyRate": 8,
  "propertyTaxMonthly": 250,
  "insuranceMonthly": 120,
  "maintenancePercent": 10,
  "pmiMonthly": 0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "monthlyMortgage": 1095.36,
    "monthlyIncome": 1840,
    "monthlyExpenses": 1612.4,
    "monthlyCashFlow": 227.6,
    "annualCashFlow": 2731.2,
    "cashOnCash": 4.39,
    "capRate": 13.12,
    "dscr": 1.14,
    "onePercentRule": 0.96,
    "grossRentMultiplier": 10.42,
    "totalInterestPaid": 144526,
    "projections": [
      {
        "years": 5,
        "propertyValue": 289808,
        "cumulativeCashFlow": 13656,
        "totalEquity": 91964,
        "roi": 73.57
      },
      {
        "years": 10,
        "propertyValue": 335970,
        "cumulativeCashFlow": 27312,
        "totalEquity": 138882,
        "roi": 111.11
      },
      {
        "years": 30,
        "propertyValue": 564866,
        "cumulativeCashFlow": 81936,
        "totalEquity": 436802,
        "roi": 349.44
      }
    ]
  }
}
```

---

### Wholesale Calculator

Quick wholesale deal evaluation.

```http
POST /calculator/wholesale
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "purchasePrice": 180000,
  "afterRepairValue": 320000,
  "repairCosts": 60000,
  "assignmentFee": 8000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "maxOffer": 164000,
    "assignmentFee": 8000,
    "endBuyerPrice": 172000,
    "estimatedProfit": 148000,
    "roi": 82.22
  }
}
```

---

### BRRRR Calculator

Buy-Rehab-Rent-Refinance-Repeat strategy.

```http
POST /calculator/brrrr
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "purchasePrice": 200000,
  "repairCosts": 50000,
  "downPaymentPercent": 20,
  "initialInterestRate": 7.5,
  "initialLoanTermYears": 30,
  "refinanceAfterRepairsPercent": 80,
  "refinanceInterestRate": 6.5,
  "refinanceLoanTermYears": 30,
  "monthlyRent": 1800,
  "monthlyExpenses": 600
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvestment": 250000,
    "initialDownPayment": 40000,
    "initialLoanAmount": 160000,
    "initialMonthlyPayment": 1119.43,
    "propertyAfterRepairs": 250000,
    "refinanceAmount": 200000,
    "refinanceMonthlyPayment": 1271.62,
    "cashLeftInDeal": 40000,
    "monthlyCashFlow": 428.38,
    "annualCashFlow": 5140.56,
    "cashOnCashReturn": 12.85
  }
}
```

---

### Mortgage Calculator

Compare up to 3 mortgage scenarios.

```http
POST /calculator/mortgage
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "loanAmount": 200000,
  "scenarios": [
    {
      "interestRate": 6.5,
      "loanTermYears": 30,
      "label": "30-Year Fixed @ 6.5%"
    },
    {
      "interestRate": 6.0,
      "loanTermYears": 15,
      "label": "15-Year Fixed @ 6.0%"
    },
    {
      "interestRate": 8.5,
      "loanTermYears": 10,
      "label": "Hard Money @ 8.5%"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "loanAmount": 200000,
    "scenarios": [
      {
        "label": "30-Year Fixed @ 6.5%",
        "interestRate": 6.5,
        "loanTermYears": 30,
        "monthlyPayment": 1264.14,
        "totalInterest": 255090,
        "totalCost": 455090,
        "amortizationSchedule": [
          {
            "month": 1,
            "payment": 1264.14,
            "principal": 413.47,
            "interest": 850.67,
            "balance": 199586.53
          }
        ]
      }
    ]
  }
}
```

---

## Market Data Endpoints

### Get Market Data

Retrieve market data for a specific zip code.

```http
GET /market/:zipcode
```

**Example:**
```http
GET /market/30309
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "zipCode": "30309",
    "city": "Atlanta",
    "state": "GA",
    "medianPrice": 285000,
    "medianDom": 47,
    "inventory": 112,
    "pricePerSqft": 158,
    "priceHistory": [
      {
        "month": "Mar '24",
        "price": 285000
      },
      {
        "month": "Feb '24",
        "price": 282500
      }
    ],
    "trends": {
      "priceChange": 3.7,
      "domChange": 1.2,
      "inventoryChange": 0.8
    }
  }
}
```

---

### Compare Markets

Compare data for up to 3 markets.

```http
GET /market/compare?zips=30309,85018,75204
```

**Query Parameters:**
- `zips` (string, required) - Comma-separated zip codes (max 3)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "markets": [
      { /* market data for 30309 */ },
      { /* market data for 85018 */ },
      { /* market data for 75204 */ }
    ],
    "count": 3
  }
}
```

---

## Mortgage Rates Endpoint

### Get Current Rates

Retrieve current mortgage rates.

```http
GET /rates/mortgage
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rates": {
      "thirtyYear": 6.85,
      "fifteenYear": 6.15,
      "fha": 7.25,
      "va": 6.45,
      "hardMoney": 12.5
    },
    "lastUpdated": "2024-03-01T15:30:00Z",
    "source": "Mock Data - Real rates would come from external API"
  }
}
```

---

## User Management Endpoints

All user endpoints are **protected**.

### Get Saved Properties

Retrieve user's saved properties with pagination.

```http
GET /user/saved-properties?page=1&limit=20
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "clxxxxxx",
        "userId": "clxxxxxx",
        "propertyAddress": "1452 Peachtree St",
        "propertyData": { /* property object */ },
        "pipelineStage": "ANALYZING",
        "notes": "Good deal potential",
        "tags": ["flip-candidate", "atlanta"],
        "createdAt": "2024-03-01T10:00:00Z",
        "updatedAt": "2024-03-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Save a Property

Add a property to saved list.

```http
POST /user/saved-properties
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyAddress": "1452 Peachtree St, Atlanta, GA 30309",
  "propertyData": {
    "price": 285000,
    "beds": 3,
    "baths": 2,
    "sqft": 1850
  },
  "notes": "Good flip candidate",
  "tags": ["flip", "atlanta"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "id": "clxxxxxx",
    "userId": "clxxxxxx",
    "propertyAddress": "1452 Peachtree St, Atlanta, GA 30309",
    "propertyData": { /* ... */ },
    "pipelineStage": "RESEARCHING",
    "notes": "Good flip candidate",
    "tags": ["flip", "atlanta"],
    "createdAt": "2024-03-01T10:00:00Z",
    "updatedAt": "2024-03-01T10:00:00Z"
  }
}
```

---

### Update Saved Property

Update a saved property's pipeline stage, notes, or tags.

```http
PUT /user/saved-properties/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "pipelineStage": "MAKING_OFFER",
  "notes": "Submitted offer at $275k",
  "tags": ["flip", "atlanta", "offer-pending"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": { /* updated property */ }
}
```

---

### Delete Saved Property

Remove a property from saved list.

```http
DELETE /user/saved-properties/:id
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### Get Saved Searches

Retrieve user's saved searches.

```http
GET /user/saved-searches
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "searches": [
      {
        "id": "clxxxxxx",
        "userId": "clxxxxxx",
        "name": "Atlanta Flip Opportunities",
        "searchCriteria": {
          "city": "Atlanta",
          "minPrice": 150000,
          "maxPrice": 300000,
          "beds": 3
        },
        "alertEnabled": true,
        "createdAt": "2024-03-01T10:00:00Z"
      }
    ],
    "total": 3
  }
}
```

---

### Create Saved Search

Create a new saved search with alert capability.

```http
POST /user/saved-searches
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Phoenix Rental Opportunities",
  "searchCriteria": {
    "city": "Phoenix",
    "minPrice": 200000,
    "maxPrice": 400000,
    "beds": 3,
    "baths": 2
  },
  "alertEnabled": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Search saved successfully",
  "data": {
    "id": "clxxxxxx",
    "userId": "clxxxxxx",
    "name": "Phoenix Rental Opportunities",
    "searchCriteria": { /* ... */ },
    "alertEnabled": true,
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

---

### Delete Saved Search

Remove a saved search.

```http
DELETE /user/saved-searches/:id
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Search deleted successfully"
}
```

---

### Get Deal Analyses

Retrieve user's saved deal analyses.

```http
GET /user/deal-analyses?page=1&limit=20
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "clxxxxxx",
        "userId": "clxxxxxx",
        "propertyAddress": "1452 Peachtree St",
        "calculatorType": "FLIP",
        "inputs": { /* calculation inputs */ },
        "outputs": { /* calculation results */ },
        "createdAt": "2024-03-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1
    }
  }
}
```

---

### Save Deal Analysis

Manually save a deal analysis.

```http
POST /user/deal-analyses
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyAddress": "1452 Peachtree St",
  "calculatorType": "FLIP",
  "inputs": {
    "purchasePrice": 150000,
    "repairCosts": 75000
  },
  "outputs": {
    "totalInvestment": 232000,
    "expectedProfit": 53000
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Analysis saved successfully",
  "data": { /* saved analysis */ }
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": "purchasePrice",
      "message": "Purchase price must be positive"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Property not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

When limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Example Workflows

### Workflow 1: Register and Save a Property

1. Register user: `POST /auth/register`
2. Search properties: `GET /properties/search`
3. Get property details: `GET /properties/:id`
4. Get comps: `GET /properties/:id/comps`
5. Save property: `POST /user/saved-properties`

### Workflow 2: Analyze a Rental Property

1. Get current rates: `GET /rates/mortgage`
2. Run rental calculator: `POST /calculator/rental`
3. View market data: `GET /market/:zipcode`
4. Save analysis: `POST /user/deal-analyses`

### Workflow 3: Evaluate Wholesale Deal

1. Search properties: `GET /properties/search`
2. Run wholesale calculator: `POST /calculator/wholesale`
3. Create saved search: `POST /user/saved-searches`
4. Compare markets: `GET /market/compare`
