# DealScope Client - Project Structure

Complete breakdown of the React frontend for DealScope real estate investor platform.

## Directory Tree

```
client/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Layout.tsx       # Main app layout with sidebar + header
│   │   ├── Sidebar.tsx      # Navigation sidebar with user menu
│   │   ├── Header.tsx       # Top header with theme toggle and user menu
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.tsx   # Button with variants (primary, secondary, danger, ghost)
│   │       ├── Card.tsx     # Card container with optional header/footer
│   │       ├── Input.tsx    # Text input with label and error states
│   │       ├── Select.tsx   # Dropdown select with icon
│   │       ├── Badge.tsx    # Tag/badge with color variants
│   │       ├── Skeleton.tsx # Loading placeholder with animation
│   │       ├── Modal.tsx    # Modal dialog with overlay
│   │       ├── Toast.tsx    # Toast notification
│   │       └── Tabs.tsx     # Tab navigation component
│   ├── pages/               # Page/route components
│   │   ├── Dashboard.tsx    # Main dashboard with stats and featured deals
│   │   ├── PropertySearch.tsx # Advanced property search with filters
│   │   ├── DealFinder.tsx   # Featured deals carousel
│   │   ├── CompsEngine.tsx  # Comparable market analysis
│   │   ├── CalculatorSuite.tsx # Calculator selection page
│   │   ├── CalculatorDetail.tsx # Individual calculator forms
│   │   ├── PropertyDetail.tsx # Property detail page with history
│   │   ├── MarketAnalysis.tsx # Market trends and rates
│   │   ├── SavedDeals.tsx   # Kanban pipeline for saved properties
│   │   ├── Login.tsx        # Login form
│   │   └── Register.tsx     # Registration form
│   ├── services/            # API service functions
│   │   ├── api.ts          # Axios instance with interceptors
│   │   ├── auth.ts         # Authentication endpoints
│   │   ├── properties.ts   # Property search and details API
│   │   ├── calculator.ts   # Deal calculator API
│   │   ├── market.ts       # Market data API
│   │   └── user.ts         # User profile and saved items API
│   ├── store/              # Zustand state stores
│   │   ├── authStore.ts   # User authentication state
│   │   ├── themeStore.ts  # Theme preference (dark/light)
│   │   └── searchStore.ts # Property search filters and results
│   ├── utils/              # Utility functions
│   │   ├── cn.ts          # Tailwind class merging utility
│   │   ├── formatters.ts  # Number, currency, date formatting
│   │   └── constants.ts   # App-wide constants (property types, states, etc)
│   ├── styles/
│   │   └── index.css      # Global styles with Tailwind directives
│   ├── App.tsx            # Root app component with routing
│   └── main.tsx           # React DOM render entry point
├── index.html             # HTML template with dark theme
├── vite.config.ts         # Vite config with React plugin and API proxy
├── tailwind.config.js     # Tailwind config with custom colors
├── postcss.config.js      # PostCSS config
├── tsconfig.json          # TypeScript config with path aliases
├── tsconfig.node.json     # TypeScript config for Node files
├── package.json           # Dependencies and scripts
├── Dockerfile             # Docker containerization
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore patterns
├── README.md              # Project documentation
└── PROJECT_STRUCTURE.md   # This file
```

## File Count Summary

- **Components**: 11 (3 layout + 8 UI)
- **Pages**: 9
- **Services**: 6
- **Stores**: 3
- **Utils**: 3
- **Config Files**: 8
- **Total Files**: 47+

## Key Technologies

### Dependencies (11)
- react, react-dom
- react-router-dom
- recharts (charts and graphs)
- zustand (state management)
- axios (HTTP client)
- @tanstack/react-query (data fetching)
- lucide-react (icons)
- clsx, tailwind-merge (CSS utilities)
- date-fns (date handling)

### Dev Dependencies (9)
- vite, @vitejs/plugin-react
- typescript
- @types/react, @types/react-dom
- tailwindcss, postcss, autoprefixer
- eslint

## Design System

### Color Palette

**Primary (Navy)**
- 950: #0a0f1e (darkest)
- 900: #111827
- 800: #1a2332

**Accent (Gold)**
- 500: #f59e0b
- 600: #d97706

**Profit (Green)**
- 500: #10b981
- 600: #059669

**Loss (Red)**
- 500: #ef4444
- 600: #dc2626

### Typography
- Font Family: DM Sans (Google Fonts)
- Sizes: sm, md, lg (consistent across components)
- Weights: 400, 500, 600, 700

### Components Pattern

All components follow consistent patterns:

```tsx
// UI Component Pattern
interface ComponentProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
  children: ReactNode
  // ... other props
}

export default function Component({ ... }: ComponentProps) {
  return (
    <element className={cn(baseStyles, variants[variant], sizes[size])}>
      {children}
    </element>
  )
}
```

## Routes Map

```
/                    → Dashboard
/login               → Login
/register            → Register
/search              → Property Search
/deals               → Deal Finder
/comps               → Comps Engine
/calculators         → Calculator Suite
/calculators/:type   → Calculator Detail
/property/:id        → Property Detail
/market              → Market Analysis
/pipeline            → Saved Deals / Pipeline
```

## State Management

### Auth Store
- User info and session token
- Login/logout methods
- Persistent localStorage

### Theme Store
- Dark/light mode toggle
- Persisted to localStorage
- Applied to document.documentElement

### Search Store
- Property search filters
- Search results
- Loading and error states
- Reset and clear methods

## API Integration

All API calls through centralized `api.ts`:

**Features:**
- Base URL from environment
- Auto-adds Authorization header
- Token refresh on 401
- Request/response logging
- Error handling

**Services Structure:**
- Each module handles related endpoints
- TypeScript interfaces for request/response
- Proper error propagation

## Performance Optimizations

1. **Code Splitting** - React Router lazy loading
2. **Data Caching** - React Query with staleTime
3. **Image Optimization** - Lazy loading images
4. **CSS** - Tailwind CSS tree-shaking
5. **Bundle** - Vite production optimization
6. **Skeleton Loaders** - Better perceived performance

## Responsive Design

**Breakpoints:**
- Mobile-first (default)
- `md:` - 768px
- `lg:` - 1024px

**Key Features:**
- Collapsible sidebar on mobile
- Hamburger menu with overlay
- Grid layouts adapt to screen size
- Cards stack on small screens

## Dark Theme Implementation

- HTML root has `dark` class
- Tailwind dark mode via CSS class strategy
- All colors tailored for dark backgrounds
- High contrast for readability
- Gold accents for CTAs

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance
- Alt text on images

## Development Workflow

1. **Setup**: `npm install`
2. **Dev Server**: `npm run dev`
3. **Build**: `npm run build`
4. **Preview**: `npm run preview`

## Best Practices

1. ✅ All code is TypeScript
2. ✅ Components are reusable and focused
3. ✅ Tailwind classes for styling
4. ✅ Proper error handling in services
5. ✅ Loading states with skeletons
6. ✅ Consistent formatting utilities
7. ✅ Environment-based configuration
8. ✅ Proper prop typing with interfaces
9. ✅ Comments for complex logic
10. ✅ Mobile-responsive design

## Future Enhancements

- Add E2E tests with Playwright
- Add unit tests with Vitest
- Implement analytics tracking
- Add real-time notifications with WebSockets
- Multi-language i18n support
- Advanced filtering with facets
- Property image gallery
- Map integration with property locations
- Deal export to PDF
- Team collaboration features
