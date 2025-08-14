import { prisma } from '../../lib/prisma'

export async function getLeaderboard(timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'daily', limit: number = 10) {
  // Calculate date ranges for each timeframe
  const now = new Date()
  let dateFilter: any = {}

  switch (timeFrame) {
    case 'daily':
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dateFilter = {
        attemptedAt: {
          gte: today,
          lt: tomorrow,
        },
      }
      break
    case 'weekly':
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      dateFilter = {
        attemptedAt: {
          gte: weekAgo,
        },
      }
      break
    case 'monthly':
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      monthAgo.setHours(0, 0, 0, 0)
      dateFilter = {
        attemptedAt: {
          gte: monthAgo,
        },
      }
      break
    case 'all-time':
    default:
      // No date filter for all-time
      break
  }

  // For all-time, we can still use the Score table optimization
  if (timeFrame === 'all-time') {
    const scores = await prisma.score.findMany({
      orderBy: { allTimeScore: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: {
                level: true,
                currentStreak: true,
                displayName: true,
              },
            },
          },
        },
      },
    })

    return scores.map((score, index) => ({
      rank: index + 1,
      username: score.user.username,
      displayName: score.user.profile?.displayName,
      score: score.allTimeScore,
      level: score.user.profile?.level || 1,
      streak: score.user.profile?.currentStreak || 0,
    }))
  }

  // For daily, weekly, monthly - calculate from actual attempt data
  const userScores = await prisma.userAttempt.groupBy({
    by: ['userId'],
    where: {
      isCorrect: true,
      ...dateFilter,
    },
    _sum: {
      pointsEarned: true,
    },
    orderBy: {
      _sum: {
        pointsEarned: 'desc',
      },
    },
    take: limit,
  })

  // Get user details
  const userIds = userScores.map(s => s.userId)
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          level: true,
          currentStreak: true,
          displayName: true,
        },
      },
    },
  })

  const userMap = new Map(users.map(u => [u.id, u]))

  return userScores.map((score, index) => {
    const user = userMap.get(score.userId)
    return {
      rank: index + 1,
      username: user?.username || 'Unknown',
      displayName: user?.profile?.displayName,
      score: score._sum.pointsEarned || 0,
      level: user?.profile?.level || 1,
      streak: user?.profile?.currentStreak || 0,
    }
  })
}

export async function getUserRank(userId: string, timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'daily') {
  // For all-time, use the Score table optimization
  if (timeFrame === 'all-time') {
    const userScore = await prisma.score.findUnique({
      where: { userId },
    })

    if (!userScore) {
      return { rank: null, score: 0, totalPlayers: 0 }
    }

    const rank = await prisma.score.count({
      where: {
        allTimeScore: {
          gt: userScore.allTimeScore,
        },
      },
    })

    const totalPlayers = await prisma.score.count()

    return { 
      rank: rank + 1, 
      score: userScore.allTimeScore,
      totalPlayers,
    }
  }

  // Calculate date ranges for each timeframe
  let dateFilter: any = {}

  switch (timeFrame) {
    case 'daily':
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dateFilter = {
        attemptedAt: {
          gte: today,
          lt: tomorrow,
        },
      }
      break
    case 'weekly':
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      dateFilter = {
        attemptedAt: {
          gte: weekAgo,
        },
      }
      break
    case 'monthly':
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      monthAgo.setHours(0, 0, 0, 0)
      dateFilter = {
        attemptedAt: {
          gte: monthAgo,
        },
      }
      break
  }

  // Get user's score for the time period
  const userScore = await prisma.userAttempt.groupBy({
    by: ['userId'],
    where: {
      userId,
      isCorrect: true,
      ...dateFilter,
    },
    _sum: {
      pointsEarned: true,
    },
  })

  const userPoints = userScore[0]?._sum.pointsEarned || 0

  // Count how many users have higher scores
  const higherScores = await prisma.userAttempt.groupBy({
    by: ['userId'],
    where: {
      isCorrect: true,
      ...dateFilter,
    },
    _sum: {
      pointsEarned: true,
    },
    having: {
      pointsEarned: {
        _sum: {
          gt: userPoints,
        },
      },
    },
  })

  // Count total players who have attempts in this time period
  const totalPlayersResult = await prisma.userAttempt.groupBy({
    by: ['userId'],
    where: {
      isCorrect: true,
      ...dateFilter,
    },
    _count: {
      userId: true,
    },
  })

  return {
    rank: userPoints > 0 ? higherScores.length + 1 : null,
    score: userPoints,
    totalPlayers: totalPlayersResult.length,
  }
}

// Reset daily scores (should be called by a cron job)
export async function resetDailyScores() {
  await prisma.score.updateMany({
    data: {
      dailyScore: 0,
      lastResetDaily: new Date(),
    },
  })
}

// Reset weekly scores (should be called by a cron job)
export async function resetWeeklyScores() {
  await prisma.score.updateMany({
    data: {
      weeklyScore: 0,
      lastResetWeekly: new Date(),
    },
  })
}

// Reset monthly scores (should be called by a cron job)
export async function resetMonthlyScores() {
  await prisma.score.updateMany({
    data: {
      monthlyScore: 0,
      lastResetMonthly: new Date(),
    },
  })
}