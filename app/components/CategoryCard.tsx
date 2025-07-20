import { Link } from '@tanstack/react-router'

export interface CategoryInfo {
  id: string
  title: string
  description: string
  questionCount: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  gradient: string
  bgGradient: string
  iconBg: string
  icon: React.ReactNode
  pointsMultiplier?: number
}

interface CategoryCardProps {
  category: CategoryInfo
  delay?: string
  compact?: boolean
  onClick?: () => void
  selected?: boolean
  stats?: {
    questionsAnswered: number
    accuracy: number
  }
}

export function CategoryCard({ 
  category, 
  delay = '0s', 
  compact = false,
  onClick,
  selected = false,
  stats
}: CategoryCardProps) {
  const content = (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-6 
        transition-all duration-300 border-2
        ${selected 
          ? 'border-primary-500 shadow-2xl scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
        }
        ${compact ? 'bg-white' : `bg-gradient-to-br ${category.bgGradient}`}
      `}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 ${!selected && 'group-hover:scale-150'} transition-transform duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <div className={`
            w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${category.iconBg} 
            text-white flex items-center justify-center shadow-lg
            ${!selected && 'group-hover:scale-110'} transition-transform
          `}>
            {category.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
              {category.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
            <span className={`font-medium bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
              {category.questionCount}+ questions
            </span>
            <div className="flex items-center gap-2">
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${category.difficulty === 'Beginner' && 'bg-green-100 text-green-700'}
                ${category.difficulty === 'Intermediate' && 'bg-amber-100 text-amber-700'}
                ${category.difficulty === 'Advanced' && 'bg-red-100 text-red-700'}
              `}>
                {category.difficulty}
              </span>
              {category.pointsMultiplier && category.pointsMultiplier > 1 && (
                <span className="text-primary-600 font-medium">
                  {category.pointsMultiplier}x pts
                </span>
              )}
            </div>
          </div>
        </div>
        
        {stats && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {stats.questionsAnswered} answered
              </span>
              <span className={`font-medium ${stats.accuracy >= 80 ? 'text-green-600' : stats.accuracy >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {stats.accuracy}% accuracy
              </span>
            </div>
          </div>
        )}
        
        {selected && (
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="block w-full text-left group animate-scale-in focus-ring rounded-2xl"
        style={{ animationDelay: delay }}
        aria-label={`Practice ${category.title} - ${category.questionCount} questions, ${category.difficulty} level${category.pointsMultiplier && category.pointsMultiplier > 1 ? `, ${category.pointsMultiplier}x points` : ''}`}
      >
        {content}
      </button>
    )
  }

  return (
    <Link 
      to="/practice" 
      className="block group animate-scale-in focus-ring rounded-2xl"
      style={{ animationDelay: delay }}
      aria-label={`Practice ${category.title} - ${category.questionCount} questions, ${category.difficulty} level${category.pointsMultiplier && category.pointsMultiplier > 1 ? `, ${category.pointsMultiplier}x points` : ''}`}
    >
      {content}
    </Link>
  )
}

// Category icons
export function DosageIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 8h8v2H4zM4 13h8v2H4zM4 18h8v2H4z"/>
    </svg>
  )
}

export function IVDripIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10c-1.1 0-2 .9-2 2v8h4v-8c0-1.1-.9-2-2-2z"/>
    </svg>
  )
}

export function ConversionIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

export function PediatricIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
    </svg>
  )
}

export function CriticalCareIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
    </svg>
  )
}

export function InsulinIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2c-2.21 0-4 1.79-4 4v6c0 2.21 1.79 4 4 4v2h2v-2h6v2h2v-2c2.21 0 4-1.79 4-4v-6c0-2.21-1.79-4-4-4zM9 4h6v2H9V4zm10 12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v6z"/>
    </svg>
  )
}

export function HeparinIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 5h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v1H8V4c0-.55-.45-1-1-1s-1 .45-1 1v1H3c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1V7h8v1c0 .55.45 1 1 1s1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1zM7 12v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1zm2 1h6v6H9v-6z"/>
    </svg>
  )
}

export function ReconstitutionIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2v5l-1.5 1.5L9 12v10h6V12l3.5-3.5L17 7V2H7zm2 2h6v2.17l1.5 1.5L14 10.17V20h-4v-9.83L7.5 7.67 9 6.17V4z"/>
    </svg>
  )
}