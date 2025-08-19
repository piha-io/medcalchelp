import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { LeaderboardTable } from '../components/LeaderboardTable'
import type { TimeFrame } from '../lib/hooks/useLeaderboard'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily')

  return (
    <div className="container-app py-4 sm:py-6 lg:py-8">
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

      <LeaderboardTable timeFrame={timeFrame} />
      </div>
    </div>
  )
}