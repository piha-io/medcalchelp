import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all-time'

function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily')

  // Mock data for demonstration
  const mockLeaders = [
    { rank: 1, username: 'NurseAce', score: 2450, streak: 15, level: 12 },
    { rank: 2, username: 'MedCalcPro', score: 2380, streak: 8, level: 11 },
    { rank: 3, username: 'QuickCalc', score: 2210, streak: 12, level: 10 },
    { rank: 4, username: 'PrecisionRN', score: 1980, streak: 5, level: 9 },
    { rank: 5, username: 'CalcMaster', score: 1850, streak: 3, level: 8 },
    { rank: 6, username: 'RNStudent', score: 1720, streak: 7, level: 7 },
    { rank: 7, username: 'MedMath', score: 1650, streak: 2, level: 7 },
    { rank: 8, username: 'DoseExpert', score: 1500, streak: 4, level: 6 },
    { rank: 9, username: 'IVSpecialist', score: 1420, streak: 1, level: 6 },
    { rank: 10, username: 'CalcChamp', score: 1350, streak: 6, level: 5 },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      <div className="bg-white rounded-lg shadow-sm border p-2 inline-flex mb-8">
        {(['daily', 'weekly', 'monthly', 'all-time'] as TimeFrame[]).map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              timeFrame === frame
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {frame.charAt(0).toUpperCase() + frame.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {mockLeaders.slice(0, 3).map((leader, index) => (
            <div
              key={leader.rank}
              className={`card p-4 text-center ${
                index === 0 ? 'border-yellow-400 bg-yellow-50' :
                index === 1 ? 'border-gray-400 bg-gray-50' :
                'border-orange-400 bg-orange-50'
              }`}
            >
              <div className={`text-4xl mb-2 ${
                index === 0 ? '🥇' :
                index === 1 ? '🥈' :
                '🥉'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <h3 className="font-bold text-lg">{leader.username}</h3>
              <p className="text-2xl font-bold text-primary-600">{leader.score}</p>
              <p className="text-sm text-gray-600">Level {leader.level}</p>
            </div>
          ))}
        </div>

        {/* Rest of leaderboard */}
        <div className="card">
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
              {mockLeaders.slice(3).map((leader) => (
                <tr key={leader.rank} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{leader.rank}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{leader.username}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">
                    {leader.score}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center">
                      🔥 {leader.streak}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium">
                      {leader.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Your current rank: <span className="font-bold text-primary-600">#42</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Keep practicing to climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  )
}