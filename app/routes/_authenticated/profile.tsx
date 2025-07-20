import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth/AuthContext'
import { useUserStats, useUserAttempts } from '../../lib/hooks/useQuestions'
import { AchievementsGrid } from '../../components/AchievementsGrid'
import { cn } from '../../lib/utils/cn'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const { data: stats } = useUserStats()
  const { data: attempts } = useUserAttempts(5)

  if (!user) {
    return <div>Loading...</div>
  }

  const levelProgress = (user.profile?.experience || 0) % 1000
  const currentLevel = user.profile?.level || 1
  const nextLevel = currentLevel + 1

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            
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
                      {attempt.question.type.replace(/_/g, ' ')} • {attempt.question.difficulty}
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