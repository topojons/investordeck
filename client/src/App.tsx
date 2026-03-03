import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import PropertySearch from '@/pages/PropertySearch'
import DealFinder from '@/pages/DealFinder'
import CompsEngine from '@/pages/CompsEngine'
import CalculatorSuite from '@/pages/CalculatorSuite'
import CalculatorDetail from '@/pages/CalculatorDetail'
import PropertyDetail from '@/pages/PropertyDetail'
import MarketAnalysis from '@/pages/MarketAnalysis'
import SavedDeals from '@/pages/SavedDeals'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/deals" element={<DealFinder />} />
            <Route path="/comps" element={<CompsEngine />} />
            <Route path="/calculators" element={<CalculatorSuite />} />
            <Route path="/calculators/:type" element={<CalculatorDetail />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/market" element={<MarketAnalysis />} />
            <Route path="/pipeline" element={<SavedDeals />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
