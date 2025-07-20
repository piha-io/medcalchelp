import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils/cn'

interface VerificationFormProps {
  email: string
  onSubmit: (code: string) => Promise<void>
  onResend: () => Promise<void>
  isLoading?: boolean
}

export function VerificationForm({ email, onSubmit, onResend, isLoading }: VerificationFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedCode.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })
      setCode(newCode)
      
      // Focus last filled input or next empty one
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5)
      inputRefs.current[lastFilledIndex]?.focus()
      
      return
    }

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 5 && newCode.every(digit => digit)) {
      handleSubmit(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (fullCode?: string) => {
    const codeToSubmit = fullCode || code.join('')
    
    if (codeToSubmit.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    try {
      await onSubmit(codeToSubmit)
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
      // Clear code on error
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      await onResend()
      setResendTimer(60)
      setCanResend(false)
      setError('')
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          Enter the 6-digit code sent to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <div>
        <div className="flex justify-center gap-2 sm:gap-3 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={cn(
                "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg border-2 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                error ? "border-red-300" : "border-gray-300",
                digit ? "border-primary-500 bg-primary-50" : ""
              )}
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-600 mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading || code.some(d => !d)}
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
              Verifying...
            </div>
          ) : (
            'Verify & Sign In'
          )}
        </button>
      </div>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline"
          >
            Resend code
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Resend code in {resendTimer}s
          </p>
        )}
      </div>
    </div>
  )
}