import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Book, Target, Trophy } from 'lucide-react';
import { ConceptCard, StepByStepGuide, QuickPractice, MasteryCheck } from '../../../components/learning';
import foundationContent from '../../../lib/learning/foundation';
import conversionsContent from '../../../lib/learning/conversions';
import medicationsContent from '../../../lib/learning/medications';
import clinicalContent from '../../../lib/learning/clinical';
import { completeSection, isSectionCompleted, isTopicCompleted } from '../../../lib/learning/progress';

export const Route = createFileRoute("/learn/$level/$topic")({
  component: LearningTopicPage,
});

function LearningTopicPage() {
  const { level: levelId, topic: topicId } = Route.useParams();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Scroll to top when topic changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId]);

  // Refresh component when progress changes
  const forceRefresh = () => setRefreshTrigger(prev => prev + 1);
  
  // Get content based on level and topic
  let topicContent = null;
  let levelData = null;
  
  if (levelId === 'foundation') {
    levelData = foundationContent;
    topicContent = foundationContent.topics.find(t => t.id === topicId);
  } else if (levelId === 'conversions') {
    levelData = conversionsContent;
    topicContent = conversionsContent.topics.find(t => t.id === topicId);
  } else if (levelId === 'medications') {
    levelData = medicationsContent;
    topicContent = medicationsContent.topics.find(t => t.id === topicId);
  } else if (levelId === 'clinical') {
    levelData = clinicalContent;
    topicContent = clinicalContent.topics.find(t => t.id === topicId);
  }
  
  if (!topicContent || !levelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
          <Link to="/learn" className="btn btn-primary">
            Back to Learning Path
          </Link>
        </div>
      </div>
    );
  }

  const handleSectionComplete = (sectionType: string, score?: number) => {
    if (topicId) {
      // Check if this topic has a stepByStep section
      const hasStepByStep = !!topicContent?.content.stepByStep;
      completeSection(topicId, sectionType, score, hasStepByStep);
      forceRefresh(); // Update UI to show completion
    }
  };

  const getTopicIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept':
        return 'bg-blue-500';
      case 'practice':
        return 'bg-purple-500';
      case 'assessment':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentTopicIndex = levelData.topics.findIndex(t => t.id === topicId);
  const nextTopic = levelData.topics[currentTopicIndex + 1];
  const prevTopic = levelData.topics[currentTopicIndex - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${getTypeColor(topicContent.type)} text-white py-8`}>
        <div className="container-app">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/learn"
                className="text-white/80 hover:text-white transition-colors"
              >
                Learning Path
              </Link>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <Link
                to="/learn/$level"
                params={{ level: levelId }}
                className="text-white/80 hover:text-white transition-colors"
              >
                {levelData.level.title}
              </Link>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <span className="text-white">{topicContent.title}</span>
            </div>
          </nav>

          {/* Topic Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              {getTopicIcon(topicContent.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{topicContent.title}</h1>
              <p className="text-white/90">{topicContent.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/80">
            <span>Duration: {topicContent.duration}</span>
            <span>•</span>
            <span className="capitalize">{topicContent.type}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <span className="text-sm text-gray-600">
                Topic {currentTopicIndex + 1} of {levelData.topics.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 ${getTypeColor(topicContent.type)} rounded-full transition-all duration-500`}
                style={{ width: `${((currentTopicIndex + 1) / levelData.topics.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Learning Content */}
          <div className="space-y-8">
            {/* Concept Section */}
            {topicContent.content.concept && (
              <section id="concept">
                <ConceptCard
                  {...topicContent.content.concept}
                  onComplete={() => handleSectionComplete('concept')}
                  isCompleted={isSectionCompleted(topicId, 'concept')}
                />
              </section>
            )}

            {/* Step-by-Step Section */}
            {topicContent.content.stepByStep && (
              <section id="stepByStep">
                <StepByStepGuide
                  {...topicContent.content.stepByStep}
                  onComplete={() => handleSectionComplete('stepByStep')}
                  isCompleted={isSectionCompleted(topicId, 'stepByStep')}
                />
              </section>
            )}

            {/* Assessment Section */}
            {topicContent.content.assessment && (
              <section id="assessment">
                <MasteryCheck
                  {...topicContent.content.assessment}
                  onComplete={(result) => {
                    if (result.passed) {
                      handleSectionComplete('assessment', result.score);
                    }
                  }}
                  isCompleted={isSectionCompleted(topicId, 'assessment')}
                />
              </section>
            )}

          </div>

          {/* Practice Integration */}
          <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Test Your Skills?</h3>
                <p className="text-gray-600 text-sm">Practice what you've learned with targeted questions</p>
              </div>
              <Link
                to="/practice"
                search={{ category: 
                  levelId === 'foundation' ? 'DIMENSIONAL_ANALYSIS' :
                  levelId === 'conversions' ? 'UNIT_CONVERSION' :
                  levelId === 'medications' ? 'DOSAGE_CALCULATION' :
                  levelId === 'clinical' ? 'IV_DRIP_RATE' : undefined
                }}
                className="btn btn-primary flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Practice Now
              </Link>
            </div>
          </div>

          {/* Memorization Training Integration - Only for Conversions */}
          {levelId === 'conversions' && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Instant Recall?</h3>
                  <p className="text-gray-600 text-sm">Master conversions through focused memorization training</p>
                </div>
                <Link
                  to="/memorize/conversions"
                  className="btn btn-outline flex items-center gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Memorize Now
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Previous Topic */}
              <div className="flex-1">
                {prevTopic && (
                  <Link
                    to="/learn/$level/$topic"
                    params={{ level: levelId, topic: prevTopic.id }}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="font-medium">{prevTopic.title}</div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Back to Level */}
              <div className="flex-1 text-center">
                <Link
                  to="/learn/$level"
                  params={{ level: levelId }}
                  className="btn btn-secondary"
                >
                  Back to {levelData.level.title}
                </Link>
              </div>

              {/* Next Topic */}
              <div className="flex-1 text-right">
                {nextTopic ? (
                  <Link
                    to="/learn/$level/$topic"
                    params={{ level: levelId, topic: nextTopic.id }}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="font-medium">{nextTopic.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Level Complete!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}