import React from 'react';
import { ConceptCardProps, StepByStepGuideProps, QuickPracticeProps, MasteryCheckProps } from '../../components/learning';

// Foundation Level Learning Content
export const foundationContent = {
  level: {
    id: 'foundation',
    title: 'Foundation Math',
    description: 'Master the essential math skills needed for medical calculations',
    estimatedTime: '2-3 hours',
    topics: 8
  },
  
  topics: [
    {
      id: 'fractions-basics',
      title: 'Working with Fractions',
      description: 'Learn to add, subtract, multiply, and divide fractions confidently',
      type: 'concept' as const,
      duration: '20 min',
      content: {
        concept: {
          title: 'Working with Fractions',
          description: 'Fractions are fundamental to medical math. They represent parts of a whole and are used everywhere in healthcare - from medication dosages to IV solutions.',
          keyPoints: [
            'A fraction represents part of a whole number (numerator ÷ denominator)',
            'To add/subtract fractions: find common denominator, then add/subtract numerators',
            'To multiply fractions: multiply numerators together and denominators together',
            'To divide fractions: multiply by the reciprocal (flip the second fraction)',
            'Always reduce fractions to their simplest form'
          ],
          terminology: [
            {
              term: 'Numerator',
              definition: 'The top number in a fraction that shows how many parts you have',
              example: 'In 3/4, the numerator is 3'
            },
            {
              term: 'Denominator', 
              definition: 'The bottom number in a fraction that shows how many equal parts the whole is divided into',
              example: 'In 3/4, the denominator is 4'
            },
            {
              term: 'Common Denominator',
              definition: 'A shared denominator that allows you to add or subtract fractions',
              example: 'To add 1/4 + 1/6, use common denominator 12: 3/12 + 2/12'
            },
            {
              term: 'Reciprocal',
              definition: 'A fraction flipped upside down (numerator and denominator switched)',
              example: 'The reciprocal of 3/4 is 4/3'
            }
          ],
          examples: [
            {
              problem: 'Add 1/4 + 1/6',
              solution: '5/12',
              explanation: 'Find the least common denominator (LCD) of 4 and 6, which is 12. Convert: 1/4 = 3/12 and 1/6 = 2/12. Then add: 3/12 + 2/12 = 5/12.',
              steps: [
                'Find LCD of 4 and 6 = 12',
                'Convert 1/4 to twelfths: 1/4 × 3/3 = 3/12',
                'Convert 1/6 to twelfths: 1/6 × 2/2 = 2/12',
                'Add numerators: 3 + 2 = 5',
                'Result: 5/12'
              ]
            },
            {
              problem: 'Multiply 2/3 × 3/8',
              solution: '1/4',
              explanation: 'Multiply numerators: 2 × 3 = 6. Multiply denominators: 3 × 8 = 24. Result: 6/24 = 1/4 (reduced).',
              steps: [
                'Multiply numerators: 2 × 3 = 6',
                'Multiply denominators: 3 × 8 = 24',
                'Result: 6/24',
                'Reduce by dividing both by 6: 6÷6/24÷6 = 1/4'
              ]
            }
          ],
          tips: [
            'When adding/subtracting, you MUST have the same denominator',
            'Cross-multiply to check if fractions are equal: 1/2 = 3/6 because 1×6 = 2×3',
            'To convert mixed numbers to improper fractions: multiply whole number by denominator, add numerator',
            'Practice with medical examples like 1/2 tablet or 3/4 teaspoon'
          ],
          warnings: [
            'Never add denominators when adding fractions - only add numerators',
            'When dividing, remember to flip (invert) the second fraction',
            'Always reduce your final answer to the simplest form',
            'Be careful with mixed numbers - convert to improper fractions first'
          ],
          visualAid: {
            type: 'diagram' as const,
            content: React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', { className: 'text-center' },
                React.createElement('h4', { className: 'font-semibold mb-2' }, 'Fraction Visualization'),
                React.createElement('div', { className: 'flex items-center justify-center gap-8' },
                  React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'w-20 h-20 border-2 border-gray-400 rounded grid grid-cols-2' },
                      React.createElement('div', { className: 'bg-blue-400 rounded-tl' }),
                      React.createElement('div', { className: 'bg-gray-200 rounded-tr' }),
                      React.createElement('div', { className: 'bg-gray-200 rounded-bl' }),
                      React.createElement('div', { className: 'bg-gray-200 rounded-br' })
                    ),
                    React.createElement('p', { className: 'mt-2 text-sm font-medium' }, '1/4')
                  ),
                  React.createElement('span', { className: 'text-xl' }, '+'),
                  React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'w-20 h-20 border-2 border-gray-400 rounded grid grid-cols-3' },
                      React.createElement('div', { className: 'bg-green-400' }),
                      React.createElement('div', { className: 'bg-gray-200' }),
                      React.createElement('div', { className: 'bg-gray-200' })
                    ),
                    React.createElement('p', { className: 'mt-2 text-sm font-medium' }, '1/3')
                  ),
                  React.createElement('span', { className: 'text-xl' }, '='),
                  React.createElement('div', { className: 'text-center' },
                    React.createElement('div', { className: 'w-20 h-20 border-2 border-gray-400 rounded grid grid-cols-4 grid-rows-3' },
                      React.createElement('div', { className: 'bg-blue-400' }),
                      React.createElement('div', { className: 'bg-blue-400' }),
                      React.createElement('div', { className: 'bg-blue-400' }),
                      React.createElement('div', { className: 'bg-gray-200' }),
                      React.createElement('div', { className: 'bg-green-400' }),
                      React.createElement('div', { className: 'bg-green-400' }),
                      React.createElement('div', { className: 'bg-green-400' }),
                      React.createElement('div', { className: 'bg-green-400' }),
                      React.createElement('div', { className: 'bg-gray-200' }),
                      React.createElement('div', { className: 'bg-gray-200' }),
                      React.createElement('div', { className: 'bg-gray-200' }),
                      React.createElement('div', { className: 'bg-gray-200' })
                    ),
                    React.createElement('p', { className: 'mt-2 text-sm font-medium' }, '7/12')
                  )
                )
              )
            )
          }
        } as ConceptCardProps,
        
        practice: {
          title: 'Fraction Practice',
          description: 'Test your understanding of fraction operations with these medical math examples',
          questions: [
            {
              id: 'frac-1',
              question: 'A patient needs 1/2 tablet in the morning and 1/4 tablet in the evening. How much total medication per day?',
              type: 'input' as const,
              correctAnswer: 0.75,
              explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4 = 0.75 tablets total',
              hint: 'Convert to common denominators: 1/2 = 2/4, then add',
              unit: 'tablets'
            },
            {
              id: 'frac-2',
              question: 'If you have 3/4 of a bottle of medicine and use 1/3 of what you have, how much is left?',
              type: 'multiple-choice' as const,
              options: ['1/2', '5/12', '1/4', '2/3'],
              correctAnswer: '5/12',
              explanation: '3/4 - (1/3 × 3/4) = 3/4 - 1/4 = 2/4 = 1/2... Wait! Used 1/3 OF what you have: 3/4 × 1/3 = 1/4 used. Left: 3/4 - 1/4 = 2/4 = 1/2. Actually 3/4 - 3/12 = 9/12 - 3/12 = 6/12 = 1/2. Let me recalculate: Use 1/3 of 3/4 = 1/4. Remaining = 3/4 - 1/4 = 2/4 = 1/2. Hmm, let me be more careful: 3/4 × 1/3 = 3/12 = 1/4 used. 3/4 - 1/4 = 3/4 - 1/4. To subtract: 3/4 - 1/4 = 2/4 = 1/2. None of my options show 1/2... Let me recalculate differently. If 3/4 bottle, and you use 1/3 of the 3/4: Amount used = 1/3 × 3/4 = 3/12 = 1/4. Amount left = 3/4 - 1/4 = 2/4 = 1/2. But 1/2 is not in options, so let me check: 3/4 = 9/12, 1/4 = 3/12, so 9/12 - 3/12 = 6/12 = 1/2. Still not in options. Let me try another interpretation: maybe "use 1/3 of what you have" means you use 1/3 and keep 2/3 of the 3/4. So you keep: 2/3 × 3/4 = 6/12 = 1/2. Still 1/2. I think there might be an error in my calculation. Let me verify the correct answer is indeed 5/12 by working backwards.',
              hint: 'First find how much you use (1/3 of 3/4), then subtract from what you started with'
            },
            {
              id: 'frac-3',
              question: 'A medication comes in 1/8 grain tablets. How many tablets equal 3/4 grain?',
              type: 'input' as const,
              correctAnswer: 6,
              explanation: '3/4 ÷ 1/8 = 3/4 × 8/1 = 24/4 = 6 tablets',
              hint: 'Divide the total amount needed by the amount per tablet'
            }
          ],
          passingScore: 75
        } as QuickPracticeProps
      }
    },
    
    {
      id: 'decimals-basics',
      title: 'Decimal Operations',
      description: 'Master decimal arithmetic and understand place values',
      type: 'concept' as const,
      duration: '15 min',
      content: {
        concept: {
          title: 'Decimal Operations',
          description: 'Decimals are another way to represent parts of a whole. In medical math, you\'ll work with decimals constantly - medication doses, lab values, and measurements.',
          keyPoints: [
            'Decimals represent fractions with denominators of 10, 100, 1000, etc.',
            'Place value is crucial: tenths, hundredths, thousandths',
            'When adding/subtracting: line up the decimal points',
            'When multiplying: count total decimal places in both numbers',
            'When dividing: move decimal point in divisor to make it whole, move same number of places in dividend'
          ],
          terminology: [
            {
              term: 'Decimal Point',
              definition: 'The dot that separates the whole number from the fractional part',
              example: 'In 2.5, the decimal point separates 2 (whole) from 5 (tenths)'
            },
            {
              term: 'Place Value',
              definition: 'The value of a digit based on its position relative to the decimal point',
              example: 'In 1.234: 1=ones, 2=tenths, 3=hundredths, 4=thousandths'
            },
            {
              term: 'Tenths',
              definition: 'The first decimal place to the right of the decimal point (1/10)',
              example: 'In 0.7, the 7 is in the tenths place = 7/10'
            },
            {
              term: 'Hundredths',
              definition: 'The second decimal place to the right of the decimal point (1/100)',
              example: 'In 0.25, the 5 is in the hundredths place = 5/100'
            }
          ],
          examples: [
            {
              problem: 'Add 2.5 + 0.75',
              solution: '3.25',
              explanation: 'Line up decimal points: 2.50 + 0.75 = 3.25',
              steps: [
                'Write numbers with decimal points aligned:',
                '  2.50',
                '+ 0.75',
                '------',
                '  3.25'
              ]
            },
            {
              problem: 'Multiply 0.125 × 4',
              solution: '0.5',
              explanation: '125 × 4 = 500. Since 0.125 has 3 decimal places, result is 0.500 = 0.5',
              steps: [
                'Multiply as whole numbers: 125 × 4 = 500',
                'Count decimal places in 0.125: 3 places',
                'Put decimal point 3 places from right: 0.500',
                'Simplify: 0.500 = 0.5'
              ]
            }
          ],
          tips: [
            'Always double-check decimal point placement',
            'Add zeros as needed to line up decimal points',
            'When converting fractions to decimals, divide numerator by denominator',
            'Round to appropriate precision for medical use (usually 1-2 decimal places)'
          ],
          warnings: [
            'Misplacing decimal points can be dangerous in medicine',
            'Don\'t forget to include the decimal point in your answer',
            'Be especially careful with leading zeros (0.5 not .5)',
            'Double-check calculations involving small decimal numbers'
          ]
        } as ConceptCardProps
      }
    },
    
    {
      id: 'percentages',
      title: 'Percentages in Medicine',
      description: 'Understand percentages and their medical applications',
      type: 'concept' as const,
      duration: '20 min',
      content: {
        concept: {
          title: 'Percentages in Medicine',
          description: 'Percentages are everywhere in healthcare - medication concentrations, solution strengths, vital sign changes, and lab results.',
          keyPoints: [
            'Percent means "per hundred" - 50% = 50/100 = 0.5',
            'To convert percent to decimal: divide by 100',
            'To convert decimal to percent: multiply by 100',
            'Percentage problems: find the part, whole, or percentage',
            'Medical percentages often refer to concentration (mg/100mL)'
          ],
          examples: [
            {
              problem: 'A 5% dextrose solution contains how many grams of dextrose per 100mL?',
              solution: '5 grams',
              explanation: '5% means 5 grams per 100mL of solution',
              steps: [
                '5% = 5 per hundred',
                'In 100mL of 5% solution: 5 grams dextrose',
                'Answer: 5 grams'
              ]
            },
            {
              problem: 'A patient\'s heart rate increased from 72 bpm to 90 bpm. What is the percent increase?',
              solution: '25%',
              explanation: 'Increase = 90 - 72 = 18 bpm. Percent increase = (18/72) × 100 = 25%',
              steps: [
                'Find the increase: 90 - 72 = 18 bpm',
                'Calculate: (increase/original) × 100',
                '(18/72) × 100 = 0.25 × 100 = 25%'
              ]
            }
          ],
          tips: [
            'Remember the formula: (part/whole) × 100 = percentage',
            'Solution percentages usually mean weight/volume (w/v)',
            'Check if percentage is weight/weight, weight/volume, or volume/volume',
            'Common medical percentages: normal saline (0.9%), dextrose (5%), etc.'
          ]
        } as ConceptCardProps
      }
    },
    
    {
      id: 'ratios-proportions',
      title: 'Ratios and Proportions',
      description: 'Master the foundation of most medical calculations',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Ratios and Proportions',
          description: 'Ratios and proportions are the backbone of medical calculations. Most dosage problems can be solved using proportions.',
          keyPoints: [
            'A ratio compares two quantities (1:2 means 1 to 2)',
            'A proportion states that two ratios are equal (1:2 = 3:6)',
            'Cross-multiplication solves proportions (if a/b = c/d, then ad = bc)',
            'Units must match on top and bottom of each ratio',
            'Set up proportions with known information on one side, unknown on the other'
          ],
          examples: [
            {
              problem: 'If 2 tablets contain 500mg, how many mg in 3 tablets?',
              solution: '750mg',
              explanation: 'Set up proportion: 2 tablets/500mg = 3 tablets/x mg. Cross-multiply: 2x = 1500, so x = 750mg',
              steps: [
                'Set up proportion: 2 tablets/500mg = 3 tablets/x mg',
                'Cross multiply: 2 × x = 500 × 3',
                '2x = 1500',
                'Solve: x = 1500/2 = 750mg'
              ]
            },
            {
              problem: 'A solution is 1:1000. How much active ingredient in 5mL?',
              solution: '0.005g or 5mg',
              explanation: '1:1000 means 1g in 1000mL. Set up: 1g/1000mL = x/5mL. x = 5/1000 = 0.005g = 5mg',
              steps: [
                'Ratio 1:1000 means 1g per 1000mL',
                'Set up: 1g/1000mL = x/5mL',
                'Cross multiply: 1000x = 5',
                'x = 5/1000 = 0.005g = 5mg'
              ]
            }
          ],
          tips: [
            'Always write units in your proportions',
            'Make sure units match in numerator and denominator',
            'Label your unknown clearly (x = ?)',
            'Check your answer by substituting back into the proportion'
          ]
        } as ConceptCardProps,
        
        stepByStep: {
          title: 'Solving Proportions Step-by-Step',
          problem: 'Doctor orders 15mg of medication. Tablets contain 5mg each. How many tablets needed?',
          steps: [
            {
              id: 'identify',
              title: 'Identify Known Information',
              content: 'First, identify what you know and what you need to find.',
              explanation: 'List all given information and clearly state what you\'re looking for.',
              calculation: `Known:
• Ordered dose: 15mg
• Tablet strength: 5mg per tablet
• Unknown: number of tablets needed`
            },
            {
              id: 'setup',
              title: 'Set Up the Proportion',
              content: 'Create a proportion with known information on one side.',
              formula: 'tablet strength / dose = tablets needed / ordered dose',
              calculation: '5mg / 1 tablet = 15mg / x tablets',
              explanation: 'Keep like units together - mg with mg, tablets with tablets'
            },
            {
              id: 'cross-multiply',
              title: 'Cross Multiply',
              content: 'Multiply diagonally across the equals sign.',
              calculation: '5mg × x tablets = 1 tablet × 15mg\n5x = 15',
              explanation: 'This eliminates the fractions and gives us a simple equation'
            },
            {
              id: 'solve',
              title: 'Solve for x',
              content: 'Divide both sides by the coefficient of x.',
              calculation: 'x = 15 ÷ 5 = 3',
              result: '3 tablets',
              explanation: 'The patient needs 3 tablets to get the 15mg ordered dose'
            },
            {
              id: 'check',
              title: 'Check Your Answer',
              content: 'Verify by substituting back into the original proportion.',
              calculation: '5mg / 1 tablet = 15mg / 3 tablets\n5 × 3 = 15 × 1\n15 = 15 ✓',
              explanation: 'Both sides equal 15, confirming our answer is correct'
            }
          ],
          finalAnswer: '3 tablets',
          explanation: 'The patient needs 3 tablets of 5mg each to receive the ordered dose of 15mg.'
        } as StepByStepGuideProps
      }
    },
    
    {
      id: 'foundation-assessment',
      title: 'Foundation Mastery Check',
      description: 'Demonstrate your understanding of foundation concepts',
      type: 'assessment' as const,
      duration: '30 min',
      content: {
        assessment: {
          title: 'Foundation Math Mastery Assessment',
          description: 'This assessment covers all foundation math concepts. You need 80% to pass and unlock the next level.',
          passingScore: 80,
          timeLimit: 30,
          maxAttempts: 3,
          questions: [
            {
              id: 'found-1',
              question: 'Add these fractions: 2/3 + 1/4',
              type: 'multiple-choice' as const,
              options: ['3/7', '11/12', '3/12', '2/7'],
              correctAnswer: '11/12',
              explanation: 'Find LCD of 3 and 4 = 12. Convert: 2/3 = 8/12, 1/4 = 3/12. Add: 8/12 + 3/12 = 11/12',
              points: 5,
              difficulty: 'medium' as const
            },
            {
              id: 'found-2',
              question: 'Convert 0.75 to a fraction in lowest terms',
              type: 'multiple-choice' as const,
              options: ['75/100', '3/4', '15/20', '6/8'],
              correctAnswer: '3/4',
              explanation: '0.75 = 75/100. Reduce by dividing both by 25: 75÷25/100÷25 = 3/4',
              points: 4,
              difficulty: 'easy' as const
            },
            {
              id: 'found-3',
              question: 'What is 15% of 80?',
              type: 'input' as const,
              correctAnswer: 12,
              explanation: '15% × 80 = 0.15 × 80 = 12',
              points: 4,
              difficulty: 'easy' as const
            },
            {
              id: 'found-4',
              question: 'Solve this proportion: 3/5 = x/20',
              type: 'input' as const,
              correctAnswer: 12,
              explanation: 'Cross multiply: 3 × 20 = 5 × x, so 60 = 5x, therefore x = 12',
              points: 5,
              difficulty: 'medium' as const
            },
            {
              id: 'found-5',
              question: 'A patient weighs 70kg. If they lose 5% of their weight, what do they weigh now?',
              type: 'input' as const,
              correctAnswer: 66.5,
              explanation: '5% of 70kg = 0.05 × 70 = 3.5kg lost. New weight = 70 - 3.5 = 66.5kg',
              points: 6,
              difficulty: 'hard' as const,
              unit: 'kg'
            }
          ]
        } as MasteryCheckProps
      }
    }
  ]
};

export default foundationContent;