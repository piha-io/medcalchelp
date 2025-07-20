import React from 'react'
import { cn } from '../lib/utils/cn'
import { generateStepByStepSolution } from '../lib/questions/generator'
import type { QuestionTemplate } from '@prisma/client'

interface ResultCardProps {
  isCorrect: boolean
  correctAnswer: number
  userAnswer: number
  pointsEarned: number
  explanation: string
  question: {
    id: string
    type: string
    generatedValues: Record<string, number>
    units: Record<string, string>
  }
  onNextQuestion: () => void
}

export function ResultCard({
  isCorrect,
  correctAnswer,
  userAnswer,
  pointsEarned,
  explanation,
  question,
  onNextQuestion,
}: ResultCardProps) {
  const formatAnswer = (value: number) => {
    // Format to remove trailing zeros
    return parseFloat(value.toFixed(4)).toString()
  }

  // Mock template for step-by-step (in real app, would fetch from DB)
  const mockTemplate = {
    type: question.type,
    units: question.units,
  } as QuestionTemplate

  const steps = generateStepByStepSolution(
    mockTemplate,
    question.generatedValues,
    correctAnswer
  )

  return (
    <div className={cn(
      'card p-6 space-y-6',
      isCorrect ? 'border-success-500 bg-success-50' : 'border-error-500 bg-error-50'
    )}>
      {/* Result Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">
          {isCorrect ? '✅' : '❌'}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        {isCorrect && (
          <p className="text-lg font-medium text-success-700">
            +{pointsEarned} points
          </p>
        )}
      </div>

      {/* Answer Comparison */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600">Your answer:</span>
          <span className={cn(
            'font-semibold',
            isCorrect ? 'text-success-600' : 'text-error-600'
          )}>
            {formatAnswer(userAnswer)} {question.units.answer}
          </span>
        </div>
        
        {!isCorrect && (
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-gray-600">Correct answer:</span>
            <span className="font-semibold text-success-600">
              {formatAnswer(correctAnswer)} {question.units.answer}
            </span>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Explanation</h4>
          <p className="text-gray-700">{explanation}</p>
        </div>

        {/* Step by Step Solution */}
        <div>
          <h4 className="font-semibold mb-3">Step-by-Step Solution</h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  'p-3 rounded-lg',
                  index === steps.length - 1 
                    ? 'bg-primary-100 border border-primary-300' 
                    : 'bg-gray-50'
                )}
              >
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Question Button */}
      <button
        onClick={onNextQuestion}
        className="btn btn-primary btn-md w-full"
      >
        Next Question
      </button>
    </div>
  )
}