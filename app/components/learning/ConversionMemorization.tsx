import { useState } from 'react';
import { Brain, Target, RotateCcw, Book, Zap, Trophy } from 'lucide-react';
import { FlashCard } from './FlashCard';
import { ConversionDrill } from './ConversionDrill';
import { ConversionReference } from './ConversionReference';
import { conversionData, getAllConversions, getCriticalConversions, type Conversion } from '../../lib/learning/conversions-data';
import type { DrillResults } from './ConversionDrill';

export interface ConversionMemorizationProps {
  onComplete?: (mastered: number, total: number) => void;
}

type MemorizationMode = 'overview' | 'flashcards' | 'drill' | 'reference' | 'results';

interface MemorizationState {
  mode: MemorizationMode;
  currentConversion: number;
  masteredConversions: Set<string>;
  flashcardResults: { correct: number; total: number };
  drillResults: DrillResults | null;
}

export function ConversionMemorization({ onComplete }: ConversionMemorizationProps) {
  const [state, setState] = useState<MemorizationState>({
    mode: 'overview',
    currentConversion: 0,
    masteredConversions: new Set(),
    flashcardResults: { correct: 0, total: 0 },
    drillResults: null
  });

  const criticalConversions = getCriticalConversions();
  const allConversions = getAllConversions(false);

  const handleModeChange = (mode: MemorizationMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const handleFlashcardAnswer = (correct: boolean) => {
    setState(prev => ({
      ...prev,
      flashcardResults: {
        correct: prev.flashcardResults.correct + (correct ? 1 : 0),
        total: prev.flashcardResults.total + 1
      }
    }));

    if (correct) {
      const currentConv = criticalConversions[state.currentConversion];
      setState(prev => ({
        ...prev,
        masteredConversions: new Set([...prev.masteredConversions, currentConv.id])
      }));
    }
  };

  const handleNextFlashcard = () => {
    setState(prev => ({
      ...prev,
      currentConversion: (prev.currentConversion + 1) % criticalConversions.length
    }));
  };

  const handleDrillComplete = (results: DrillResults) => {
    setState(prev => ({ ...prev, drillResults: results, mode: 'results' }));
  };

  const resetProgress = () => {
    setState({
      mode: 'overview',
      currentConversion: 0,
      masteredConversions: new Set(),
      flashcardResults: { correct: 0, total: 0 },
      drillResults: null
    });
  };

  const masteryPercentage = state.masteredConversions.size / criticalConversions.length * 100;

  if (state.mode === 'flashcards') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleModeChange('overview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Overview
          </button>
          <div className="text-sm text-gray-600">
            {state.currentConversion + 1} of {criticalConversions.length} • {state.masteredConversions.size} mastered
          </div>
        </div>

        <FlashCard
          conversion={criticalConversions[state.currentConversion]}
          onAnswer={handleFlashcardAnswer}
          onNext={handleNextFlashcard}
          showHints={true}
        />

        <div className="text-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Mastery Progress: {Math.round(masteryPercentage)}%
          </p>
        </div>
      </div>
    );
  }

  if (state.mode === 'drill') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleModeChange('overview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Overview
          </button>
        </div>

        <ConversionDrill
          conversions={allConversions}
          timeLimit={60}
          questionCount={20}
          onComplete={handleDrillComplete}
          difficulty="mixed"
        />
      </div>
    );
  }

  if (state.mode === 'reference') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleModeChange('overview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Overview
          </button>
        </div>

        <ConversionReference
          searchable={true}
          showMemoryTricks={true}
          compact={false}
        />
      </div>
    );
  }

  if (state.mode === 'results' && state.drillResults) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Drill Complete!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {state.drillResults.score}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {state.drillResults.correctAnswers}/{state.drillResults.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(state.drillResults.timeElapsed)}s
              </div>
              <div className="text-sm text-gray-600">Time Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(state.drillResults.questionsPerMinute)}
              </div>
              <div className="text-sm text-gray-600">Q/Min</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleModeChange('drill')}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={() => handleModeChange('overview')}
              className="btn btn-secondary"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Overview mode
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Conversion Memorization Mastery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master the essential unit conversions that every healthcare professional needs to know by heart.
          Use flashcards, speed drills, and reference materials to build instant recall.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {state.masteredConversions.size}
            </div>
            <div className="text-sm text-gray-600">Conversions Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {Math.round(masteryPercentage)}%
            </div>
            <div className="text-sm text-gray-600">Mastery Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {state.flashcardResults.total}
            </div>
            <div className="text-sm text-gray-600">Cards Reviewed</div>
          </div>
        </div>
        
        {masteryPercentage > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Learning Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Flashcards</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Learn conversions through spaced repetition. Rate your confidence to optimize learning.
          </p>
          <button
            onClick={() => handleModeChange('flashcards')}
            className="w-full btn btn-primary"
          >
            Start Flashcards
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Speed Drill</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Test your recall speed with timed practice. Build automatic responses for clinical situations.
          </p>
          <button
            onClick={() => handleModeChange('drill')}
            className="w-full btn btn-primary"
          >
            Start Speed Drill
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Reference</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Browse the complete conversion table with memory tricks and common mistakes to avoid.
          </p>
          <button
            onClick={() => handleModeChange('reference')}
            className="w-full btn btn-primary"
          >
            View Reference
          </button>
        </div>
      </div>

      {/* Critical Conversions Preview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-600" />
          Critical Conversions to Master
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900 mb-2">Weight Conversions:</div>
            <ul className="space-y-1 text-gray-700">
              <li>• 1 kg = 2.2 lbs</li>
              <li>• 1 g = 1000 mg</li>
              <li>• 1 mg = 1000 mcg</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-2">Volume Conversions:</div>
            <ul className="space-y-1 text-gray-700">
              <li>• 1 mL = 1 cc</li>
              <li>• 1 tsp = 5 mL</li>
              <li>• 1 Tbsp = 15 mL</li>
              <li>• 1 oz = 30 mL</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Progress */}
      {(state.masteredConversions.size > 0 || state.flashcardResults.total > 0) && (
        <div className="text-center">
          <button
            onClick={resetProgress}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}