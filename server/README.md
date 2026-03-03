# DealScope Backend

A production-quality Node.js + Express + TypeScript real estate investor platform backend.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting, bcrypt password hashing

## Features

- User authentication (register, login, refresh tokens)
- Property search and details
- Real estate calculators:
  - Fix & Flip Analysis
  - Rental Property Analysis
  - Wholesale Deal Calculator
  - BRRRR Strategy Calculator
  - Mortgage Comparison Tool
- Market data and trends
- Mortgage rates
- User pipeline management (saved properties, searches, analyses)
- Redis caching with fallback
- Production-ready error handling

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Express app setup
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication middleware
│   │   └── errorHandler.ts   # Global error handler
│   ├── routes/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── properties.ts     # Property search & details
│   │   ├── calculator.ts     # RE calculators (5 types)
│   │   ├── market.ts         # Market data endpoints
│   │   ├── rates.ts          # Mortgage rates endpoint
│   │   └── user.ts           # User profile & saved items
│   ├── services/
│   │   ├── mockData.ts       # Comprehensive mock data
│   │   └── cache.ts          # Redis caching service
│   └── utils/
│       └── jwt.ts            # JWT token generation/verification
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── .env.example              # Environment template
├── Dockerfile                # Docker configuration
├── package.json              # Dependencies & scripts
└── tsconfig.json             # TypeScript configuration
```

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 12+
- Redis 6+ (optional, falls back gracefully)

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your database and Redis URLs
```

3. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

4. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)

### Properties
- `GET /api/properties/search?address=&city=&minPrice=&maxPrice=&beds=&baths=&page=&limit=`
- `GET /api/properties/featured?type=FORECLOSURE`
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/:id/comps?radius=1&months=6` - Get comparable sales

### Calculators (all protected)
- `POST /api/calculator/flip` - Fix & flip analysis
- `POST /api/calculator/rental` - Rental property analysis
- `POST /api/calculator/wholesale` - Wholesale deal analysis
- `POST /api/calculator/brrrr` - BRRRR strategy analysis
- `POST /api/calculator/mortgage` - Mortgage comparison (up to 3 scenarios)

### Market Data
- `GET /api/market/:zipcode` - Get market data for zip code
- `GET /api/market/compare?zips=30309,85018,75204` - Compare up to 3 markets

### Rates
- `GET /api/rates/mortgage` - Get current mortgage rates

### User Management (all protected)
- `GET /api/user/saved-properties?page=1&limit=20`
- `POST /api/user/saved-properties` - Save a property
- `PUT /api/user/saved-properties/:id` - Update saved property
- `DELETE /api/user/saved-properties/:id` - Delete saved property
- `GET /api/user/saved-searches`
- `POST /api/user/saved-searches` - Create saved search
- `DELETE /api/user/saved-searches/:id` - Delete saved search
- `GET /api/user/deal-analyses?page=1&limit=20`
- `POST /api/user/deal-analyses` - Save deal analysis

## Calculator Details

### Flip Calculator
Computes fix & flip profitability using 70% rule:
- Total Investment = Purchase + Repairs + Closing + Holding
- Expected Profit = ARV - Total Investment
- ROI = (Profit / Investment) × 100
- Max Allowable Offer = (ARV × 0.7) - Repair Costs

### Rental Calculator
Comprehensive rental property analysis:
- Monthly Payment (using mortgage formula)
- Cash Flow (income - expenses)
- Cap Rate and DSCR
- 1% Rule and Gross Rent Multiplier
- 5/10/30 year projections with appreciation

### Wholesale Calculator
Quick wholesale deal evaluation:
- Max Offer using 70% rule
- Assignment Fee and End Buyer Price
- Quick profit calculation

### BRRRR Calculator
Buy-Rehab-Rent-Refinance-Repeat strategy:
- Initial and refinance loan comparisons
- Cash left in deal after refinance
- Monthly cash flow and cash-on-cash return

### Mortgage Calculator
Compare up to 3 loan scenarios:
- Monthly Payment (using standard mortgage formula)
- Total Interest and Total Cost
- 12-month amortization schedule for each scenario

## Mortgage Formula

The standard mortgage payment formula used:
```
M = P[r(1+r)^n]/[(1+r)^n-1]

Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Number of payments (years × 12)
```

## Mock Data

The system includes realistic mock data:
- 15+ properties across 10+ US markets
- Realistic prices, addresses, and property details
- Comparable sales data with dates and distances
- Featured deals across all deal types (FSBO, Foreclosure, Auction, etc.)
- Market data with 12-month price history and trends
- Current mortgage rates

## Authentication

Uses JWT tokens:
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration

Include in requests:
```
Authorization: Bearer <access_token>
```

## Docker Deployment

Build and run:
```bash
docker build -t dealscope-server .
docker run -p 3001:3001 -e DATABASE_URL="..." -e REDIS_URL="..." dealscope-server
```

## Error Handling

All endpoints return structured JSON responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "path": "field", "message": "validation error" }
  ]
}
```

## Development

- `npm run dev` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled code
- `npm run seed` - Populate database with mock data

## Production Checklist

- [ ] Set strong JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Configure PostgreSQL connection for production
- [ ] Set up Redis for caching
- [ ] Enable HTTPS only
- [ ] Configure CORS for your frontend domain
- [ ] Set NODE_ENV=production
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Use environment-specific configurations

## License

MIT
