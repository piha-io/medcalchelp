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
  const [showStats, setShowStats] = useState(false)
  
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
    <div className="space-y-6">
      {/* Mobile Stats Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="btn btn-secondary w-full justify-between"
          aria-expanded={showStats}
          aria-controls="mobile-stats"
        >
          <span>View Progress & Stats</span>
          <svg
            className={`w-5 h-5 transition-transform ${showStats ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showStats && (
          <div id="mobile-stats" className="mt-4 animate-slide-in">
            <StatsCard />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-6 text-gray-900">
            Practice Medical Calculations
          </h1>
          
          {!selectedCategory ? (
            <div className="space-y-6">
              {/* Difficulty Selector */}
              <div className="space-y-3">
                <label className="label" id="difficulty-label">
                  Select Difficulty Level
                </label>
                <div 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  role="radiogroup"
                  aria-labelledby="difficulty-label"
                >
                  {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 px-4 rounded-lg border transition-all font-medium ${
                        difficulty === level
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                      }`}
                      role="radio"
                      aria-checked={difficulty === level}
                    >
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Choose a Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CategoryButton
                    title="Dosage Calculations"
                    description="Calculate medication doses based on patient needs"
                    icon={<PillIcon />}
                    onClick={() => setSelectedCategory('DOSAGE_CALCULATION')}
                  />
                  <CategoryButton
                    title="IV Drip Rates"
                    description="Calculate infusion rates and drip factors"
                    icon={<DropletIcon />}
                    onClick={() => setSelectedCategory('IV_DRIP_RATE')}
                  />
                  <CategoryButton
                    title="Unit Conversions"
                    description="Convert between metric and imperial units"
                    icon={<ConvertIcon />}
                    onClick={() => setSelectedCategory('UNIT_CONVERSION')}
                  />
                  <CategoryButton
                    title="Pediatric Dosing"
                    description="Weight-based calculations for children"
                    icon={<BabyIcon />}
                    onClick={() => setSelectedCategory('PEDIATRIC_DOSING')}
                  />
                  <CategoryButton
                    title="Concentration & Dilution"
                    description="Calculate solution concentrations and dilutions"
                    icon={<BeakerIcon />}
                    onClick={() => setSelectedCategory('CONCENTRATION')}
                  />
                  <CategoryButton
                    title="Dimensional Analysis"
                    description="Master the railroad track method"
                    icon={<RailroadIcon />}
                    onClick={() => setSelectedCategory('DIMENSIONAL_ANALYSIS')}
                  />
                  <CategoryButton
                    title="All Categories"
                    description="Practice with random questions"
                    icon={<ShuffleIcon />}
                    onClick={() => setSelectedCategory('ALL')}
                    featured
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <nav aria-label="Breadcrumb">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium focus-ring rounded-md"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Categories
                </button>
              </nav>
              
              {error && (
                <div className="alert alert-error" role="alert">
                  <div>
                    <p className="font-medium">Error loading question</p>
                    <p className="text-sm mt-1">{error.message}</p>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="btn btn-sm btn-error mt-2"
                  >
                    Try another question
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="card p-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="spinner"></div>
                    <p className="text-gray-500">Loading question...</p>
                  </div>
                </div>
              )}

              {question && !showSolution && (
                <div className="animate-fade-in">
                  {question.type === 'DIMENSIONAL_ANALYSIS' ? (
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
                  )}
                </div>
              )}

              {showSolution && lastResult && question && submittedAnswer !== null && (
                <div className="animate-slide-up">
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
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Sidebar - Stats */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <StatsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryButton({ 
  title, 
  description, 
  icon, 
  onClick,
  featured = false
}: { 
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  featured?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`card p-5 sm:p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1 focus-ring ${
        featured ? 'border-primary-300 bg-primary-50 hover:bg-primary-100' : ''
      }`}
      aria-label={`Practice ${title} - ${description}`}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          featured ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  )
}

// Icon Components
function PillIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

function DropletIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function ConvertIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  )
}

function BabyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function BeakerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

function RailroadIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}