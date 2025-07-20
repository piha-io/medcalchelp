import React from 'react'
import { cn } from '../lib/utils/cn'

interface AchievementBadgeProps {
  type: string
  unlocked: boolean
  unlockedAt?: Date
  size?: 'sm' | 'md' | 'lg'
}

const achievementData: Record<string, { icon: string; title: string; description: string }> = {
  FIRST_CORRECT: { icon: '🎯', title: 'First Steps', description: 'Answer your first question correctly' },
  STREAK_3: { icon: '🔥', title: 'On Fire', description: 'Maintain a 3-day streak' },
  STREAK_7: { icon: '🔥', title: 'Week Warrior', description: 'Maintain a 7-day streak' },
  STREAK_30: { icon: '🔥', title: 'Dedicated Learner', description: 'Maintain a 30-day streak' },
  ACCURACY_80: { icon: '🎯', title: 'Sharp Shooter', description: 'Achieve 80% accuracy' },
  ACCURACY_90: { icon: '🎯', title: 'Precision Master', description: 'Achieve 90% accuracy' },
  ACCURACY_100: { icon: '💯', title: 'Perfect Score', description: 'Achieve 100% accuracy on 20+ questions' },
  SPEED_DEMON: { icon: '⚡', title: 'Speed Demon', description: 'Answer 10 questions in under 30 seconds each' },
  LEVEL_5: { icon: '⭐', title: 'Rising Star', description: 'Reach level 5' },
  LEVEL_10: { icon: '⭐', title: 'Expert', description: 'Reach level 10' },
  LEVEL_25: { icon: '🌟', title: 'Master', description: 'Reach level 25' },
  LEVEL_50: { icon: '✨', title: 'Legend', description: 'Reach level 50' },
  QUESTIONS_10: { icon: '📝', title: 'Getting Started', description: 'Answer 10 questions' },
  QUESTIONS_50: { icon: '📝', title: 'Practice Makes Perfect', description: 'Answer 50 questions' },
  QUESTIONS_100: { icon: '📚', title: 'Century Club', description: 'Answer 100 questions' },
  QUESTIONS_500: { icon: '📚', title: 'Knowledge Seeker', description: 'Answer 500 questions' },
  QUESTIONS_1000: { icon: '🎓', title: 'Scholar', description: 'Answer 1000 questions' },
  CATEGORY_MASTER: { icon: '🏆', title: 'Category Master', description: 'Master all questions in a category' },
  ALL_CATEGORIES: { icon: '👑', title: 'Universal Expert', description: 'Complete questions in all categories' },
}

export function AchievementBadge({ type, unlocked, unlockedAt, size = 'md' }: AchievementBadgeProps) {
  const achievement = achievementData[type] || { icon: '🏅', title: 'Achievement', description: 'Unknown achievement' }
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn(
      'relative group cursor-pointer',
      !unlocked && 'opacity-40 grayscale'
    )}>
      <div className={cn(
        'rounded-full flex items-center justify-center transition-all',
        sizeClasses[size],
        unlocked 
          ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 ring-2 ring-yellow-400 shadow-lg' 
          : 'bg-gray-200 ring-2 ring-gray-300'
      )}>
        <span className="select-none">{achievement.icon}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        <div className="bg-gray-900 text-white rounded-lg p-3 whitespace-nowrap shadow-xl">
          <p className={cn('font-semibold', textSizeClasses[size])}>{achievement.title}</p>
          <p className={cn('text-gray-300', textSizeClasses[size])}>{achievement.description}</p>
          {unlocked && unlockedAt && (
            <p className={cn('text-gray-400 mt-1', textSizeClasses[size])}>
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="border-8 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )
}