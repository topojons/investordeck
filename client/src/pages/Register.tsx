import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { register } from '@/services/auth'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      login(response.user, response.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-accent-500">Deal</span>Scope
          </h1>
          <p className="text-gray-400">Real Estate Investor Platform</p>
        </div>

        {/* Register Card */}
        <Card
          header={
            <div className="flex items-center gap-2 text-white">
              <UserPlus size={20} />
              <h2 className="text-lg font-semibold">Create Account</h2>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              variant="primary"
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-500 hover:text-accent-600">
              Sign in
            </Link>
          </p>
        </div>

        {/* Features */}
        <Card className="mt-6 bg-primary-800/50 border-primary-700">
          <div className="space-y-2 text-sm">
            <p className="text-gray-400 font-medium mb-3">Get Started With:</p>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-accent-500">✓</span> Property Search & Analysis
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-accent-500">✓</span> Deal Calculators
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-accent-500">✓</span> Market Insights
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-accent-500">✓</span> Deal Pipeline
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
