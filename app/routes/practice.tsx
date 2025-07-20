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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
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

  // Category configurations with unique colors
  const categories = [
    {
      id: 'DOSAGE_CALCULATION',
      title: 'Dosage Calculations',
      description: 'Master medication doses',
      icon: <PillIcon />,
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      hoverGradient: 'from-blue-500 to-blue-700',
      shadowColor: 'shadow-blue-500/25',
      stats: '50+ questions',
      difficulty: 'All Levels'
    },
    {
      id: 'IV_DRIP_RATE',
      title: 'IV Drip Rates',
      description: 'Perfect your infusion calculations',
      icon: <DropletIcon />,
      gradient: 'from-cyan-400 to-teal-600',
      bgGradient: 'from-cyan-50 to-teal-100',
      hoverGradient: 'from-cyan-500 to-teal-700',
      shadowColor: 'shadow-cyan-500/25',
      stats: '40+ questions',
      difficulty: 'Intermediate'
    },
    {
      id: 'UNIT_CONVERSION',
      title: 'Unit Conversions',
      description: 'Convert with confidence',
      icon: <ConvertIcon />,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      hoverGradient: 'from-purple-500 to-purple-700',
      shadowColor: 'shadow-purple-500/25',
      stats: '30+ questions',
      difficulty: 'Beginner'
    },
    {
      id: 'PEDIATRIC_DOSING',
      title: 'Pediatric Dosing',
      description: 'Safe calculations for little ones',
      icon: <BabyIcon />,
      gradient: 'from-pink-400 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-100',
      hoverGradient: 'from-pink-500 to-rose-700',
      shadowColor: 'shadow-pink-500/25',
      stats: '25+ questions',
      difficulty: 'Advanced'
    },
    {
      id: 'CONCENTRATION',
      title: 'Concentration & Dilution',
      description: 'Mix solutions accurately',
      icon: <BeakerIcon />,
      gradient: 'from-emerald-400 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100',
      hoverGradient: 'from-emerald-500 to-green-700',
      shadowColor: 'shadow-emerald-500/25',
      stats: '35+ questions',
      difficulty: 'Intermediate'
    },
    {
      id: 'DIMENSIONAL_ANALYSIS',
      title: 'Dimensional Analysis',
      description: 'Master the railroad method',
      icon: <RailroadIcon />,
      gradient: 'from-amber-400 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100',
      hoverGradient: 'from-amber-500 to-orange-700',
      shadowColor: 'shadow-amber-500/25',
      stats: '45+ questions',
      difficulty: 'All Levels'
    },
    {
      id: 'ALL',
      title: 'All Categories',
      description: 'Mix it up for maximum learning',
      icon: <ShuffleIcon />,
      gradient: 'from-primary-400 via-purple-500 to-accent-500',
      bgGradient: 'from-primary-50 via-purple-50 to-accent-50',
      hoverGradient: 'from-primary-500 via-purple-600 to-accent-600',
      shadowColor: 'shadow-purple-500/25',
      stats: '200+ questions',
      difficulty: 'All Levels',
      featured: true
    }
  ]

  const difficultyLevels = [
    { id: 'BEGINNER', label: 'Beginner', color: 'from-green-400 to-green-600', icon: '🌱' },
    { id: 'INTERMEDIATE', label: 'Intermediate', color: 'from-blue-400 to-blue-600', icon: '🌿' },
    { id: 'ADVANCED', label: 'Advanced', color: 'from-purple-400 to-purple-600', icon: '🌳' },
    { id: 'EXPERT', label: 'Expert', color: 'from-red-400 to-red-600', icon: '🔥' }
  ]

  return (
    <div className="space-y-6">
      {/* Background decoration for category selection */}
      {!selectedCategory && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      )}

      {/* Mobile Stats Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="btn btn-secondary w-full justify-between glass"
          aria-expanded={showStats}
          aria-controls="mobile-stats"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
            View Progress & Stats
          </span>
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
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">
            Practice Medical Calculations
          </h1>
          <p className="text-gray-600 mb-8">Choose your challenge and start mastering med math!</p>
          
          {!selectedCategory ? (
            <div className="space-y-8">
              {/* Difficulty Selector with enhanced visuals */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900 flex items-center gap-2" id="difficulty-label">
                  <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse"></span>
                  Select Your Skill Level
                </label>
                <div 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  role="radiogroup"
                  aria-labelledby="difficulty-label"
                >
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setDifficulty(level.id as any)}
                      className={`relative py-4 px-4 rounded-xl border-2 transition-all font-medium transform hover:scale-105 ${
                        difficulty === level.id
                          ? 'border-transparent shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                      role="radio"
                      aria-checked={difficulty === level.id}
                    >
                      {difficulty === level.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${level.color} rounded-xl opacity-90`}></div>
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="text-2xl">{level.icon}</span>
                        <span className={difficulty === level.id ? 'text-white font-semibold' : 'text-gray-700'}>
                          {level.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection with vibrant cards */}
              <div>
                <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-accent-400 rounded-full animate-pulse"></span>
                  Choose Your Practice Category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {categories.map((category, index) => (
                    <CategoryButton
                      key={category.id}
                      {...category}
                      onClick={() => setSelectedCategory(category.id)}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      isHovered={hoveredCategory === category.id}
                      delay={index * 0.1}
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

function CategoryButton({ 
  title, 
  description, 
  icon, 
  gradient,
  bgGradient,
  hoverGradient,
  shadowColor,
  stats,
  difficulty,
  featured = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  delay
}: { 
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  bgGradient: string
  hoverGradient: string
  shadowColor: string
  stats: string
  difficulty: string
  featured?: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  isHovered: boolean
  delay: number
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative group transform transition-all duration-300 hover:scale-105 animate-scale-in ${
        featured ? 'sm:col-span-2' : ''
      }`}
      style={{ animationDelay: `${delay}s` }}
      aria-label={`Practice ${title} - ${description}`}
    >
      <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-left border-2 ${
        isHovered ? 'border-transparent' : 'border-gray-100'
      } ${shadowColor} ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}></div>
        
        {/* Animated background shapes */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full opacity-20 blur-2xl transition-all duration-500 ${
          isHovered ? 'scale-150 opacity-30' : ''
        }`}></div>
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr ${gradient} rounded-full opacity-20 blur-2xl transition-all duration-700 ${
          isHovered ? 'scale-150 opacity-30' : ''
        }`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${
              isHovered ? hoverGradient : gradient
            } flex items-center justify-center flex-shrink-0 shadow-lg transform transition-all duration-300 ${
              isHovered ? 'scale-110 rotate-3' : ''
            }`}>
              <div className="w-8 h-8 text-white">
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg sm:text-xl mb-1 transition-colors duration-300 ${
                isHovered ? 'text-gray-900' : 'text-gray-800'
              }`}>{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          
          {/* Stats badges */}
          <div className="flex items-center gap-3 mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow-sm`}>
              {stats}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200">
              {difficulty}
            </span>
          </div>
          
          {featured && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg animate-pulse">
                RECOMMENDED
              </span>
            </div>
          )}
        </div>
        
        {/* Hover arrow indicator */}
        <div className={`absolute bottom-4 right-4 transform transition-all duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`}>
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  )
}

// Icon Components with enhanced styles
function PillIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

function DropletIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function ConvertIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  )
}

function BabyIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function BeakerIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-5 0v5.172a2 2 0 00.586 1.414l1 1a2 2 0 012.828 0l1-1A2 2 0 0015 8.172V3m-6 9l3 3m-3-3l-3 3m3-3v9m3-9l3 3m-3-3v9" />
    </svg>
  )
}

function RailroadIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}