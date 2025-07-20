import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { AchievementBadge } from './AchievementBadge'

const ALL_ACHIEVEMENTS = [
  'FIRST_CORRECT',
  'QUESTIONS_10',
  'QUESTIONS_50',
  'QUESTIONS_100',
  'QUESTIONS_500',
  'QUESTIONS_1000',
  'STREAK_3',
  'STREAK_7',
  'STREAK_30',
  'ACCURACY_80',
  'ACCURACY_90',
  'ACCURACY_100',
  'SPEED_DEMON',
  'LEVEL_5',
  'LEVEL_10',
  'LEVEL_25',
  'LEVEL_50',
  'CATEGORY_MASTER',
  'ALL_CATEGORIES',
]

export function AchievementsGrid() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['user', 'achievements'],
    queryFn: async () => {
      const response = await fetch('/api/user/achievements', {
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievements')
      }
      
      const data = await response.json()
      return data.achievements as Array<{ type: string; unlockedAt: string }>
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {ALL_ACHIEVEMENTS.map((type) => (
          <div key={type} className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    )
  }

  const unlockedAchievements = new Map(
    achievements?.map(a => [a.type, new Date(a.unlockedAt)]) || []
  )

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {ALL_ACHIEVEMENTS.map((type) => (
          <AchievementBadge
            key={type}
            type={type}
            unlocked={unlockedAchievements.has(type)}
            unlockedAt={unlockedAchievements.get(type)}
            size="md"
          />
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {unlockedAchievements.size} / {ALL_ACHIEVEMENTS.length} achievements unlocked
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.size / ALL_ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}