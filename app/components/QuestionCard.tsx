import React, { useState, useEffect } from 'react'
import type { GeneratedQuestion } from '../lib/questions/generator'
import { cn } from '../lib/utils/cn'

interface QuestionCardProps {
  question: GeneratedQuestion
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const difficultyColors = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-orange-100 text-orange-800',
    EXPERT: 'bg-red-100 text-red-800',
  }

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            difficultyColors[question.difficulty as keyof typeof difficultyColors]
          )}>
            {question.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {question.type.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-600">
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{question.title}</h3>
        <p className="text-gray-700 leading-relaxed">{question.questionText}</p>
      </div>

      {/* Hints */}
      {question.hints.length > 0 && (
        <div className="space-y-2">
          {hintsUsed < question.hints.length && !showHint && (
            <button
              type="button"
              onClick={handleUseHint}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Need a hint? ({question.hints.length - hintsUsed} available)
            </button>
          )}
          
          {showHint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Hint {hintsUsed}:</span> {question.hints[hintsUsed - 1]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="block text-sm font-medium mb-2">
            Your Answer
          </label>
          <div className="flex items-center gap-2">
            <input
              id="answer"
              type="number"
              step="any"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="input flex-1"
              disabled={isSubmitting}
              autoFocus
            />
            {question.units.answer && (
              <span className="text-gray-600 font-medium">
                {question.units.answer}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!userAnswer || isSubmitting}
          className="btn btn-primary btn-md w-full"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  )
}