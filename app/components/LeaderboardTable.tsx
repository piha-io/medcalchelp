import React from 'react'
import { useLeaderboard, useUserRank, type TimeFrame } from '../lib/hooks/useLeaderboard'
import { useAuth } from '../lib/auth/AuthContext'
import { cn } from '../lib/utils/cn'

interface LeaderboardTableProps {
  timeFrame: TimeFrame
}

export function LeaderboardTable({ timeFrame }: LeaderboardTableProps) {
  const { user } = useAuth()
  const { data: leaderboard, isLoading } = useLeaderboard(timeFrame, 20)
  const { data: userRank } = useUserRank(timeFrame)

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3 p-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500">No data available yet. Be the first to score!</p>
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Player</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Score</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Streak</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Level</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const isCurrentUser = user?.username === entry.username
              
              return (
                <tr 
                  key={entry.rank} 
                  className={cn(
                    'border-b hover:bg-gray-50 transition-colors',
                    isCurrentUser && 'bg-primary-50 hover:bg-primary-100'
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.rank}</span>
                      {getRankIcon(entry.rank) && (
                        <span className="text-xl">{getRankIcon(entry.rank)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'font-medium',
                        isCurrentUser && 'text-primary-700'
                      )}>
                        {entry.username || 'Anonymous'}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-lg">
                      {entry.score.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-orange-500">🔥</span>
                      {entry.streak}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium">
                      {entry.level}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* User Rank Card */}
      {user && userRank && userRank.rank && (
        <div className="card p-6 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Ranking</p>
              <p className="text-2xl font-bold text-primary-700">
                #{userRank.rank} of {userRank.totalPlayers}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className="text-2xl font-bold text-primary-700">
                {userRank.score.toLocaleString()}
              </p>
            </div>
          </div>
          
          {userRank.rank > 20 && (
            <p className="text-sm text-gray-600 mt-4 text-center">
              Keep practicing to climb the leaderboard!
            </p>
          )}
        </div>
      )}
    </div>
  )
}