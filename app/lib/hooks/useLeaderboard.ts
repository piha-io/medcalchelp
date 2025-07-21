import { useQuery } from '@tanstack/react-query'

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all-time'

interface LeaderboardEntry {
  rank: number
  username: string
  displayName?: string
  score: number
  level: number
  streak: number
}

interface UserRank {
  rank: number | null
  score: number
  totalPlayers: number
}

export function useLeaderboard(timeFrame: TimeFrame = 'daily', limit: number = 10) {
  return useQuery({
    queryKey: ['leaderboard', timeFrame, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeFrame,
        limit: limit.toString(),
      })

      const response = await fetch(`/api/leaderboard?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const data = await response.json()
      return data.leaderboard as LeaderboardEntry[]
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  })
}

export function useUserRank(timeFrame: TimeFrame = 'daily') {
  return useQuery({
    queryKey: ['leaderboard', 'rank', timeFrame],
    queryFn: async () => {
      const params = new URLSearchParams({ timeFrame })
      
      const response = await fetch(`/api/leaderboard/rank?${params}`, {
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user rank')
      }

      return response.json() as Promise<UserRank>
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  })
}