# DealScope — Real Estate Investor Platform

A full-stack real estate investor platform — a one-stop shop for finding, analyzing, and closing deals. Think Bloomberg terminal meets modern SaaS, built for real estate investors.

![DealScope](https://img.shields.io/badge/DealScope-Real%20Estate%20Intelligence-f59e0b?style=for-the-badge)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Recharts, Zustand, React Query |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens), bcrypt |
| Containerization | Docker & Docker Compose |

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and enter project
cd dealscope

# Copy environment file
cp .env.example .env

# Start everything
docker-compose up --build

# In another terminal, run database migrations
docker exec dealscope-server npx prisma migrate dev --name init
docker exec dealscope-server npx prisma db seed
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Local Development

**Prerequisites:** Node.js 20+, PostgreSQL 15+, Redis 7+

```bash
# Install server dependencies
cd server
npm install
cp ../.env.example .env  # Edit DATABASE_URL and REDIS_URL

# Set up database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start server
npm run dev

# In another terminal, install client dependencies
cd ../client
npm install

# Start client
npm run dev
```

## Features

### Property Search & Discovery
Search by address, city, ZIP, or county with advanced filters (property type, price range, beds/baths, square footage, lot size, year built). Map view and sortable list view.

### Deal Finder — Featured Deals
Auto-curated deals across six categories: FSBO, Foreclosures, Auctions, Short Sales, Bank-Owned (REO), and Tax Lien properties. Each card shows asking price, estimated ARV, potential profit, and days on market.

### Comparable Sales (Comps) Engine
Enter a property address, pull recent sales within a configurable radius, filter by type/size/date, view on a map, and auto-calculate Average Comp Value and Estimated ARV. Export to PDF.

### Deal Calculator Suite

- **Fix & Flip** — Purchase price, ARV, repair costs, financing terms → profit, ROI, max allowable offer (70% rule)
- **Rental / Buy & Hold** — Full cash flow analysis with cap rate, DSCR, 1% rule, gross rent multiplier, and 5/10/30-year projections
- **Wholesale** — ARV, repairs, assignment fee → max offer and end buyer price
- **BRRRR** — Buy, Rehab, Rent, Refinance, Repeat analysis with cash-left-in-deal calculation
- **Mortgage Comparison** — Compare up to 3 loan scenarios side-by-side with full amortization schedules

### Market Analysis Dashboard
Select a market (city or ZIP) to see median home price, price trends, days on market, inventory, rent-to-price ratio, population growth, and a proprietary 1–100 Investor Score.

### User Accounts & Pipeline
JWT-based auth with pipeline tracking: Researching → Analyzing → Making Offer → Under Contract → Closed. Notes, tags, and portfolio summary.

### Real-Time Data Feeds
Current mortgage rates (30yr, 15yr, FHA, VA, hard money), market news, and alerts for new deals in saved markets.

## API Endpoints

```
Auth:        POST /api/auth/register|login|refresh  GET /api/auth/me
Properties:  GET  /api/properties/search|featured|:id|:id/comps
Calculators: POST /api/calculator/flip|rental|wholesale|brrrr|mortgage
Market:      GET  /api/market/:zipcode|compare
Rates:       GET  /api/rates/mortgage
User:        GET|POST|PUT|DELETE /api/user/saved-properties|saved-searches|deal-analyses
```

## Project Structure

```
dealscope/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Layout + reusable UI (Button, Card, Input, Modal, etc.)
│   │   ├── pages/          # Route pages (Dashboard, Search, Calculators, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client functions (Axios)
│   │   ├── store/          # Zustand state (auth, theme, search)
│   │   ├── utils/          # Formatters, constants, helpers
│   │   └── styles/         # Tailwind global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── services/       # Mock data, Redis cache, business logic
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   └── utils/          # JWT helpers
│   ├── prisma/             # Schema + migrations + seed
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Design

- **Dark theme** default with light theme toggle
- Color palette: dark navy background, green for profits, red for losses, gold/amber for CTAs
- Typography: DM Sans
- Responsive: desktop, tablet, mobile
- Loading skeletons for all async data
- Toast notifications

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys. The app works out of the box with mock data — real API keys are optional and can be swapped in later.

## External API Integration

The platform is built with a mock data layer that provides realistic property data, comps, and market stats. When you're ready, swap in live API keys for:

- **Zillow/RapidAPI** — Property data and Zestimates
- **Attom Data** — Tax records, foreclosures, owner info
- **FRED API** — Real-time mortgage rates and economic data
- **Realty Mole** — Rental estimates
- **US Census** — Demographics
- **Mapbox** — Property mapping
- **HUD** — Foreclosure/FHA listings

## License

MIT
