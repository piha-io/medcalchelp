import { createFileRoute, Link, useNavigate, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Play, Book, Trophy, Target } from 'lucide-react';
import foundationContent from '../../lib/learning/foundation';
import conversionsContent from '../../lib/learning/conversions';
import medicationsContent from '../../lib/learning/medications';
import clinicalContent from '../../lib/learning/clinical';
import { getLevelProgress, isTopicCompleted, getAnonymousProgress, clearProgress } from '../../lib/learning/progress';

export const Route = createFileRoute("/learn/$level")({
  component: LearningLevelPage,
});

interface Topic {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'assessment';
  duration: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface LevelData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  overview: string;
  topics: Topic[];
  color: string;
  bgColor: string;
  completedTopics: number;
  totalTopics: number;
}

// Get level data from actual content
function getLevelData(levelId: string): LevelData | null {
  if (levelId === 'foundation') {
    const topicIds = foundationContent.topics.map(t => t.id);
    const completedCount = topicIds.filter(id => isTopicCompleted(id)).length;
    
    return {
      id: 'foundation',
      title: foundationContent.level.title,
      description: foundationContent.level.description,
      difficulty: 'FOUNDATION',
      overview: 'Before diving into medical calculations, we need to ensure you have a solid foundation in basic mathematical concepts. This level covers fractions, decimals, ratios, proportions, and percentages - the building blocks of all medical math.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      completedTopics: completedCount,
      totalTopics: foundationContent.topics.length,
      topics: foundationContent.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        type: topic.type,
        duration: topic.duration,
        isCompleted: isTopicCompleted(topic.id),
        isUnlocked: true // All topics are now unlocked
      }))
    };
  }
  
  if (levelId === 'conversions') {
    const topicIds = conversionsContent.topics.map(t => t.id);
    const completedCount = topicIds.filter(id => isTopicCompleted(id)).length;
    
    return {
      id: 'conversions',
      title: conversionsContent.level.title,
      description: conversionsContent.level.description,
      difficulty: 'BEGINNER',
      overview: 'Unit conversion is the backbone of medical calculations. Learn the systematic approach of dimensional analysis that will make any conversion problem straightforward and error-free.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      completedTopics: completedCount,
      totalTopics: conversionsContent.topics.length,
      topics: conversionsContent.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        type: topic.type,
        duration: topic.duration,
        isCompleted: isTopicCompleted(topic.id),
        isUnlocked: true // All topics are now unlocked
      }))
    };
  }
  
  if (levelId === 'medications') {
    const topicIds = medicationsContent.topics.map(t => t.id);
    const completedCount = topicIds.filter(id => isTopicCompleted(id)).length;
    
    return {
      id: 'medications',
      title: medicationsContent.level.title,
      description: medicationsContent.level.description,
      difficulty: 'INTERMEDIATE',
      overview: 'Now that you have strong foundational skills, learn how to apply them to real medication scenarios. Understand drug concentrations, dosage calculations, and safety principles.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      completedTopics: completedCount,
      totalTopics: medicationsContent.topics.length,
      topics: medicationsContent.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        type: topic.type,
        duration: topic.duration,
        isCompleted: isTopicCompleted(topic.id),
        isUnlocked: true // All topics are now unlocked
      }))
    };
  }
  
  if (levelId === 'clinical') {
    const topicIds = clinicalContent.topics.map(t => t.id);
    const completedCount = topicIds.filter(id => isTopicCompleted(id)).length;
    
    return {
      id: 'clinical',
      title: clinicalContent.level.title,
      description: clinicalContent.level.description,
      difficulty: 'ADVANCED',
      overview: 'Put all your skills together in complex, real-world clinical scenarios. Master IV calculations, special populations, and critical care situations.',
      color: 'from-red-500 to-orange-600',
      bgColor: 'from-red-50 to-orange-50',
      completedTopics: completedCount,
      totalTopics: clinicalContent.topics.length,
      topics: clinicalContent.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        type: topic.type,
        duration: topic.duration,
        isCompleted: isTopicCompleted(topic.id),
        isUnlocked: true // All topics are now unlocked
      }))
    };
  }
  return null;
}

const levelDataMock: Record<string, LevelData> = {};

function LearningLevelPage() {
  const { level: levelId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const levelInfo = getLevelData(levelId) || levelDataMock[levelId];

  // Refresh level data when returning from a topic (to show updated progress)
  useEffect(() => {
    const handleFocus = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Also refresh when the URL changes back to just the level
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [levelId]);
  
  if (!levelInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Level Not Found</h1>
          <Link to="/learn" className="btn btn-primary">
            Back to Learning Path
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((levelInfo.completedTopics / levelInfo.totalTopics) * 100);

  // Check if we're on a topic route by looking at the current location
  const isTopicRoute = window.location.pathname.split('/').length > 3;
  
  if (isTopicRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${levelInfo.color} text-white py-8 lg:py-12`}>
        <div className="container-app">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              to="/learn"
              className="inline-flex items-center text-white/80 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Learning Path
            </Link>
          </nav>

          {/* Level Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                {levelInfo.difficulty}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                {levelInfo.title}
              </h1>
              <p className="text-lg lg:text-xl text-white/90 mb-6">
                {levelInfo.description}
              </p>
              <p className="text-white/80 leading-relaxed">
                {levelInfo.overview}
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Completed</span>
                  <span className="text-sm font-bold">{levelInfo.completedTopics}/{levelInfo.totalTopics}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="h-3 bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-center">
                {progressPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Topics List */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Learning Topics</h2>
            <div className="space-y-4">
              {levelInfo.topics.map((topic, index) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  index={index}
                  isSelected={selectedTopic === topic.id}
                  onSelect={() => setSelectedTopic(topic.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4 text-gray-900">Level Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Topics</span>
                    <span className="font-medium">{levelInfo.totalTopics}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">{levelInfo.completedTopics}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-primary-600">{progressPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4 text-gray-900">Next Steps</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    All topics are available! Choose any topic to start learning or review completed material.
                  </p>
                  {levelInfo.completedTopics === levelInfo.totalTopics && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">Level Complete!</span>
                      </div>
                      <p className="text-green-700 text-xs mt-1">
                        You've mastered all foundation concepts. Ready for the next level!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Resources */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4 text-gray-900">Need More Help?</h3>
                <div className="space-y-4">
                  <Link
                    to="/guides"
                    className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-700">Study Guides</div>
                        <div className="text-gray-600 text-xs">In-depth references and examples</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/practice"
                    search={{ category: 
                      levelId === 'foundation' ? 'DIMENSIONAL_ANALYSIS' :
                      levelId === 'conversions' ? 'UNIT_CONVERSION' :
                      levelId === 'medications' ? 'DOSAGE_CALCULATION' :
                      levelId === 'clinical' ? 'IV_DRIP_RATE' : undefined
                    }}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm group-hover:text-purple-700">Practice Questions</div>
                        <div className="text-gray-600 text-xs">Test your knowledge</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Debug Panel - Development Only */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 rounded-xl shadow-sm p-4">
                  <h4 className="font-semibold mb-3 text-gray-800 text-sm">Progress Debug</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Completed Topics:</strong> {getAnonymousProgress().completedTopics.join(', ') || 'None'}
                    </div>
                    <div>
                      <strong>Sections:</strong> {JSON.stringify(getAnonymousProgress().completedSections, null, 2)}
                    </div>
                    <button 
                      onClick={() => {
                        clearProgress();
                        setRefreshTrigger(prev => prev + 1);
                      }}
                      className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Clear Progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TopicCardProps {
  topic: Topic;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TopicCard({ topic, index, isSelected, onSelect }: TopicCardProps) {
  const { level: levelId } = Route.useParams();

  const getTypeIcon = (type: Topic['type']) => {
    switch (type) {
      case 'concept':
        return <Book className="w-5 h-5" />;
      case 'practice':
        return <Target className="w-5 h-5" />;
      case 'assessment':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Topic['type']) => {
    switch (type) {
      case 'concept':
        return 'from-blue-500 to-blue-600 bg-blue-100 text-blue-700';
      case 'practice':
        return 'from-purple-500 to-purple-600 bg-purple-100 text-purple-700';
      case 'assessment':
        return 'from-amber-500 to-amber-600 bg-amber-100 text-amber-700';
      default:
        return 'from-gray-500 to-gray-600 bg-gray-100 text-gray-700';
    }
  };

  const typeColors = getTypeColor(topic.type).split(' ');
  const gradientColors = typeColors.slice(0, 2).join(' ');
  const badgeColors = typeColors.slice(2).join(' ');

  if (topic.isUnlocked) {
    return (
      <Link
        to="/learn/$level/$topic"
        params={{ level: levelId, topic: topic.id }}
        className="block"
      >
        <div 
          className={`group relative bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              {/* Topic Number & Icon */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColors} flex items-center justify-center text-white font-bold shadow-sm`}>
                  {topic.isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-700">
                      {topic.title}
                    </h3>
                    {topic.isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badgeColors}`}>
                  {getTypeIcon(topic.type)}
                  {topic.type.charAt(0).toUpperCase() + topic.type.slice(1)}
                </span>
                <span className="text-sm text-gray-500">{topic.duration}</span>
              </div>
              
              <div className="flex items-center gap-2 text-primary-600 group-hover:text-primary-700">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {topic.isCompleted ? 'Review' : 'Start'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {topic.isCompleted && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-xl" />
          )}
        </div>
      </Link>
    );
  }

  // Since all topics are now unlocked, this should not be reached
  // But keeping it as fallback
  return (
    <Link
      to="/learn/$level/$topic"
      params={{ level: levelId, topic: topic.id }}
      className="block"
    >
      <div 
        className="group relative bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Topic Number & Icon */}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColors} flex items-center justify-center text-white font-bold shadow-sm`}>
                {topic.isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-700">
                    {topic.title}
                  </h3>
                  {topic.isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {topic.description}
                </p>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badgeColors}`}>
                {getTypeIcon(topic.type)}
                {topic.type.charAt(0).toUpperCase() + topic.type.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{topic.duration}</span>
            </div>
            
            <div className="flex items-center gap-2 text-primary-600 group-hover:text-primary-700">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">
                {topic.isCompleted ? 'Review' : 'Start'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {topic.isCompleted && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-xl" />
        )}
      </div>
    </Link>
  );
}