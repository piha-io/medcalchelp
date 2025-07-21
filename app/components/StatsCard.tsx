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
  const [animatedPoints, setAnimatedPoints] = useState(0)

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

  // Animate points counter
  useEffect(() => {
    const targetPoints = user ? (user.profile?.totalPoints || 0) : sessionStats.totalPoints
    const duration = 1000 // 1 second
    const steps = 30
    const increment = (targetPoints - animatedPoints) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setAnimatedPoints(targetPoints)
        clearInterval(timer)
      } else {
        setAnimatedPoints(prev => Math.round(prev + increment))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [user?.profile?.totalPoints, sessionStats.totalPoints])

  // Show guest stats card
  if (!user) {
    const accuracy = sessionStats.totalQuestions > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100)
      : 0

    return (
      <div className="card p-6 glass">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
          Session Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatItem
            icon={<QuestionIcon />}
            label="Questions"
            value={sessionStats.totalQuestions}
            color="primary"
          />
          
          <StatItem
            icon={<CheckIcon />}
            label="Correct"
            value={sessionStats.correctAnswers}
            color="secondary"
          />
          
          <StatItem
            icon={<FireIcon />}
            label="Streak"
            value={sessionStats.currentStreak}
            color="amber"
            highlight={sessionStats.currentStreak >= 3}
          />
          
          <StatItem
            icon={<StarIcon />}
            label="Points"
            value={animatedPoints}
            color="purple"
          />
        </div>

        {/* Accuracy Progress Ring */}
        <div className="flex items-center justify-center mb-6">
          <ProgressRing
            progress={accuracy}
            size={120}
            strokeWidth={8}
            label="Accuracy"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
          <p className="text-sm text-gray-700 mb-2">
            🚀 Track your progress across sessions!
          </p>
          <div className="flex gap-3">
            <Link 
              to="/auth" 
              className="btn btn-primary btn-sm w-full text-center"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Get current level progress
  const currentXP = user.profile?.experience || 0
  const level = user.profile?.level || 1
  const nextLevelXP = level * 1000 // Each level requires level * 1000 XP
  const levelProgress = (currentXP % 1000) / 10 // Progress to next level as percentage

  const achievementCount = stats.achievementCount || 0
  const todayQuestions = stats.todayAttempts || 0

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="card p-6 glass">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
          Your Progress
        </h3>

        {/* Level and XP */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Level {level}</span>
            <span className="text-sm text-gray-500">{currentXP % 1000} / 1000 XP</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000 ease-out"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatItem
            icon={<TrophyIcon />}
            label="Total Points"
            value={animatedPoints}
            color="primary"
            large
          />
          
          <StatItem
            icon={<FireIcon />}
            label="Day Streak"
            value={user.profile?.currentStreak || 0}
            color="amber"
            large
            highlight={user.profile?.currentStreak >= 3}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{todayQuestions}</div>
            <div className="text-xs text-gray-600">Today</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
            <div className="text-2xl font-bold gradient-text">{stats.totalAttempts || 0}</div>
            <div className="text-xs text-gray-600">All Time</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold gradient-text">
              {stats.accuracy ? `${Math.round(stats.accuracy)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Achievements Preview */}
      <div className="card p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Achievements</h4>
          <span className="text-sm text-primary-600">{achievementCount} earned</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {achievementCount > 0 ? (
            <>
              {[...Array(Math.min(3, achievementCount))].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl animate-float"
                >
                  🏆
                </div>
              ))}
              {achievementCount > 3 && (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                  +{achievementCount - 3}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Complete challenges to earn achievements!</p>
          )}
        </div>
      </div>

      {/* Daily Goal */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <h4 className="font-semibold mb-3">Daily Goal</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Complete 10 questions</span>
            <span className="font-medium">{todayQuestions}/10</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (todayQuestions / 10) * 100)}%` }}
            />
          </div>
          {todayQuestions >= 10 && (
            <p className="text-xs text-secondary-600 font-medium">🎉 Goal achieved!</p>
          )}
        </div>
      </div>

      <Link to="/profile" className="btn btn-secondary w-full">
        View Full Profile
      </Link>
    </div>
  )
}

// Reusable stat item component
function StatItem({ 
  icon, 
  label, 
  value, 
  color, 
  large = false,
  highlight = false 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  color: string
  large?: boolean
  highlight?: boolean
}) {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100',
    secondary: 'text-secondary-600 bg-secondary-100',
    amber: 'text-amber-600 bg-amber-100',
    purple: 'text-purple-600 bg-purple-100',
  }[color] || 'text-gray-600 bg-gray-100'

  return (
    <div className={`space-y-1 ${highlight ? 'animate-pulse-glow' : ''}`}>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 ${colorClasses.split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className={`${large ? 'text-3xl' : 'text-2xl'} font-bold ${colorClasses.split(' ')[0]}`}>
        {value}
      </p>
    </div>
  )
}

// Progress ring component
function ProgressRing({ 
  progress, 
  size = 100, 
  strokeWidth = 8,
  label 
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  label: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold gradient-text">{progress}%</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

// Icon components
function QuestionIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function FireIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59-1.81-1.37-2-3.34-1.84-4.75.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54 2.43.31 5.06-.14 6.95-1.87 2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44.35 2.89.35 4.33 0 .41-.1.82.22.82.65 0 .27-.14.52-.36.65-1.66.94-3.58.94-5.24 0-.23-.13-.37-.38-.37-.65 0-.43.41-.75.82-.65z"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}