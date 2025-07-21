import { prisma } from '../../lib/prisma'

export async function getLeaderboard(timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'daily', limit: number = 10) {
  let orderBy: any = {}
  switch (timeFrame) {
    case 'daily':
      orderBy = { dailyScore: 'desc' }
      break
    case 'weekly':
      orderBy = { weeklyScore: 'desc' }
      break
    case 'monthly':
      orderBy = { monthlyScore: 'desc' }
      break
    case 'all-time':
    default:
      orderBy = { allTimeScore: 'desc' }
  }

  const scores = await prisma.score.findMany({
    orderBy,
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

  const leaderboard = scores.map((score, index) => ({
    rank: index + 1,
    username: score.user.username,
    displayName: score.user.profile?.displayName,
    score: score[`${timeFrame === 'all-time' ? 'allTime' : timeFrame}Score`] as number,
    level: score.user.profile?.level || 1,
    streak: score.user.profile?.currentStreak || 0,
  }))

  return leaderboard
}

export async function getUserRank(userId: string, timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'daily') {
  const userScore = await prisma.score.findUnique({
    where: { userId },
  })

  if (!userScore) {
    return { rank: null, score: 0, totalPlayers: 0 }
  }

  let scoreField: keyof typeof userScore
  switch (timeFrame) {
    case 'daily':
      scoreField = 'dailyScore'
      break
    case 'weekly':
      scoreField = 'weeklyScore'
      break
    case 'monthly':
      scoreField = 'monthlyScore'
      break
    case 'all-time':
    default:
      scoreField = 'allTimeScore'
  }

  const rank = await prisma.score.count({
    where: {
      [scoreField]: {
        gt: userScore[scoreField],
      },
    },
  })

  const totalPlayers = await prisma.score.count()

  return { 
    rank: rank + 1, 
    score: userScore[scoreField] as number,
    totalPlayers,
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