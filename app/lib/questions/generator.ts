import type { QuestionTemplate } from '@prisma/client'

export interface GeneratedQuestion {
  id: string
  type: string
  category: string
  difficulty: string
  title: string
  questionText: string
  generatedValues: Record<string, number>
  units: Record<string, string>
  hints: string[]
}

export function generateQuestion(template: QuestionTemplate): GeneratedQuestion {
  const generatedValues: Record<string, number> = {}
  const variables = template.variables as Record<string, any>

  // Generate random values for each variable
  for (const [key, range] of Object.entries(variables)) {
    const min = range.min
    const max = range.max
    const step = range.step || 1

    // Generate value that's a multiple of step
    const steps = Math.floor((max - min) / step)
    const randomSteps = Math.floor(Math.random() * (steps + 1))
    generatedValues[key] = min + (randomSteps * step)
  }

  // Replace placeholders in question text
  let questionText = template.templateText
  for (const [key, value] of Object.entries(generatedValues)) {
    questionText = questionText.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }

  return {
    id: template.id,
    type: template.type,
    category: template.category,
    difficulty: template.difficulty,
    title: template.title,
    questionText,
    generatedValues,
    units: template.units as Record<string, string>,
    hints: template.hints,
  }
}

export function calculateAnswer(template: QuestionTemplate, values: Record<string, number>): number {
  const formula = template.formulaTemplate
  
  // Create a function that evaluates the formula
  // This is a simple implementation - in production, use a proper expression parser
  let expression = formula
  for (const [key, value] of Object.entries(values)) {
    expression = expression.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }

  try {
    // Use Function constructor to evaluate the expression safely
    const result = new Function('return ' + expression)()
    return Number(result)
  } catch (error) {
    console.error('Error calculating answer:', error)
    throw new Error('Failed to calculate answer')
  }
}

export function checkAnswer(userAnswer: number, correctAnswer: number, tolerance: number = 0.01): boolean {
  const difference = Math.abs(userAnswer - correctAnswer)
  const percentDifference = difference / Math.abs(correctAnswer)
  
  // Check if within tolerance (either absolute or percentage)
  return difference <= tolerance || percentDifference <= tolerance
}