# DealScope Client - React Frontend

Professional real estate investor platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Property Search** - Advanced filtering and property discovery
- **Deal Finder** - Featured deals with profit analysis
- **Comps Engine** - Comparative market analysis
- **Deal Calculators** - Fix & Flip, Rental, Wholesale, BRRRR analysis
- **Market Analysis** - Real-time market data and trends
- **My Pipeline** - Kanban-style deal pipeline management
- **User Authentication** - Secure login and registration

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd dealscope/client
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build

```bash
npm run build
```

### Docker

```bash
docker build -t dealscope-client .
docker run -p 5173:5173 dealscope-client
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Header.tsx      # Top header bar
│   └── ui/             # UI component library
├── pages/              # Page components (route views)
├── services/           # API client functions
├── store/              # Zustand state management
├── utils/              # Helper functions and constants
├── styles/             # Global CSS and Tailwind directives
└── App.tsx            # Root app component
```

## Available Pages

- `/` - Dashboard
- `/search` - Property Search
- `/deals` - Deal Finder (Featured Deals)
- `/comps` - Comps Engine
- `/calculators` - Calculator Suite
- `/calculators/:type` - Specific Calculator
- `/property/:id` - Property Detail
- `/market` - Market Analysis
- `/pipeline` - My Pipeline (Saved Deals)
- `/login` - Login
- `/register` - Register

## Design System

### Colors

- **Primary**: Dark navy (#0a0f1e, #111827, #1a2332)
- **Accent**: Gold/Amber (#f59e0b, #d97706)
- **Success/Profit**: Green (#10b981, #059669)
- **Error/Loss**: Red (#ef4444, #dc2626)

### Components

All UI components are in `src/components/ui/`:

- `Button` - Primary, secondary, danger, ghost variants
- `Card` - Container with optional header/footer
- `Input` - Text input with label support
- `Select` - Dropdown select
- `Badge` - Tags and labels
- `Modal` - Dialog boxes
- `Toast` - Notifications
- `Tabs` - Tab navigation
- `Skeleton` - Loading placeholders

## State Management

Using Zustand for lightweight state:

- `authStore` - User authentication and session
- `themeStore` - Dark/light theme preference
- `searchStore` - Property search filters and results

## API Integration

All API calls go through `src/services/api.ts`:

- Auto-includes auth token in headers
- Handles token refresh on 401
- Request/response interceptors

Service modules:
- `auth.ts` - Authentication endpoints
- `properties.ts` - Property search and details
- `calculator.ts` - Deal calculation endpoints
- `market.ts` - Market data endpoints
- `user.ts` - User saved properties and searches

## TypeScript

Full TypeScript support with strict mode enabled. All components and functions are typed.

## Dark Theme

The application uses a Bloomberg terminal-inspired dark theme with gold accents. Dark mode is the default and only theme.

## Performance

- React Query for efficient data caching
- Lazy loading with React Router
- Tailwind CSS for optimized styling
- Skeleton loaders for better perceived performance

## Development Tips

1. Use `formatters.ts` utilities for consistent number/currency formatting
2. All components accept `className` prop for Tailwind customization
3. Use `cn()` utility to merge Tailwind classes safely
4. Components follow a consistent pattern with optional props
5. Use TypeScript for better IDE support and type safety

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Follow these guidelines:

1. Use TypeScript for all new code
2. Keep components focused and reusable
3. Use Tailwind classes for styling
4. Add proper error handling in async operations
5. Document complex logic with comments
