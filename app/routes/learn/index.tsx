import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth/AuthContext";
import { BookOpen, Target, Award, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import foundationContent from '../../lib/learning/foundation';
import conversionsContent from '../../lib/learning/conversions';
import medicationsContent from '../../lib/learning/medications';
import clinicalContent from '../../lib/learning/clinical';
import { getLevelProgress } from '../../lib/learning/progress';

export const Route = createFileRoute("/learn/")({
  component: LearnIndexPage,
});

export interface LearningLevel {
  id: string;
  title: string;
  description: string;
  difficulty: 'FOUNDATION' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  topics: number;
  estimatedTime: string;
  prerequisites: string[];
  learningOutcomes: string[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  isLocked: boolean;
  progress: number; // 0-100
}

// Learning levels data
const learningLevels: LearningLevel[] = [
  {
    id: 'foundation',
    title: 'Foundation Math',
    description: 'Master the essential math skills needed for medical calculations',
    difficulty: 'FOUNDATION',
    topics: 5,
    estimatedTime: '2-3 hours',
    prerequisites: [],
    learningOutcomes: [
      'Work confidently with fractions and decimals',
      'Solve ratio and proportion problems',
      'Understand percentages in medical contexts',
      'Read and interpret medical notation'
    ],
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    icon: <BookOpen className="w-6 h-6" />,
    isLocked: false,
    progress: 0
  },
  {
    id: 'conversions',
    title: 'Unit Conversions',
    description: 'Master metric conversions and dimensional analysis techniques',
    difficulty: 'BEGINNER',
    topics: 6,
    estimatedTime: '3-4 hours',
    prerequisites: [],
    learningOutcomes: [
      'Convert between metric units effortlessly',
      'Master dimensional analysis method',
      'Handle complex multi-step conversions',
      'Apply conversions to real medical scenarios'
    ],
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    icon: <Target className="w-6 h-6" />,
    isLocked: false,
    progress: 0
  },
  {
    id: 'medications',
    title: 'Medication Basics',
    description: 'Learn fundamental medication calculation principles',
    difficulty: 'INTERMEDIATE',
    topics: 8,
    estimatedTime: '4-5 hours',
    prerequisites: [],
    learningOutcomes: [
      'Calculate dosages accurately',
      'Understand drug concentrations',
      'Read medication labels correctly',
      'Apply safety checks and validation'
    ],
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    icon: <Award className="w-6 h-6" />,
    isLocked: false,
    progress: 0
  },
  {
    id: 'clinical',
    title: 'Clinical Applications',
    description: 'Apply your skills to real-world clinical scenarios',
    difficulty: 'ADVANCED',
    topics: 10,
    estimatedTime: '5-6 hours',
    prerequisites: [],
    learningOutcomes: [
      'Handle complex clinical scenarios',
      'Calculate IV drip rates and titrations',
      'Manage special populations (pediatric, critical care)',
      'Integrate all calculation skills seamlessly'
    ],
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    icon: <Target className="w-6 h-6" />,
    isLocked: false,
    progress: 0
  }
];

function LearnIndexPage() {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh progress when returning to this page or when progress changes
  useEffect(() => {
    const handleFocus = () => setRefreshTrigger(prev => prev + 1);
    const handleProgressChange = () => setRefreshTrigger(prev => prev + 1);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('learningProgressChanged', handleProgressChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('learningProgressChanged', handleProgressChange);
    };
  }, []);

  // Calculate dynamic progress for each level
  const learningLevelsWithProgress = useMemo(() => {
    return learningLevels.map(level => {
      let topicIds: string[] = [];
      
      switch (level.id) {
        case 'foundation':
          topicIds = foundationContent.topics.map(t => t.id);
          break;
        case 'conversions':
          topicIds = conversionsContent.topics.map(t => t.id);
          break;
        case 'medications':
          topicIds = medicationsContent.topics.map(t => t.id);
          break;
        case 'clinical':
          topicIds = clinicalContent.topics.map(t => t.id);
          break;
      }
      
      return {
        ...level,
        progress: getLevelProgress(topicIds)
      };
    });
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-12 lg:py-16">
        <div className="container-app">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-1 px-4 bg-white/20 rounded-full mb-6">
              <span className="text-white text-sm font-medium">
                Start from absolute ground zero
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-6">
              Learn Medical Math
              <br />
              <span className="text-white">
                Step by Step
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Master medical calculations with our guided learning path. We'll take you from basic math concepts to complex clinical scenarios with simple explanations, visual aids, and plenty of practice.
            </p>
            {!user && (
              <div className="mb-8">
                <Link
                  to="/auth"
                  className="btn btn-secondary btn-lg shadow-xl hover:shadow-2xl"
                >
                  Sign Up to Track Progress
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-12 lg:py-16">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4 text-gray-900">
              Your Learning Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Progress through four carefully designed levels, building your confidence and skills at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {learningLevelsWithProgress.map((level, index) => (
              <LearningLevelCard key={level.id} level={level} index={index} />
            ))}
          </div>

          {/* Progress Overview */}
          {user && (
            <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Your Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {learningLevelsWithProgress.map((level) => (
                  <div key={level.id} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 relative">
                      <div className={`w-full h-full rounded-full ${level.bgColor} flex items-center justify-center border-4 ${level.progress === 100 ? 'border-green-400' : level.progress > 0 ? 'border-primary-400' : 'border-gray-200'}`}>
                        {level.progress === 100 ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : level.isLocked ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : (
                          <div className={`text-gray-600`}>
                            {level.icon}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{level.title}</p>
                    <p className="text-xs text-gray-500">{level.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4 text-gray-900">
              Why Our Learning Path Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've designed every aspect of the learning experience to maximize understanding and retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon="🎯"
              title="Progressive Learning"
              description="Start with basics and build complexity gradually. Never feel overwhelmed or lost."
            />
            <FeatureCard
              icon="🧠"
              title="Visual Learning"
              description="Interactive diagrams, step-by-step animations, and visual aids make complex concepts clear."
            />
            <FeatureCard
              icon="🎊"
              title="Instant Practice"
              description="Apply what you learn immediately with built-in exercises and real-world examples."
            />
            <FeatureCard
              icon="🔒"
              title="Mastery-Based"
              description="Master each concept before moving forward. Solid foundations ensure lasting understanding."
            />
            <FeatureCard
              icon="💡"
              title="Memory Tricks"
              description="Learn mnemonics, shortcuts, and strategies that make calculations faster and more reliable."
            />
            <FeatureCard
              icon="📊"
              title="Track Progress"
              description="See your improvement with detailed progress tracking and achievement badges."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface LearningLevelCardProps {
  level: LearningLevel;
  index: number;
}

function LearningLevelCard({ level, index }: LearningLevelCardProps) {
  const canAccess = !level.isLocked;
  
  if (canAccess) {
    return (
      <Link
        to="/learn/$level"
        params={{ level: level.id }}
        className="block"
      >
        <div 
          className="group rounded-xl border transition-all duration-200 bg-white shadow-sm hover:shadow-lg border-gray-200 cursor-pointer"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${level.color} flex items-center justify-center shadow-sm text-white`}>
                {level.icon}
              </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    level.difficulty === 'FOUNDATION' ? 'bg-blue-100 text-blue-700' :
                    level.difficulty === 'BEGINNER' ? 'bg-purple-100 text-purple-700' :
                    level.difficulty === 'INTERMEDIATE' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {level.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-700 transition-colors">
                {level.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {level.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{level.topics} topics</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{level.estimatedTime}</span>
                </div>
              </div>

              {/* Learning Outcomes Preview */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">You'll learn to:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {level.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">•</span>
                      <span className="line-clamp-1">{outcome}</span>
                    </li>
                  ))}
                  {level.learningOutcomes.length > 2 && (
                    <li className="text-primary-600 text-xs">
                      +{level.learningOutcomes.length - 2} more skills
                    </li>
                  )}
                </ul>
              </div>

              {/* Progress Bar */}
              {level.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs text-gray-600">{level.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${level.color} transition-all duration-300`}
                      style={{ width: `${level.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                  {level.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // Fallback for locked levels (though all are now unlocked)
    return (
      <div 
        className="group relative overflow-hidden rounded-xl border transition-all duration-300 bg-gray-50 shadow-sm border-gray-200 cursor-not-allowed"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${level.bgColor} opacity-50`} />
        
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Complete Prerequisites</p>
            <p className="text-xs text-gray-500">
              {level.prerequisites.join(', ')}
            </p>
          </div>
        </div>

        <div className="relative p-6">
          {/* Same content structure but grayed out */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg text-white`}>
              {level.icon}
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                level.difficulty === 'FOUNDATION' ? 'bg-blue-100 text-blue-700' :
                level.difficulty === 'BEGINNER' ? 'bg-purple-100 text-purple-700' :
                level.difficulty === 'INTERMEDIATE' ? 'bg-emerald-100 text-emerald-700' :
                'bg-red-100 text-red-700'
              }`}>
                {level.difficulty}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-600 transition-colors">
            {level.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {level.description}
          </p>

          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{level.topics} topics</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{level.estimatedTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              Complete prerequisites first
            </span>
          </div>
        </div>
      </div>
    );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}