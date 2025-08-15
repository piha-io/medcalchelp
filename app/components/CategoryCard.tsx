import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  Calculator, 
  Droplets, 
  ArrowRightLeft, 
  Baby, 
  Heart, 
  Syringe, 
  Activity, 
  FlaskRound, 
  GitBranch, 
  TestTube, 
  Beaker 
} from 'lucide-react'

export interface CategoryInfo {
  id: string
  title: string
  description: string
  questionCount: number
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
        aria-label={`Practice ${category.title} - ${category.questionCount} questions${category.pointsMultiplier && category.pointsMultiplier > 1 ? `, ${category.pointsMultiplier}x points` : ''}`}
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
      aria-label={`Practice ${category.title} - ${category.questionCount} questions${category.pointsMultiplier && category.pointsMultiplier > 1 ? `, ${category.pointsMultiplier}x points` : ''}`}
    >
      {content}
    </Link>
  )
}
