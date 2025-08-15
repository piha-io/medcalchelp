import type { CategoryInfo } from '../components/CategoryCard'
import { 
  Calculator, 
  Droplets, 
  ArrowRightLeft, 
  Baby, 
  Heart, 
  Syringe, 
  Activity, 
  FlaskRound, 
  GitBranch, 
  TestTube, 
  Beaker 
} from 'lucide-react'

export const categories: CategoryInfo[] = [
  {
    id: 'DOSAGE_CALCULATION',
    title: 'Dosage Calculations',
    description: 'Oral, IM, SubQ medications',
    questionCount: 50,
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    icon: <Calculator className="w-6 h-6" />,
    pointsMultiplier: 1
  },
  {
    id: 'IV_DRIP_RATE',
    title: 'IV Drip Rates',
    description: 'mL/hr, gtt/min, pump settings',
    questionCount: 40,
    gradient: 'from-cyan-400 to-teal-600',
    bgGradient: 'from-cyan-50 to-teal-100',
    iconBg: 'bg-teal-500',
    icon: <Droplets className="w-6 h-6" />,
    pointsMultiplier: 1.5
  },
  {
    id: 'UNIT_CONVERSION',
    title: 'Unit Conversions',
    description: 'Metric, household, apothecary',
    questionCount: 30,
    gradient: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    icon: <ArrowRightLeft className="w-6 h-6" />,
    pointsMultiplier: 1
  },
  {
    id: 'PEDIATRIC_DOSING',
    title: 'Pediatric Dosing',
    description: 'Weight-based calculations',
    questionCount: 25,
    gradient: 'from-pink-400 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-100',
    iconBg: 'bg-rose-500',
    icon: <Baby className="w-6 h-6" />,
    pointsMultiplier: 2
  },
  {
    id: 'CRITICAL_CARE',
    title: 'Critical Care',
    description: 'Vasoactive drips, titrations',
    questionCount: 35,
    gradient: 'from-red-400 to-red-600',
    bgGradient: 'from-red-50 to-red-100',
    iconBg: 'bg-red-500',
    icon: <Heart className="w-6 h-6" />,
    pointsMultiplier: 2
  },
  {
    id: 'INSULIN_DOSING',
    title: 'Insulin Dosing',
    description: 'Sliding scale, corrections',
    questionCount: 20,
    gradient: 'from-emerald-400 to-green-600',
    bgGradient: 'from-emerald-50 to-green-100',
    iconBg: 'bg-green-500',
    icon: <Syringe className="w-6 h-6" />,
    pointsMultiplier: 1.5
  },
  {
    id: 'HEPARIN_PROTOCOL',
    title: 'Heparin Protocol',
    description: 'Bolus and infusion rates',
    questionCount: 15,
    gradient: 'from-indigo-400 to-indigo-600',
    bgGradient: 'from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-500',
    icon: <Activity className="w-6 h-6" />,
    pointsMultiplier: 2
  },
  {
    id: 'RECONSTITUTION',
    title: 'Reconstitution',
    description: 'Powder to liquid calculations',
    questionCount: 20,
    gradient: 'from-amber-400 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-100',
    iconBg: 'bg-orange-500',
    icon: <FlaskRound className="w-6 h-6" />,
    pointsMultiplier: 1.5
  },
  {
    id: 'DIMENSIONAL_ANALYSIS',
    title: 'Dimensional Analysis',
    description: 'Unit conversion chains, railroad method',
    questionCount: 25,
    gradient: 'from-orange-400 to-amber-600',
    bgGradient: 'from-orange-50 to-amber-100',
    iconBg: 'bg-amber-500',
    icon: <GitBranch className="w-6 h-6" />,
    pointsMultiplier: 1.5
  },
  {
    id: 'CONCENTRATION',
    title: 'Concentration Calculations',
    description: 'mg/mL, percentages, ratios',
    questionCount: 20,
    gradient: 'from-lime-400 to-green-600',
    bgGradient: 'from-lime-50 to-green-100',
    iconBg: 'bg-lime-500',
    icon: <TestTube className="w-6 h-6" />,
    pointsMultiplier: 1
  },
  {
    id: 'DILUTION',
    title: 'Dilution Calculations',
    description: 'Stock solutions, dilution ratios',
    questionCount: 20,
    gradient: 'from-sky-400 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-100',
    iconBg: 'bg-sky-500',
    icon: <Beaker className="w-6 h-6" />,
    pointsMultiplier: 1
  }
]