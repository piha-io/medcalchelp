import { useState } from 'react'
import { cn } from '../../lib/utils/cn'

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>
  isLoading?: boolean
}

export function EmailForm({ onSubmit, isLoading }: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await onSubmit(email)
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            error ? "border-red-300" : "border-gray-300"
          )}
          placeholder="you@example.com"
          disabled={isLoading}
          autoFocus
          autoComplete="email"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold text-white transition-all",
          "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transform hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending code...
          </div>
        ) : (
          'Send Verification Code'
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        We'll send you a 6-digit code to verify your email
      </p>
    </form>
  )
}