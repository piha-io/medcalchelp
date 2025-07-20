import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useUserStats } from '../lib/hooks/useQuestions'
import { useAuth } from '../lib/auth/AuthContext'

interface SessionStats {
  totalQuestions: number
  correctAnswers: number
  currentStreak: number
  totalPoints: number
}

export function StatsCard() {
  const { user } = useAuth()
  // Only fetch stats if user is authenticated
  const { data: stats, isLoading } = useUserStats(!!user)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    totalPoints: 0,
  })

  // Load session stats from localStorage for guests
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('guestSessionStats')
      if (stored) {
        setSessionStats(JSON.parse(stored))
      }
    }
  }, [user])

  // Listen for session stat updates
  useEffect(() => {
    if (!user) {
      const handleStorageChange = () => {
        const stored = localStorage.getItem('guestSessionStats')
        if (stored) {
          setSessionStats(JSON.parse(stored))
        }
      }

      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])

  // Show guest stats card
  if (!user) {
    const accuracy = sessionStats.totalQuestions > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100)
      : 0

    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="text-sm text-gray-600">Questions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {sessionStats.totalQuestions}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span className="text-sm text-gray-600">Correct</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {sessionStats.correctAnswers}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span className="text-sm text-gray-600">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {accuracy}%
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span className="text-sm text-gray-600">Points</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {sessionStats.totalPoints}
            </p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-800 mb-3">
            Create an account to save your progress!
          </p>
          <Link 
            to="/auth/register" 
            className="btn btn-primary btn-sm w-full text-center"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    )
  }

  // Show loading state for authenticated users
  if (isLoading || !stats) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const statsItems = [
    {
      label: 'Total Points',
      value: user.profile?.totalPoints || 0,
      icon: '🏆',
      color: 'text-yellow-600',
    },
    {
      label: 'Current Streak',
      value: `${user.profile?.currentStreak || 0} days`,
      icon: '🔥',
      color: 'text-orange-600',
    },
    {
      label: 'Level',
      value: user.profile?.level || 1,
      icon: '📈',
      color: 'text-primary-600',
    },
    {
      label: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: '🎯',
      color: 'text-green-600',
    },
    {
      label: 'Questions Solved',
      value: stats.totalAttempts,
      icon: '✅',
      color: 'text-blue-600',
    },
    {
      label: 'Achievements',
      value: stats.achievementCount,
      icon: '🏅',
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statsItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress to next level */}
      {user.profile && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress to Level {(user.profile.level || 1) + 1}</span>
            <span className="font-medium">{user.profile.experience % 1000}/1000 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(user.profile.experience % 1000) / 10}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}