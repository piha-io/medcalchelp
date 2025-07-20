import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface CelebrationProps {
  show: boolean
  points: number
  onComplete?: () => void
}

export function Celebration({ show, points, onComplete }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        color: ['#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#f59e0b'][Math.floor(Math.random() * 5)]
      }))
      setParticles(newParticles)

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 animate-confetti"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `confetti ${2 + Math.random()}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Success message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-bounce-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform scale-100">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center animate-pulse-glow">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 gradient-text-vibrant">Correct!</h2>
            <p className="text-4xl font-bold text-gray-900 animate-scale-in">+{points} points</p>
            <div className="mt-4 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-8 h-8 text-amber-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>,
    document.body
  )
}

interface StreakCelebrationProps {
  streak: number
  show: boolean
  onComplete?: () => void
}

export function StreakCelebration({ streak, show, onComplete }: StreakCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show && streak > 0 && streak % 5 === 0) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, streak, onComplete])

  if (!isVisible) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-bounce-in">
        <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4 animate-float">🔥</div>
          <h2 className="text-3xl font-bold text-white mb-2">{streak} Day Streak!</h2>
          <p className="text-white/90">You're on fire! Keep it going!</p>
        </div>
      </div>
    </div>,
    document.body
  )
}

interface LevelUpCelebrationProps {
  level: number
  show: boolean
  onComplete?: () => void
}

export function LevelUpCelebration({ level, show, onComplete }: LevelUpCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold gradient-text-vibrant">{level}</span>
            </div>
            <div className="absolute -inset-4 animate-spin-slow">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateX(60px) translateY(-50%)`
                  }}
                />
              ))}
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 gradient-text">Level Up!</h2>
          <p className="text-xl text-gray-600 mb-6">You've reached Level {level}</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">+100</div>
              <div className="text-sm text-gray-500">Bonus XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">New</div>
              <div className="text-sm text-gray-500">Badge Unlocked</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>,
    document.body
  )
}