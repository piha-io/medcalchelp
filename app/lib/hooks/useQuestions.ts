import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { GeneratedQuestion } from '../questions/generator'
import toast from 'react-hot-toast'

interface QuestionFilters {
  type?: string
  category?: string
  difficulty?: string
}

interface SubmitAnswerData {
  questionId: string
  generatedValues: Record<string, number>
  userAnswer: number
  timeSpent: number
  hintsUsed: number
}

interface AnswerResult {
  attempt: {
    id: string
    isCorrect: boolean
    correctAnswer: number
    pointsEarned: number
  }
  explanation: string
}

// Fetch a random question
export function useRandomQuestion(filters: QuestionFilters) {
  return useQuery({
    queryKey: ['question', 'random', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)

      const response = await fetch(`/api/questions/random?${params}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch question')
      }

      const data = await response.json()
      return data.question as GeneratedQuestion
    },
    staleTime: 0, // Always fetch fresh questions
    gcTime: 0, // Don't cache questions
  })
}

// Submit answer mutation
export function useSubmitAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubmitAnswerData) => {
      const response = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit answer')
      }

      const result = await response.json()
      return result as AnswerResult & { isGuest?: boolean }
    },
    onSuccess: (data) => {
      // Update guest session stats if user is not authenticated
      if (data.isGuest) {
        const stored = localStorage.getItem('guestSessionStats')
        const stats = stored ? JSON.parse(stored) : {
          totalQuestions: 0,
          correctAnswers: 0,
          currentStreak: 0,
          totalPoints: 0,
        }
        
        stats.totalQuestions += 1
        if (data.attempt.isCorrect) {
          stats.correctAnswers += 1
          stats.currentStreak += 1
          stats.totalPoints += data.attempt.pointsEarned
        } else {
          stats.currentStreak = 0
        }
        
        localStorage.setItem('guestSessionStats', JSON.stringify(stats))
        // Trigger storage event for StatsCard
        window.dispatchEvent(new Event('storage'))
      } else {
        // Invalidate stats and attempts queries for authenticated users
        queryClient.invalidateQueries({ queryKey: ['user', 'stats'] })
        queryClient.invalidateQueries({ queryKey: ['user', 'attempts'] })
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      }

      if (data.attempt.isCorrect) {
        toast.success(`Correct! +${data.attempt.pointsEarned} points`)
      } else {
        toast.error('Incorrect answer')
      }
    },
  })
}

// Fetch question categories
export function useQuestionCategories() {
  return useQuery({
    queryKey: ['questions', 'categories'],
    queryFn: async () => {
      const response = await fetch('/api/questions/categories', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      return data.categories as Record<string, Record<string, number>>
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

// Fetch user attempts
export function useUserAttempts(limit: number = 10) {
  return useQuery({
    queryKey: ['user', 'attempts', limit],
    queryFn: async () => {
      const response = await fetch(`/api/questions/attempts?limit=${limit}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch attempts')
      }

      const data = await response.json()
      return data.attempts
    },
  })
}

// Fetch user stats
export function useUserStats(enabled: boolean = true) {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/questions/stats', {
        credentials: 'include',
      })

      if (!response.ok) {
        // Return default stats for non-authenticated users
        return {
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: 0,
          averageTime: 0,
          achievementCount: 0
        }
      }

      const data = await response.json()
      return data.stats
    },
    enabled, // Only run query if enabled
  })
}

// Custom hook for managing the question flow
export function useQuestionFlow() {
  const [filters, setFilters] = useState<QuestionFilters>({})
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null)

  const questionQuery = useRandomQuestion(filters)
  const submitMutation = useSubmitAnswer()

  const startQuestion = useCallback(() => {
    setStartTime(Date.now())
    setHintsUsed(0)
    setShowSolution(false)
    setSubmittedAnswer(null)
  }, [])

  const useHint = useCallback(() => {
    setHintsUsed(prev => prev + 1)
  }, [])

  const submitAnswer = useCallback(async (userAnswer: number) => {
    if (!questionQuery.data || !startTime) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    setSubmittedAnswer(userAnswer)

    const result = await submitMutation.mutateAsync({
      questionId: questionQuery.data.id,
      generatedValues: questionQuery.data.generatedValues,
      userAnswer,
      timeSpent,
      hintsUsed,
    })

    setShowSolution(true)
    return result
  }, [questionQuery.data, startTime, hintsUsed, submitMutation])

  const nextQuestion = useCallback(() => {
    questionQuery.refetch()
    startQuestion()
  }, [questionQuery, startQuestion])

  return {
    question: questionQuery.data,
    isLoading: questionQuery.isLoading,
    error: questionQuery.error,
    hintsUsed,
    showSolution,
    submittedAnswer,
    filters,
    setFilters,
    startQuestion,
    useHint,
    submitAnswer,
    nextQuestion,
    isSubmitting: submitMutation.isPending,
    lastResult: submitMutation.data,
  }
}