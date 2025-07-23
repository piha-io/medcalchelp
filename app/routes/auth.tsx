import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { EmailForm } from '../components/auth/EmailForm'
import { VerificationForm } from '../components/auth/VerificationForm'
import { useAuth } from '../lib/auth/AuthContext'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (emailAddress: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddress })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setEmail(emailAddress)
      setStep('verify')
      toast.success('Verification code sent to your email!')
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySubmit = async (code: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      
      // Update auth context
      await login(data.user)
      
      toast.success('Welcome to Learn Med Math!')
      navigate({ to: '/practice' })
    } catch (error: any) {
      throw error // Let VerificationForm handle the error
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    return handleEmailSubmit(email)
  }

  const handleBack = () => {
    setStep('email')
    setEmail('')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Learn Med Math
          </h1>
          <p className="text-gray-600">
            Sign in or create an account to continue
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === 'email' ? (
            <EmailForm 
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
            />
          ) : (
            <>
              <button
                onClick={handleBack}
                className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change email
              </button>
              
              <VerificationForm
                email={email}
                onSubmit={handleVerifySubmit}
                onResend={handleResend}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}