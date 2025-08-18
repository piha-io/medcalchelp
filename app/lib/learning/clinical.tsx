import React from 'react';
import { ConceptCardProps, StepByStepGuideProps, QuickPracticeProps, MasteryCheckProps } from '../../components/learning';

// Clinical Applications Level Learning Content
export const clinicalContent = {
  level: {
    id: 'clinical',
    title: 'Clinical Applications',
    description: 'Apply your skills to real-world clinical scenarios',
    estimatedTime: '5-6 hours',
    topics: 10
  },
  
  topics: [
    {
      id: 'iv-flow-rates',
      title: 'IV Flow Rate Calculations',
      description: 'Master IV drip rates and pump settings',
      type: 'concept' as const,
      duration: '45 min',
      content: {
        concept: {
          title: 'IV Flow Rate Calculations',
          description: 'IV therapy requires precise flow rate calculations to ensure patients receive the correct amount of fluid and medication over time.',
          keyPoints: [
            'Flow rate (mL/hr) = Total volume ÷ Time in hours',
            'Gravity drip rate (gtts/min) = (mL/hr × Drop factor) ÷ 60',
            'Common drop factors: 10, 15, 20 gtts/mL (macro), 60 gtts/mL (micro)',
            'Pumps calculate in mL/hr, gravity drips in gtts/min',
            'Always verify pump settings match physician orders'
          ],
          terminology: [
            {
              term: 'Flow Rate',
              definition: 'Speed of IV infusion, usually expressed as mL/hr',
              example: '125 mL/hr means 125mL infuses every hour'
            },
            {
              term: 'Drop Factor',
              definition: 'Number of drops per mL for specific IV tubing',
              example: '15 gtts/mL means 15 drops equal 1mL'
            },
            {
              term: 'Macro Drip',
              definition: 'Large drop tubing (10, 15, or 20 gtts/mL)',
              example: 'Used for routine IV fluids in adults'
            },
            {
              term: 'Micro Drip',
              definition: 'Small drop tubing (60 gtts/mL)',
              example: 'Used for precise control, pediatrics, or slow infusions'
            },
            {
              term: 'Infusion Time',
              definition: 'How long it takes to infuse the total volume',
              example: '1000mL at 125mL/hr will take 8 hours'
            }
          ],
          examples: [
            {
              problem: 'Infuse 1000mL over 8 hours using pump. What flow rate?',
              solution: '125 mL/hr',
              explanation: '1000mL ÷ 8 hours = 125 mL/hr',
              steps: [
                'Identify total volume: 1000mL',
                'Identify time: 8 hours',
                'Calculate: Flow rate = 1000mL ÷ 8hr = 125 mL/hr',
                'Set pump to 125 mL/hr'
              ]
            },
            {
              problem: 'IV running at 100mL/hr with 15 gtts/mL tubing. What drip rate?',
              solution: '25 gtts/min',
              explanation: '(100 mL/hr × 15 gtts/mL) ÷ 60 min/hr = 25 gtts/min',
              steps: [
                'Flow rate: 100 mL/hr',
                'Drop factor: 15 gtts/mL',
                'Formula: (mL/hr × gtts/mL) ÷ 60',
                'Calculate: (100 × 15) ÷ 60 = 1500 ÷ 60 = 25 gtts/min'
              ]
            }
          ],
          tips: [
            'For micro drip (60 gtts/mL): gtts/min = mL/hr (easy shortcut!)',
            'Count drips for 15 seconds, multiply by 4 to get gtts/min',
            'Regularly verify gravity drip rates - they can change',
            'Use pump when precise flow rate is critical'
          ],
          warnings: [
            'Wrong flow rates can cause fluid overload or dehydration',
            'Always double-check pump programming',
            'Monitor for infiltration when using gravity drips',
            'Verify drop factor matches your tubing'
          ]
        } as ConceptCardProps,
        
        stepByStep: {
          title: 'IV Flow Rate Calculation Step-by-Step',
          problem: 'Patient needs 500mL normal saline over 4 hours. Using gravity drip with 20 gtts/mL tubing. Calculate pump rate and drip rate.',
          steps: [
            {
              id: 'pump-rate',
              title: 'Calculate Pump Flow Rate',
              content: 'First determine the mL/hr rate for pump programming.',
              explanation: 'Pumps are always programmed in mL/hr.',
              calculation: 'Flow rate = Total volume ÷ Time\nFlow rate = 500mL ÷ 4 hours = 125 mL/hr'
            },
            {
              id: 'drip-setup',
              title: 'Set Up Drip Rate Formula',
              content: 'Use the gravity drip formula with the drop factor.',
              formula: 'gtts/min = (mL/hr × Drop factor) ÷ 60',
              calculation: 'gtts/min = (125 mL/hr × 20 gtts/mL) ÷ 60',
              explanation: 'This converts hourly rate to drops per minute'
            },
            {
              id: 'calculate-drips',
              title: 'Calculate Drops per Minute',
              content: 'Complete the calculation for gravity drip rate.',
              calculation: 'gtts/min = (125 × 20) ÷ 60\ngtts/min = 2500 ÷ 60 = 41.7 ≈ 42 gtts/min',
              explanation: 'Round to nearest whole number for practical counting'
            },
            {
              id: 'verify',
              title: 'Verify Your Calculations',
              content: 'Double-check both calculations make sense.',
              calculation: `Pump rate: 125 mL/hr × 4 hours = 500mL ✓
Drip rate: 42 gtts/min × 60 min = 2520 gtts/hr
2520 gtts ÷ 20 gtts/mL = 126 mL/hr ≈ 125 mL/hr ✓`,
              result: 'Pump: 125 mL/hr, Gravity: 42 gtts/min',
              explanation: 'Both methods deliver approximately the same volume'
            }
          ],
          finalAnswer: 'Pump rate: 125 mL/hr, Gravity drip rate: 42 gtts/min',
          explanation: 'Either method will deliver 500mL over 4 hours as ordered.'
        } as StepByStepGuideProps
      }
    },

    {
      id: 'iv-medication-drips',
      title: 'IV Medication Drips',
      description: 'Calculate continuous IV medication infusions',
      type: 'concept' as const,
      duration: '50 min',
      content: {
        concept: {
          title: 'IV Medication Drips',
          description: 'Continuous IV medications require precise calculations to achieve therapeutic drug levels while avoiding toxicity.',
          keyPoints: [
            'Concentration = Total drug amount ÷ Total volume',
            'Flow rate (mL/hr) = (Dose/hr) ÷ Concentration',
            'Common units: mcg/min, mg/hr, units/hr',
            'Weight-based dosing: mcg/kg/min or mg/kg/hr',
            'Always use infusion pumps for IV medications'
          ],
          terminology: [
            {
              term: 'Drip Concentration',
              definition: 'Amount of drug per mL in the IV bag',
              example: '400mg dopamine in 250mL = 1.6mg/mL'
            },
            {
              term: 'mcg/kg/min',
              definition: 'Micrograms per kilogram per minute (weight-based dosing)',
              example: 'Dopamine 5 mcg/kg/min for 70kg patient'
            },
            {
              term: 'Titration',
              definition: 'Adjusting dose based on patient response',
              example: 'Increase norepinephrine by 2 mcg/min for low BP'
            },
            {
              term: 'Loading Dose',
              definition: 'Initial larger dose to achieve therapeutic level quickly',
              example: 'Amiodarone loading dose before maintenance drip'
            }
          ],
          examples: [
            {
              problem: 'Dopamine drip: 400mg in 250mL. Patient weighs 80kg. Order: 10 mcg/kg/min. What mL/hr rate?',
              solution: '30 mL/hr',
              explanation: 'Dose: 80kg × 10 mcg/kg/min = 800 mcg/min = 48 mg/hr. Concentration: 400mg/250mL = 1.6mg/mL. Rate: 48mg/hr ÷ 1.6mg/mL = 30mL/hr',
              steps: [
                'Calculate dose: 80kg × 10 mcg/kg/min = 800 mcg/min',
                'Convert to mg/hr: 800 mcg/min × 60 min/hr ÷ 1000 = 48 mg/hr',
                'Calculate concentration: 400mg ÷ 250mL = 1.6 mg/mL',
                'Calculate rate: 48 mg/hr ÷ 1.6 mg/mL = 30 mL/hr'
              ]
            },
            {
              problem: 'Heparin 25,000 units in 500mL. Order: 1200 units/hr. What mL/hr rate?',
              solution: '24 mL/hr',
              explanation: 'Concentration: 25,000 units/500mL = 50 units/mL. Rate: 1200 units/hr ÷ 50 units/mL = 24 mL/hr',
              steps: [
                'Calculate concentration: 25,000 units ÷ 500mL = 50 units/mL',
                'Calculate rate: 1200 units/hr ÷ 50 units/mL = 24 mL/hr',
                'Set pump to 24 mL/hr'
              ]
            }
          ],
          tips: [
            'Always calculate concentration first',
            'Keep units consistent throughout calculation',
            'Use dimensional analysis for complex conversions',
            'Label all IV drips clearly with drug and concentration'
          ],
          warnings: [
            'IV medication errors can be rapidly fatal',
            'Always verify calculations with another nurse',
            'Monitor patient response closely during titration',
            'Never adjust drip rates without physician order'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'critical-care-calculations',
      title: 'Critical Care Calculations',
      description: 'Complex calculations for ICU medications',
      type: 'concept' as const,
      duration: '45 min',
      content: {
        concept: {
          title: 'Critical Care Calculations',
          description: 'ICU patients often require multiple high-alert medications with complex dosing regimens and frequent titrations.',
          keyPoints: [
            'Multiple drips often run simultaneously',
            'Frequent dose changes require quick calculations',
            'Monitor for drug interactions and cumulative effects',
            'Use standard concentrations when possible',
            'Always double-check high-alert medication calculations'
          ],
          examples: [
            {
              problem: 'Norepinephrine: 4mg in 250mL. Patient 70kg. Start at 0.1 mcg/kg/min, titrate to MAP >65. What starting rate?',
              solution: '26.3 mL/hr',
              explanation: 'Dose: 70kg × 0.1 mcg/kg/min = 7 mcg/min = 0.42 mg/hr. Concentration: 4mg/250mL = 0.016 mg/mL. Rate: 0.42 mg/hr ÷ 0.016 mg/mL = 26.25 ≈ 26.3 mL/hr',
              steps: [
                'Calculate dose: 70kg × 0.1 mcg/kg/min = 7 mcg/min',
                'Convert to mg/hr: 7 × 60 ÷ 1000 = 0.42 mg/hr',
                'Concentration: 4mg ÷ 250mL = 0.016 mg/mL',
                'Rate: 0.42 ÷ 0.016 = 26.25 ≈ 26.3 mL/hr'
              ]
            }
          ],
          tips: [
            'Keep standard drug reference cards handy',
            'Use calculators or apps for complex calculations',
            'Document all dose changes and times',
            'Consider using standard concentration charts'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'chemotherapy-calculations',
      title: 'Chemotherapy Calculations',
      description: 'Safe dosing for cancer treatments',
      type: 'concept' as const,
      duration: '40 min',
      content: {
        concept: {
          title: 'Chemotherapy Calculations',
          description: 'Chemotherapy requires extreme precision due to narrow therapeutic windows and serious toxicity risks.',
          keyPoints: [
            'Doses based on Body Surface Area (BSA) in m²',
            'BSA calculated from height and weight',
            'Doses often expressed as mg/m²',
            'Multiple verification steps required',
            'Consider dose reductions for toxicity'
          ],
          terminology: [
            {
              term: 'BSA (Body Surface Area)',
              definition: 'Calculated measurement in square meters used for chemo dosing',
              example: 'Adult BSA typically 1.5-2.0 m²'
            },
            {
              term: 'mg/m²',
              definition: 'Milligrams of drug per square meter of body surface area',
              example: 'Doxorubicin 60 mg/m² means 60mg for each m² of BSA'
            },
            {
              term: 'Cycle',
              definition: 'Specific treatment period including drugs and rest time',
              example: '21-day cycle: treatment days 1-3, rest days 4-21'
            }
          ],
          examples: [
            {
              problem: 'Patient BSA = 1.8 m². Order: carboplatin 300 mg/m². What total dose?',
              solution: '540 mg',
              explanation: '1.8 m² × 300 mg/m² = 540 mg',
              steps: [
                'Patient BSA: 1.8 m²',
                'Ordered dose: 300 mg/m²',
                'Calculate: 1.8 m² × 300 mg/m² = 540 mg',
                'Total dose: 540 mg'
              ]
            }
          ],
          tips: [
            'Always verify BSA calculation',
            'Use established BSA formulas or calculators',
            'Have pharmacist verify all chemo calculations',
            'Never round chemotherapy doses'
          ],
          warnings: [
            'Chemotherapy overdoses can be fatal',
            'Always use two-person verification',
            'Check patient identification multiple times',
            'Verify calculation against original order'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'burn-fluid-calculations',
      title: 'Burn Fluid Resuscitation',
      description: 'Calculate fluid requirements for burn patients',
      type: 'concept' as const,
      duration: '35 min',
      content: {
        concept: {
          title: 'Burn Fluid Resuscitation',
          description: 'Burn patients require precise fluid resuscitation based on burn size and body weight to prevent shock while avoiding fluid overload.',
          keyPoints: [
            'Parkland formula: 4 mL × weight(kg) × % burn',
            'Give half in first 8 hours, half in next 16 hours',
            'Time starts from burn injury, not arrival',
            'Only count 2nd and 3rd degree burns',
            'Monitor urine output to guide therapy'
          ],
          terminology: [
            {
              term: 'TBSA (Total Body Surface Area)',
              definition: 'Percentage of body surface affected by burns',
              example: '20% TBSA means burns cover 20% of body surface'
            },
            {
              term: 'Parkland Formula',
              definition: 'Standard formula for burn fluid resuscitation',
              example: '4 mL × kg × % burn = total 24-hour fluid needs'
            },
            {
              term: 'Rule of Nines',
              definition: 'Method to estimate burn percentage in adults',
              example: 'Head 9%, each arm 9%, each leg 18%, torso 36%'
            }
          ],
          examples: [
            {
              problem: '70kg patient with 30% burns, injury 2 hours ago. Calculate fluid needs.',
              solution: '8400 mL total; 4200 mL remaining for first 8 hours',
              explanation: 'Parkland: 4 × 70kg × 30% = 8400 mL total. First 8 hrs: 4200 mL. Injured 2 hrs ago, so 4200 mL over next 6 hours',
              steps: [
                'Calculate 24-hr total: 4 × 70kg × 30% = 8400 mL',
                'First 8 hours: 8400 ÷ 2 = 4200 mL',
                'Time since burn: 2 hours',
                'Remaining time in first 8 hrs: 8 - 2 = 6 hours',
                'Rate: 4200 mL ÷ 6 hrs = 700 mL/hr for next 6 hours'
              ]
            }
          ],
          tips: [
            'Start timing from injury, not hospital arrival',
            'Subtract time already elapsed since burn',
            'Only count significant (2nd/3rd degree) burns',
            'Adjust rates based on urine output'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'clinical-practice-1',
      title: 'Clinical Practice - Basic',
      description: 'Practice fundamental clinical calculations',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Clinical Calculation Fundamentals',
          description: 'Before tackling clinical scenarios, let\'s review the essential formulas and concepts for IV therapy and basic drip calculations.',
          keyPoints: [
            'IV flow rate: mL/hr = Total volume ÷ Time in hours',
            'Gravity drip rate: gtts/min = (mL/hr × drop factor) ÷ 60',
            'Medication drips: Calculate dose/hr, then convert to mL/hr',
            'Always verify pump settings match physician orders',
            'Monitor patients closely during IV therapy'
          ],
          terminology: [
            {
              term: 'Flow Rate',
              definition: 'Speed of IV infusion, expressed as mL/hr for pumps',
              example: '125 mL/hr means 125mL will infuse each hour'
            },
            {
              term: 'Drop Factor',
              definition: 'Number of drops per mL for IV tubing',
              example: '15 gtts/mL means 15 drops equal 1mL of fluid'
            },
            {
              term: 'gtts/min',
              definition: 'Drops per minute for gravity drip calculations',
              example: '25 gtts/min means you count 25 drops each minute'
            }
          ],
          examples: [
            {
              problem: 'Basic IV calculation: 1000mL over 8 hours',
              solution: '125 mL/hr',
              explanation: 'Simple division: 1000mL ÷ 8 hours = 125 mL/hr',
              steps: [
                'Identify total volume: 1000mL',
                'Identify time: 8 hours',
                'Calculate: 1000 ÷ 8 = 125 mL/hr',
                'Set pump to 125 mL/hr'
              ]
            }
          ],
          tips: [
            'Always double-check pump programming',
            'For gravity drips, count drops for 15 seconds and multiply by 4',
            'Use pumps when precise flow control is critical',
            'Remember: micro drip (60 gtts/mL) makes gtts/min = mL/hr'
          ],
          warnings: [
            'Wrong flow rates can cause fluid overload or dehydration',
            'Always verify IV patency before starting infusions',
            'Monitor for infiltration with gravity drips',
            'Never adjust rates without physician order'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'clinical-practice-2',
      title: 'Clinical Practice - Advanced',
      description: 'Complex clinical calculation scenarios',
      type: 'concept' as const,
      duration: '40 min',
      content: {
        concept: {
          title: 'Advanced Clinical Scenarios',
          description: 'Complex clinical calculations often involve multiple steps, weight-based dosing, and protocol-driven care. Master the systematic approaches needed for critical situations.',
          keyPoints: [
            'Weight-based protocols: Calculate dose using patient weight',
            'Multi-step calculations: Break complex problems into parts',
            'Time-sensitive formulas: Burn resuscitation, emergency protocols',
            'High-alert medications: Extra verification required',
            'Critical care calculations require precision and speed'
          ],
          terminology: [
            {
              term: 'Protocol-based Dosing',
              definition: 'Standardized dosing based on patient weight and condition',
              example: 'Heparin protocol: 80 units/kg bolus, then 18 units/kg/hr'
            },
            {
              term: 'Parkland Formula',
              definition: 'Burn resuscitation formula: 4 mL × kg × % burn',
              example: '4 × 70kg × 30% = 8400mL in first 24 hours'
            },
            {
              term: 'units/kg/hr',
              definition: 'Weight-based continuous dosing per hour',
              example: '18 units/kg/hr means 18 units per kg of body weight per hour'
            }
          ],
          examples: [
            {
              problem: 'Strategy: How to approach weight-based drip calculations?',
              solution: 'Systematic step-by-step approach',
              explanation: 'Always follow the same sequence to avoid errors',
              steps: [
                '1. Calculate dose per hour: weight × units/kg/hr',
                '2. Identify concentration: total units ÷ total volume',
                '3. Calculate flow rate: dose/hr ÷ concentration',
                '4. Verify units are correct (mL/hr for pump)',
                '5. Double-check calculation with another nurse'
              ]
            }
          ],
          tips: [
            'Write out all steps clearly - don\'t skip',
            'Double-check patient weight - verify with scale',
            'For burn calculations, subtract elapsed time',
            'Always verify high-alert calculations with colleague'
          ],
          warnings: [
            'Protocol violations can be dangerous - follow exactly',
            'Weight errors multiply through entire calculation',
            'Time-sensitive calculations (burns) require immediate attention',
            'Heparin and insulin are high-alert - extra caution required'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'emergency-calculations',
      title: 'Emergency Drug Calculations',
      description: 'Rapid calculations for emergency situations',
      type: 'concept' as const,
      duration: '35 min',
      content: {
        concept: {
          title: 'Emergency Drug Calculations',
          description: 'Emergency situations require rapid, accurate drug calculations. Learn common emergency drug doses and quick calculation methods.',
          keyPoints: [
            'Know standard emergency drug concentrations',
            'Use body weight for most emergency drugs',
            'Memorize common doses: epi 1mg, atropine 0.5mg, etc.',
            'Practice calculations until they become automatic',
            'Have reference cards readily available'
          ],
          examples: [
            {
              problem: 'Cardiac arrest: epinephrine 1mg (1:10,000). Available: 1mg/10mL prefilled syringe. How much to give?',
              solution: '10 mL',
              explanation: 'Standard adult cardiac arrest dose is 1mg. Prefilled syringe contains 1mg/10mL, so give entire 10mL',
              steps: [
                'Standard epinephrine dose: 1mg',
                'Available concentration: 1mg/10mL',
                'Volume needed: 1mg ÷ (1mg/10mL) = 10mL',
                'Give entire prefilled syringe'
              ]
            }
          ],
          tips: [
            'Keep emergency drug cards in code cart',
            'Practice emergency calculations regularly',
            'Know your hospital\'s standard concentrations',
            'When in doubt, ask for help - speed matters but accuracy matters more'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'total-parenteral-nutrition',
      title: 'Total Parenteral Nutrition (TPN)',
      description: 'Calculate TPN components and rates',
      type: 'concept' as const,
      duration: '40 min',
      content: {
        concept: {
          title: 'Total Parenteral Nutrition (TPN)',
          description: 'TPN provides complete nutrition intravenously when patients cannot use their GI tract. Calculations involve multiple components and caloric requirements.',
          keyPoints: [
            'TPN contains amino acids, dextrose, lipids, electrolytes, vitamins',
            'Calculate caloric needs: 25-30 kcal/kg/day for adults',
            'Protein needs: 1.2-2.0 g/kg/day depending on condition',
            'Dextrose provides 3.4 kcal/g, lipids provide 9 kcal/g',
            'Start TPN slowly and advance gradually'
          ],
          terminology: [
            {
              term: 'Amino Acids',
              definition: 'Protein component of TPN, provides 4 kcal/g',
              example: '10% amino acids = 10g protein per 100mL'
            },
            {
              term: 'Dextrose',
              definition: 'Carbohydrate component, provides 3.4 kcal/g',
              example: '50% dextrose = 50g dextrose per 100mL'
            },
            {
              term: 'Lipid Emulsion',
              definition: 'Fat component, provides 9 kcal/g (or 1.1 kcal/mL for 20%)',
              example: '20% lipids provide 2 kcal/mL'
            }
          ],
          examples: [
            {
              problem: '70kg patient needs 25 kcal/kg/day. TPN provides 1400 kcal/L at 80mL/hr. Meeting caloric needs?',
              solution: 'Yes, providing 1680 kcal/day vs 1750 kcal needed',
              explanation: 'Needs: 70kg × 25 kcal/kg = 1750 kcal/day. TPN: 80mL/hr × 24hr = 1920mL = 1.92L. Calories: 1.92L × 1400 kcal/L = 2688 kcal/day',
              steps: [
                'Calculate needs: 70kg × 25 kcal/kg = 1750 kcal/day',
                'Calculate daily volume: 80 mL/hr × 24 hr = 1920 mL',
                'Convert to liters: 1920 mL = 1.92 L',
                'Calculate provided: 1.92 L × 1400 kcal/L = 2688 kcal/day',
                'Comparison: 2688 > 1750, so yes, meeting needs'
              ]
            }
          ],
          tips: [
            'TPN calculations are complex - pharmacy usually does them',
            'Focus on rate calculations and caloric assessments',
            'Monitor blood glucose closely when starting TPN',
            'Use central line for TPN >10% dextrose'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'clinical-assessment',
      title: 'Clinical Applications Mastery',
      description: 'Comprehensive clinical calculation assessment',
      type: 'assessment' as const,
      duration: '60 min',
      content: {
        assessment: {
          title: 'Clinical Applications Mastery Assessment',
          description: 'Demonstrate mastery of advanced clinical calculations across all areas. You need 90% to complete the program.',
          passingScore: 90,
          timeLimit: 60,
          maxAttempts: 2,
          questions: [
            {
              id: 'final-1',
              question: 'Infuse 500mL over 6 hours using 20 gtts/mL tubing. What drip rate in gtts/min?',
              type: 'input' as const,
              correctAnswer: 28,
              explanation: 'Rate: 500÷6 = 83.3 mL/hr. Drips: (83.3×20)÷60 = 27.8 ≈ 28 gtts/min',
              points: 8,
              difficulty: 'medium' as const,
              unit: 'gtts/min'
            },
            {
              id: 'final-2',
              question: 'Dopamine 400mg/250mL. Patient 80kg needs 7.5 mcg/kg/min. What mL/hr pump rate?',
              type: 'input' as const,
              correctAnswer: 22.5,
              explanation: 'Dose: 80×7.5 = 600 mcg/min = 36 mg/hr. Conc: 400÷250 = 1.6 mg/mL. Rate: 36÷1.6 = 22.5 mL/hr',
              points: 10,
              difficulty: 'hard' as const,
              unit: 'mL/hr'
            },
            {
              id: 'final-3',
              question: 'Child weighs 25kg with 20% burns, injured 1 hour ago. What fluid rate for next 7 hours (Parkland formula)?',
              type: 'input' as const,
              correctAnswer: 285.7,
              explanation: 'Total: 4×25×20 = 2000mL. First 8hrs: 1000mL. Rate for 7 remaining hrs: 1000÷7 = 142.9 mL/hr. Wait, that\'s wrong. Let me recalculate: 2000mL in first 8hrs, so 2000÷7 = 285.7 mL/hr',
              points: 12,
              difficulty: 'hard' as const,
              unit: 'mL/hr'
            },
            {
              id: 'final-4',
              question: 'Heparin 25,000 units/500mL. Protocol: 80 units/kg bolus, then 18 units/kg/hr. Patient 75kg. What maintenance drip rate?',
              type: 'input' as const,
              correctAnswer: 27,
              explanation: 'Maintenance: 75×18 = 1350 units/hr. Conc: 25000÷500 = 50 units/mL. Rate: 1350÷50 = 27 mL/hr',
              points: 10,
              difficulty: 'hard' as const,
              unit: 'mL/hr'
            }
          ]
        } as MasteryCheckProps
      }
    }
  ]
};

export default clinicalContent;