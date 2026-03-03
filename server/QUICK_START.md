# DealScope Backend - Quick Start Guide

Get the DealScope backend running in minutes.

## Option 1: Docker Compose (Recommended)

The easiest way to run the complete stack with PostgreSQL and Redis.

### Prerequisites
- Docker and Docker Compose installed

### Setup

1. **Start all services:**
   ```bash
   docker-compose up
   ```

   This starts:
   - PostgreSQL database (port 5432)
   - Redis cache (port 6379)
   - Node.js app (port 3001)

2. **Initialize database** (in another terminal):
   ```bash
   docker-compose exec app npm run prisma:migrate
   docker-compose exec app npm run seed
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

   You should see:
   ```json
   {
     "success": true,
     "message": "DealScope API is running",
     "timestamp": "2024-03-01T10:00:00Z"
   }
   ```

4. **Shut down:**
   ```bash
   docker-compose down
   ```

---

## Option 2: Local Development

Run services locally for faster development.

### Prerequisites

- Node.js 20+
- PostgreSQL 12+ (running locally)
- Redis 6+ (optional, but recommended)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dealscope"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your-secret-key"
   JWT_REFRESH_SECRET="your-refresh-key"
   NODE_ENV="development"
   PORT=3001
   ```

3. **Start PostgreSQL** (if not running):
   ```bash
   # macOS with Homebrew
   brew services start postgresql

   # Ubuntu with systemd
   sudo systemctl start postgresql

   # Or use Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

4. **Start Redis** (if not running):
   ```bash
   # macOS with Homebrew
   brew services start redis

   # Ubuntu with systemd
   sudo systemctl start redis-server

   # Or use Docker
   docker run --name redis -p 6379:6379 -d redis:7
   ```

5. **Initialize database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

   Server should output:
   ```
   DealScope API running on port 3001
   Environment: development
   ```

7. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

---

## First API Calls

### 1. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@example.com",
    "password": "SecurePassword123!",
    "name": "John Investor"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "email": "investor@example.com", "name": "John Investor" },
    "accessToken": "eyJ0eXA...",
    "refreshToken": "eyJ0eXA..."
  }
}
```

Save the `accessToken` for authenticated requests.

### 2. Search Properties

```bash
curl "http://localhost:3001/api/properties/search?city=Atlanta&minPrice=150000&maxPrice=300000&beds=3"
```

### 3. Run a Calculator

```bash
curl -X POST http://localhost:3001/api/calculator/flip \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "purchasePrice": 150000,
    "repairCosts": 75000,
    "closingCosts": 4500,
    "holdingCosts": 2500,
    "afterRepairValue": 285000
  }'
```

### 4. Get Market Data

```bash
curl "http://localhost:3001/api/market/30309"
```

### 5. Get Mortgage Rates

```bash
curl "http://localhost:3001/api/rates/mortgage"
```

---

## Common Commands

### Development

```bash
# Start with hot reload
npm run dev

# Build TypeScript
npm run build

# Run built code
npm run start
```

### Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed
```

---

## File Structure Overview

```
server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── middleware/
│   │   ├── auth.ts           # JWT middleware
│   │   └── errorHandler.ts   # Global error handling
│   ├── routes/               # API routes
│   │   ├── auth.ts           # Authentication
│   │   ├── calculator.ts     # All 5 calculators
│   │   ├── properties.ts     # Property search
│   │   ├── market.ts         # Market data
│   │   ├── rates.ts          # Mortgage rates
│   │   └── user.ts           # User management
│   ├── services/
│   │   ├── mockData.ts       # Mock data generators
│   │   └── cache.ts          # Redis caching
│   └── utils/
│       └── jwt.ts            # JWT utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── Dockerfile                # Docker config
└── docker-compose.yml        # Docker Compose config
```

---

## What's Included

### 5 Real Estate Calculators

1. **Flip Calculator** - Fix & flip profitability (70% rule)
2. **Rental Calculator** - Rental property analysis with cash flow
3. **Wholesale Calculator** - Quick wholesale deal evaluation
4. **BRRRR Calculator** - Buy-Rehab-Rent-Refinance-Repeat
5. **Mortgage Calculator** - Compare up to 3 loan scenarios

### Features

- User authentication with JWT
- Property search and details
- Comparable properties analysis
- Market data and trends
- Mortgage rates lookup
- Save properties and searches
- Saved deal analyses
- Redis caching (with graceful fallback)
- Rate limiting
- Comprehensive error handling
- Mock data (15+ properties, featured deals, market data)

---

## Troubleshooting

### Port Already in Use

```bash
# Change PORT in .env
PORT=3002

# Or kill the process using port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

Check your DATABASE_URL in .env:
```
postgresql://username:password@localhost:5432/dealscope
```

### Redis Connection Error

Redis is optional. The app will work without it but won't cache.

If you want Redis working:
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Prisma Migration Issues

Reset and recreate database:
```bash
npm run prisma:migrate reset
npm run seed
```

### TypeScript Compilation Error

Clear and rebuild:
```bash
rm -rf dist/
npm run build
```

---

## Next Steps

1. **Review API Documentation**: See `API_DOCUMENTATION.md` for all endpoints
2. **Explore Mock Data**: Check `src/services/mockData.ts` for sample data
3. **Customize Calculators**: Modify formulas in `src/routes/calculator.ts`
4. **Connect Frontend**: Use the `/api` endpoints from your frontend app
5. **Add Database**: Replace mock data with real database queries

---

## Performance Tips

- All calculator endpoints automatically save results to database
- Market data and rates are served from mock data (add caching for real data)
- Use pagination for property searches and user lists
- Redis caching reduces database calls (optional but recommended)
- Rate limiting prevents abuse (100 requests per 15 minutes per IP)

---

## Support

For detailed API documentation, see `API_DOCUMENTATION.md`

For setup help, check `README.md`

For issues or questions, review the code comments throughout the project.
