import React, { useState, useEffect, useRef } from 'react'
import type { GeneratedQuestion } from '../lib/questions/generator'
import { cn } from '../lib/utils/cn'

interface QuestionCardProps {
  question: GeneratedQuestion & { shareableId?: string }
  onSubmit: (answer: number) => Promise<any>
  onUseHint: () => void
  hintsUsed: number
  isSubmitting: boolean
}

export function QuestionCard({ 
  question, 
  onSubmit, 
  onUseHint, 
  hintsUsed,
  isSubmitting 
}: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showShareToast, setShowShareToast] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [question.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const answer = parseFloat(userAnswer)
    
    if (isNaN(answer)) {
      return
    }

    await onSubmit(answer)
  }

  const handleUseHint = () => {
    onUseHint()
    setShowHint(true)
  }

  const handleShare = async () => {
    if (!question.shareableId) return
    
    const shareUrl = `${window.location.origin}/practice?questionId=${question.shareableId}`
    
    try {
      // Check if native share is available
      if ('share' in navigator && typeof (navigator as any).share === 'function') {
        // Use native share API on mobile
        await (navigator as any).share({
          title: 'Medical Calculation Challenge',
          text: `Can you solve this ${question.type.replace(/_/g, ' ').toLowerCase()} problem?`,
          url: shareUrl
        })
      } else if ('clipboard' in navigator && (navigator as any).clipboard) {
        // Copy to clipboard on desktop
        await (navigator as any).clipboard.writeText(shareUrl)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 3000)
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 3000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get category color scheme
  const getCategoryColors = (type: string) => {
    const colorSchemes: Record<string, {
      gradient: string
      bgGradient: string
      iconBg: string
      badge: string
    }> = {
      DOSAGE_CALCULATION: {
        gradient: 'from-blue-400 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100',
        iconBg: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700'
      },
      IV_DRIP_RATE: {
        gradient: 'from-cyan-400 to-teal-600',
        bgGradient: 'from-cyan-50 to-teal-100',
        iconBg: 'bg-teal-500',
        badge: 'bg-teal-100 text-teal-700'
      },
      UNIT_CONVERSION: {
        gradient: 'from-purple-400 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100',
        iconBg: 'bg-purple-500',
        badge: 'bg-purple-100 text-purple-700'
      },
      PEDIATRIC_DOSING: {
        gradient: 'from-pink-400 to-rose-600',
        bgGradient: 'from-pink-50 to-rose-100',
        iconBg: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-700'
      },
      CONCENTRATION: {
        gradient: 'from-emerald-400 to-green-600',
        bgGradient: 'from-emerald-50 to-green-100',
        iconBg: 'bg-green-500',
        badge: 'bg-green-100 text-green-700'
      },
      DIMENSIONAL_ANALYSIS: {
        gradient: 'from-amber-400 to-orange-600',
        bgGradient: 'from-amber-50 to-orange-100',
        iconBg: 'bg-orange-500',
        badge: 'bg-orange-100 text-orange-700'
      }
    }
    return colorSchemes[type] || colorSchemes.DOSAGE_CALCULATION
  }

  const colors = getCategoryColors(question.type)

  return (
    <div className="space-y-6">
      {/* Question Header with colorful design */}
      <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colors.bgGradient} border border-gray-100 shadow-lg`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -mr-16 -mt-16 ${colors.gradient}"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${colors.iconBg} text-white flex items-center justify-center shadow-lg`}>
                <QuestionIcon />
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                  {question.type.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            
            {/* Timer, Share and Points Display */}
            <div className="flex items-center gap-3">
              {/* Share Button */}
              {question.shareableId && (
                <button
                  onClick={handleShare}
                  className="relative bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  title="Share this question"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.562 18 16.018 18 16.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3c.482 0 .938.114 1.342.316m0 0a3 3 0 10-5.368-2.684m5.368 2.684a3 3 0 00-5.368-2.684M3 12a3 3 0 106 0 3 3 0 00-6 0zm18 4.5a3 3 0 10-6 0 3 3 0 006 0zM8.25 7.5a3 3 0 10-6 0 3 3 0 006 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">Share</span>
                  </div>
                </button>
              )}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <TimerIcon />
                    <span className="font-mono font-medium text-gray-700">{formatTime(timeElapsed)}</span>
                  </div>
                </div>
              </div>
              
              {/* Potential Points Display */}
              {question.basePoints && (
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg opacity-20`}></div>
                  <div className="relative bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="font-semibold text-gray-700">{question.basePoints} pts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Question Text with enhanced typography */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-900 text-lg leading-relaxed">{question.questionText}</p>
          </div>
        </div>
      </div>

      {/* Hint Section with colorful design */}
      {question.hints && question.hints.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleUseHint}
              disabled={hintsUsed >= question.hints.length}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                hintsUsed >= question.hints.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              )}
            >
              <LightbulbIcon />
              Use Hint ({hintsUsed}/{question.hints.length})
            </button>
            {hintsUsed > 0 && (
              <span className="text-sm text-gray-500">
                -5 points per hint used
              </span>
            )}
          </div>
          
          {showHint && question.hints.slice(0, hintsUsed).map((hint, index) => (
            <div 
              key={index} 
              className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg animate-slide-in"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer Form with vibrant design */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg opacity-0 group-focus-within:opacity-10 transition-opacity`}></div>
            <input
              ref={inputRef}
              id="answer"
              type="number"
              step="any"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="relative w-full px-4 py-3 text-lg font-medium border-2 border-gray-300 rounded-lg focus:border-transparent focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              placeholder="Enter your answer..."
              disabled={isSubmitting}
              autoFocus
            />
            {question.units && question.units.answer && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {question.units.answer}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!userAnswer || isSubmitting}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform",
            !userAnswer || isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : `bg-gradient-to-r ${colors.gradient} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Checking...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Submit Answer
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}
        </button>
      </form>
      
      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Icon components
function QuestionIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}