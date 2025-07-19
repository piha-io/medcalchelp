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
    const decimal = range.decimal || 0

    // Generate value that's a multiple of step
    const steps = Math.floor((max - min) / step)
    const randomSteps = Math.floor(Math.random() * (steps + 1))
    let value = min + (randomSteps * step)

    // Round to specified decimal places
    if (decimal > 0) {
      value = Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
    }

    generatedValues[key] = value
  }

  // Replace placeholders in question text
  let questionText = template.templateText
  for (const [key, value] of Object.entries(generatedValues)) {
    // Format numbers nicely (remove trailing zeros)
    const formattedValue = formatNumber(value)
    questionText = questionText.replace(new RegExp(`{${key}}`, 'g'), formattedValue)
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
  
  // Create a safe expression evaluator
  let expression = formula
  for (const [key, value] of Object.entries(values)) {
    expression = expression.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }

  try {
    // Use a safer evaluation method with Math functions available
    const result = evaluateExpression(expression)
    return Number(result)
  } catch (error) {
    console.error('Error calculating answer:', error)
    throw new Error('Failed to calculate answer')
  }
}

export function checkAnswer(userAnswer: number, correctAnswer: number, tolerance: number = 0.01): boolean {
  // Handle edge cases
  if (isNaN(userAnswer) || isNaN(correctAnswer)) {
    return false
  }

  // For very small answers, use absolute tolerance
  if (Math.abs(correctAnswer) < 1) {
    return Math.abs(userAnswer - correctAnswer) <= tolerance
  }

  // For larger answers, use percentage tolerance
  const percentDifference = Math.abs(userAnswer - correctAnswer) / Math.abs(correctAnswer)
  return percentDifference <= tolerance
}

// Safe expression evaluator
function evaluateExpression(expr: string): number {
  // Remove whitespace
  expr = expr.replace(/\s/g, '')

  // Validate expression contains only allowed characters
  if (!/^[\d+\-*/().,]+$/.test(expr)) {
    throw new Error('Invalid expression')
  }

  // Create a sandboxed function with Math utilities
  const func = new Function('Math', `
    'use strict';
    try {
      return (${expr});
    } catch (e) {
      throw new Error('Calculation error');
    }
  `)

  return func(Math)
}

// Format number for display
function formatNumber(num: number): string {
  // Remove trailing zeros after decimal point
  if (num % 1 === 0) {
    return num.toString()
  }
  
  // Limit to 4 decimal places and remove trailing zeros
  return parseFloat(num.toFixed(4)).toString()
}

// Generate step-by-step solution
export function generateStepByStepSolution(
  template: QuestionTemplate, 
  values: Record<string, number>, 
  answer: number
): string[] {
  const steps: string[] = []
  const units = template.units as Record<string, string>

  switch (template.type) {
    case 'DOSAGE_CALCULATION':
      steps.push('Step 1: Identify the required dose and available strength')
      steps.push(`Required dose: ${values.dose} ${units.dose}`)
      steps.push(`Available strength: ${values.strength} ${units.strength}`)
      steps.push('Step 2: Apply the formula: Required dose ÷ Available strength')
      steps.push(`${values.dose} ÷ ${values.strength} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    case 'IV_DRIP_RATE':
      steps.push('Step 1: Identify the volume, time, and drop factor')
      steps.push(`Volume: ${values.volume} ${units.volume}`)
      steps.push(`Time: ${values.hours} ${units.hours}`)
      steps.push(`Drop factor: ${values.dropFactor} ${units.dropFactor}`)
      steps.push('Step 2: Convert time to minutes')
      steps.push(`${values.hours} hours × 60 = ${values.hours * 60} minutes`)
      steps.push('Step 3: Apply the formula: (Volume × Drop factor) ÷ Time in minutes')
      steps.push(`(${values.volume} × ${values.dropFactor}) ÷ ${values.hours * 60} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    case 'UNIT_CONVERSION':
      const conversionFactor = answer / values.value
      steps.push('Step 1: Identify the conversion factor')
      steps.push(`1 ${units.value} = ${formatNumber(conversionFactor)} ${units.answer}`)
      steps.push('Step 2: Multiply by the conversion factor')
      steps.push(`${values.value} × ${formatNumber(conversionFactor)} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    case 'PEDIATRIC_DOSING':
      steps.push('Step 1: Calculate the total daily dose')
      steps.push(`Weight: ${values.weight} ${units.weight}`)
      steps.push(`Dose per kg: ${values.dosePerKg} ${units.dosePerKg}`)
      steps.push(`Daily dose = ${values.weight} × ${values.dosePerKg} = ${values.weight * values.dosePerKg} mg`)
      steps.push('Step 2: Divide by number of doses')
      steps.push(`Number of doses: ${values.doses} per day`)
      steps.push(`Single dose = ${values.weight * values.dosePerKg} ÷ ${values.doses} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    default:
      steps.push('Calculate using the given formula')
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer || ''}`)
  }

  return steps
}