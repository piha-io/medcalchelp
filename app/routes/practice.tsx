import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/practice')({
  component: PracticePage,
})

function PracticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Practice Medical Calculations</h1>
      
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-4 rounded-lg border transition-colors ${
                    difficulty === level
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-gray-300 hover:border-primary-600'
                  }`}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Choose a Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategoryButton
                title="Dosage Calculations"
                description="Calculate medication doses based on patient needs"
                icon="💊"
                onClick={() => setSelectedCategory('DOSAGE_CALCULATION')}
              />
              <CategoryButton
                title="IV Drip Rates"
                description="Calculate infusion rates and drip factors"
                icon="💧"
                onClick={() => setSelectedCategory('IV_DRIP_RATE')}
              />
              <CategoryButton
                title="Unit Conversions"
                description="Convert between metric and imperial units"
                icon="🔄"
                onClick={() => setSelectedCategory('UNIT_CONVERSION')}
              />
              <CategoryButton
                title="Pediatric Dosing"
                description="Weight-based calculations for children"
                icon="👶"
                onClick={() => setSelectedCategory('PEDIATRIC_DOSING')}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Categories
          </button>
          
          <div className="card p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Question interface coming soon!</p>
              <p className="text-sm text-gray-400 mt-2">
                Category: {selectedCategory} | Difficulty: {difficulty}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryButton({ 
  title, 
  description, 
  icon, 
  onClick 
}: { 
  title: string
  description: string
  icon: string
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className="card p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary-300"
    >
      <div className="flex items-start space-x-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  )
}