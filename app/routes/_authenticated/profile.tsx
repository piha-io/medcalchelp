import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth/AuthContext'
import { useUserStats, useUserAttempts } from '../../lib/hooks/useQuestions'
import { AchievementsGrid } from '../../components/AchievementsGrid'
import { cn } from '../../lib/utils/cn'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { data: stats } = useUserStats()
  const { data: attempts } = useUserAttempts(5)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    return <div>Loading...</div>
  }

  const levelProgress = (user.profile?.experience || 0) % 1000
  const currentLevel = user.profile?.level || 1
  const nextLevel = currentLevel + 1

  const handleSave = async () => {
    setError('')
    setIsSaving(true)
    
    try {
      const updates: any = {}
      
      // Only include fields that have changed
      if (displayName && displayName !== user.profile?.displayName) {
        updates.displayName = displayName
      }
      
      if (username && username !== user.username) {
        updates.username = username
      }
      
      if (Object.keys(updates).length === 0) {
        setIsEditing(false)
        return
      }
      
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }
      
      // Update local user state
      updateUser(data.user)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setDisplayName('')
    setUsername('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={user.profile?.displayName || 'Enter display name'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">This name will be shown on the leaderboard</p>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={user.username || 'Enter username'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only</p>
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {user.profile?.displayName || user.username || 'Anonymous'}
                  </h1>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setDisplayName(user.profile?.displayName || '')
                      setUsername(user.username || '')
                      setError('')
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
                {user.profile?.displayName && user.username && (
                  <p className="text-gray-600 text-sm">@{user.username}</p>
                )}
                <p className="text-gray-600">{user.email}</p>
              </div>
            )}
            
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-primary-600">
                  {user.profile?.totalPoints || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">
                  🔥 {user.profile?.currentStreak || 0} days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-purple-600">
                  🏆 {user.profile?.longestStreak || 0} days
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <span className="text-3xl font-bold">LVL {currentLevel}</span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-600">Next level</p>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${levelProgress / 10}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{levelProgress}/1000 XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="📝"
            label="Total Questions"
            value={stats.totalAttempts}
            color="text-blue-600"
          />
          <StatCard
            icon="✅"
            label="Correct Answers"
            value={stats.correctAttempts}
            color="text-green-600"
          />
          <StatCard
            icon="🎯"
            label="Accuracy"
            value={`${stats.accuracy}%`}
            color="text-purple-600"
          />
          <StatCard
            icon="⏱️"
            label="Avg. Time"
            value={`${Math.round(stats.averageTime)}s`}
            color="text-orange-600"
          />
        </div>
      )}

      {/* Recent Activity */}
      {attempts && attempts.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {attempts.map((attempt: any) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {attempt.isCorrect ? '✅' : '❌'}
                  </span>
                  <div>
                    <p className="font-medium">{attempt.question.title}</p>
                    <p className="text-sm text-gray-600">
                      {attempt.question.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-semibold',
                    attempt.isCorrect ? 'text-green-600' : 'text-red-600'
                  )}>
                    {attempt.isCorrect ? `+${attempt.pointsEarned} pts` : 'Try again'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attempt.attemptedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card p-6">
        <AchievementsGrid />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: string
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="card p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
    </div>
  )
}