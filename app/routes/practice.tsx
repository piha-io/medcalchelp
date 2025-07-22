import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuestionFlow } from '../lib/hooks/useQuestions'
import { QuestionCard } from '../components/QuestionCard'
import { DimensionalAnalysisCard } from '../components/DimensionalAnalysisCard'
import { ResultCard } from '../components/ResultCard'
import { StatsCard } from '../components/StatsCard'
import { CategoryCard } from '../components/CategoryCard'
import { categories } from '../lib/categories'
import { useAuth } from '../lib/auth/AuthContext'
import { useAnalytics } from '../lib/analytics/analytics'
import { useEngagementTracking } from '../lib/analytics/useEngagementTracking'

export const Route = createFileRoute('/practice')({
  component: PracticePage,
})

function PracticePage() {
  const { user } = useAuth()
  const { trackCategorySelected } = useAnalytics()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  // Track user engagement on practice page
  useEngagementTracking({
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackIdleTime: true,
    idleThreshold: 60000, // 1 minute for practice page
  })
  
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

  // Update filters when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilters({
        type: selectedCategory,
      })
    }
  }, [selectedCategory, setFilters])

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

  // Add ALL category to the imported categories
  const practiceCategories = [
    ...categories,
    {
      id: 'ALL',
      title: 'All Categories',
      description: 'Mix it up for maximum learning',
      questionCount: 200,
      difficulty: 'Beginner' as const,
      gradient: 'from-primary-400 via-purple-500 to-accent-500',
      bgGradient: 'from-primary-50 via-purple-50 to-accent-50',
      iconBg: 'bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500',
      icon: <ShuffleIcon />,
      pointsMultiplier: 1
    }
  ]


  return (
    <div className="space-y-6">

      {/* Mobile Stats Toggle - Compact */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
          aria-expanded={showStats}
          aria-controls="mobile-stats"
        >
          <span className="font-medium text-gray-900 text-sm">Your Stats</span>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary-600 font-bold">{user.profile?.totalPoints || 0} pts</span>
                <span className="text-gray-400">•</span>
                <span className="text-amber-600 font-medium">🔥 {user.profile?.currentStreak || 0}</span>
              </div>
            )}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showStats ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {showStats && (
          <div id="mobile-stats" className="mt-3 animate-slide-in">
            <StatsCard />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 text-gray-900">
            Practice Medical Calculations
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Choose your challenge and start mastering med math!</p>
          
          {!selectedCategory ? (
            <div className="space-y-8">
              {/* Category Selection */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-accent-400 rounded-full animate-pulse"></span>
                  Choose Your Practice Category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  {practiceCategories.map((category, index) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        trackCategorySelected(category.id, category.questionCount)
                      }}
                      selected={selectedCategory === category.id}
                      delay={`${index * 0.1}s`}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <nav aria-label="Breadcrumb">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium focus-ring rounded-md group"
                >
                  <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Categories
                </button>
              </nav>
              
              {error && (
                <div className="alert alert-error animate-shake" role="alert">
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
                <div className="card p-12 bg-gradient-to-br from-primary-50 to-secondary-50">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading your challenge...</p>
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

// Removed CategoryButton - using shared CategoryCard component instead

// Icon for shuffle/all categories
function ShuffleIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}