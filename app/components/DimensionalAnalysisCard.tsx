import React, { useState } from 'react'
import { cn } from '../lib/utils/cn'

interface ConversionFactor {
  from: string
  to: string
  factor: number
  display: string
}

interface DimensionalAnalysisCardProps {
  question: {
    id: string
    type: string
    title: string
    questionText: string
    generatedValues: Record<string, number>
    units: Record<string, string>
    hints: string[]
    conversionFactors?: ConversionFactor[]
  }
  onSubmit: (answer: number) => void
  onHint: () => void
  hintsUsed: number
  isSubmitting: boolean
}

export function DimensionalAnalysisCard({
  question,
  onSubmit,
  onHint,
  hintsUsed,
  isSubmitting,
}: DimensionalAnalysisCardProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [showRailroad, setShowRailroad] = useState(false)
  const [railroadSteps, setRailroadSteps] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const answer = parseFloat(userAnswer)
    if (!isNaN(answer)) {
      onSubmit(answer)
    }
  }

  const buildRailroadTrack = () => {
    const steps: string[] = []
    const values = question.generatedValues
    
    // Build the railroad track based on the question type
    if (question.conversionFactors && question.conversionFactors.length > 0) {
      let currentStep = `${values.value || values.dose || values.weight} ${question.units.value || question.units.dose || question.units.weight}`
      steps.push(currentStep)

      question.conversionFactors.forEach((factor) => {
        currentStep += ` × (${factor.display.split(' = ')[1]} / ${factor.display.split(' = ')[0]})`
        steps.push(currentStep)
      })
    }

    setRailroadSteps(steps)
    setShowRailroad(true)
  }

  return (
    <div className="card p-6 space-y-6">
      {/* Question Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
        <p className="text-gray-700">{question.questionText}</p>
      </div>

      {/* Conversion Factors */}
      {question.conversionFactors && question.conversionFactors.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Conversion Factors:</h4>
          <ul className="space-y-1">
            {question.conversionFactors.map((factor, index) => (
              <li key={index} className="text-blue-800">
                • {factor.display}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Railroad Track Visualization */}
      {!showRailroad && (
        <button
          type="button"
          onClick={buildRailroadTrack}
          className="btn btn-secondary btn-sm"
        >
          Show Railroad Track Method
        </button>
      )}

      {showRailroad && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Railroad Track Method:</h4>
          <div className="space-y-4">
            {railroadSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-gray-400 rounded p-3 font-mono text-sm">
                  {step}
                </div>
                {index < railroadSteps.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 mb-1">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Units on opposite sides of the fraction cancel out!
            </p>
          </div>
        </div>
      )}

      {/* Hints Section */}
      {question.hints.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Hints ({hintsUsed}/{question.hints.length})</h4>
            <button
              onClick={onHint}
              disabled={hintsUsed >= question.hints.length}
              className="btn btn-secondary btn-sm"
            >
              Get Hint
            </button>
          </div>
          {hintsUsed > 0 && (
            <div className="space-y-2">
              {question.hints.slice(0, hintsUsed).map((hint, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <p className="text-sm text-yellow-800">
                    <strong>Hint {index + 1}:</strong> {hint}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="block text-sm font-medium mb-2">
            Your Answer:
          </label>
          <div className="flex gap-2">
            <input
              id="answer"
              type="number"
              step="any"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="input input-lg flex-1"
              disabled={isSubmitting}
              autoFocus
            />
            <span className="flex items-center px-4 bg-gray-100 rounded-lg font-medium">
              {question.units.answer}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!userAnswer || isSubmitting}
          className={cn(
            'btn btn-primary btn-lg w-full',
            isSubmitting && 'loading'
          )}
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </form>

      {/* Method Reminder */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h4 className="font-medium text-primary-900 mb-2">Remember the Steps:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-primary-800">
          <li>Write down what you're looking for (goal unit)</li>
          <li>Start with the given value and unit</li>
          <li>Multiply by conversion factors as fractions</li>
          <li>Arrange so units cancel diagonally</li>
          <li>Multiply all numbers on top, divide by all on bottom</li>
        </ol>
      </div>
    </div>
  )
}