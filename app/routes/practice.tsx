import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuestionFlow } from '../lib/hooks/useQuestions'
import { QuestionCard } from '../components/QuestionCard'
import { DimensionalAnalysisCard } from '../components/DimensionalAnalysisCard'
import { ResultCard } from '../components/ResultCard'
import { StatsCard } from '../components/StatsCard'
import { useAuth } from '../lib/auth/AuthContext'

export const Route = createFileRoute('/practice')({
  component: PracticePage,
})

function PracticePage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER')
  
  const {
    question,
    isLoading,
    error,
    hintsUsed,
    showSolution,
    submittedAnswer,
    filters,
    setFilters,
    startQuestion,
    useHint,
    submitAnswer,
    nextQuestion,
    isSubmitting,
    lastResult,
  } = useQuestionFlow()

  // Update filters when category or difficulty changes
  useEffect(() => {
    if (selectedCategory) {
      setFilters({
        type: selectedCategory,
        difficulty,
      })
    }
  }, [selectedCategory, difficulty, setFilters])

  // Start question timer when question loads
  useEffect(() => {
    if (question && !showSolution) {
      startQuestion()
    }
  }, [question, showSolution, startQuestion])

  const handleBack = () => {
    setSelectedCategory(null)
    setFilters({})
  }

  const handleNextQuestion = () => {
    nextQuestion()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-8">Practice Medical Calculations</h1>
          
          {!selectedCategory ? (
            <div className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 px-4 rounded-lg border transition-colors ${
                        difficulty === level
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white border-gray-300 hover:border-primary-600'
                      }`}
                    >
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Choose a Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CategoryButton
                    title="Dosage Calculations"
                    description="Calculate medication doses based on patient needs"
                    icon="💊"
                    onClick={() => setSelectedCategory('DOSAGE_CALCULATION')}
                  />
                  <CategoryButton
                    title="IV Drip Rates"
                    description="Calculate infusion rates and drip factors"
                    icon="💧"
                    onClick={() => setSelectedCategory('IV_DRIP_RATE')}
                  />
                  <CategoryButton
                    title="Unit Conversions"
                    description="Convert between metric and imperial units"
                    icon="🔄"
                    onClick={() => setSelectedCategory('UNIT_CONVERSION')}
                  />
                  <CategoryButton
                    title="Pediatric Dosing"
                    description="Weight-based calculations for children"
                    icon="👶"
                    onClick={() => setSelectedCategory('PEDIATRIC_DOSING')}
                  />
                  <CategoryButton
                    title="Concentration & Dilution"
                    description="Calculate solution concentrations and dilutions"
                    icon="🧪"
                    onClick={() => setSelectedCategory('CONCENTRATION')}
                  />
                  <CategoryButton
                    title="Dimensional Analysis"
                    description="Master the railroad track method for complex calculations"
                    icon="🚂"
                    onClick={() => setSelectedCategory('DIMENSIONAL_ANALYSIS')}
                  />
                  <CategoryButton
                    title="All Categories"
                    description="Practice with random questions from all categories"
                    icon="🎲"
                    onClick={() => setSelectedCategory('ALL')}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Categories
              </button>
              
              {error && (
                <div className="card p-4 bg-error-50 border-error-200 text-error-700">
                  <p>Error loading question: {error.message}</p>
                  <button 
                    onClick={nextQuestion}
                    className="text-sm underline mt-2"
                  >
                    Try another question
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="card p-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="text-gray-500">Loading question...</p>
                  </div>
                </div>
              )}

              {question && !showSolution && (
                question.type === 'DIMENSIONAL_ANALYSIS' ? (
                  <DimensionalAnalysisCard
                    question={question}
                    onSubmit={submitAnswer}
                    onHint={useHint}
                    hintsUsed={hintsUsed}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <QuestionCard
                    question={question}
                    onSubmit={submitAnswer}
                    onUseHint={useHint}
                    hintsUsed={hintsUsed}
                    isSubmitting={isSubmitting}
                  />
                )
              )}

              {showSolution && lastResult && question && submittedAnswer !== null && (
                <ResultCard
                  isCorrect={lastResult.attempt.isCorrect}
                  correctAnswer={lastResult.attempt.correctAnswer}
                  userAnswer={submittedAnswer}
                  pointsEarned={lastResult.attempt.pointsEarned}
                  explanation={lastResult.explanation}
                  question={question}
                  onNextQuestion={handleNextQuestion}
                  isGuest={!user}
                />
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Stats */}
        <div className="lg:col-span-1">
          <StatsCard />
        </div>
      </div>
    </div>
  )
}

function CategoryButton({ 
  title, 
  description, 
  icon, 
  onClick 
}: { 
  title: string
  description: string
  icon: string
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className="card p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary-300"
    >
      <div className="flex items-start space-x-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  )
}