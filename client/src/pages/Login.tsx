import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { login } from '@/services/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login: setLogin } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(formData)
      setLogin(response.user, response.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
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

        {/* Login Card */}
        <Card
          header={
            <div className="flex items-center gap-2 text-white">
              <LogIn size={20} />
              <h2 className="text-lg font-semibold">Sign In</h2>
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

            <Button
              variant="primary"
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-accent-500 hover:text-accent-600 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-500 hover:text-accent-600">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-primary-800/50 border-primary-700">
          <p className="text-xs text-gray-400 mb-3">Demo Credentials:</p>
          <div className="text-sm space-y-1">
            <p className="text-gray-300">
              Email: <span className="text-accent-500 font-mono">demo@dealscope.com</span>
            </p>
            <p className="text-gray-300">
              Password: <span className="text-accent-500 font-mono">demo123456</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
