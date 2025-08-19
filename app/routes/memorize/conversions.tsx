import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Timer, Focus, Sun, Moon, RotateCcw } from 'lucide-react';
import { FlashCard } from '../../components/learning/FlashCard';
import { ConversionDrill } from '../../components/learning/ConversionDrill';
import { ConversionReference } from '../../components/learning/ConversionReference';
import { conversionData, getAllConversions, getCriticalConversions, type Conversion } from '../../lib/learning/conversions-data';
import type { DrillResults } from '../../components/learning/ConversionDrill';

export const Route = createFileRoute("/memorize/conversions")({
  component: ConversionMemorizePage,
});

type MemorizationMode = 'dashboard' | 'flashcards' | 'drill' | 'reference';
type ViewMode = 'normal' | 'fullscreen' | 'focus';

interface SessionState {
  mode: MemorizationMode;
  viewMode: ViewMode;
  currentConversion: number;
  masteredConversions: Set<string>;
  sessionStartTime: number;
  totalCardsReviewed: number;
  correctAnswers: number;
  darkMode: boolean;
  drillResults: DrillResults | null;
}

function ConversionMemorizePage() {
  const [session, setSession] = useState<SessionState>({
    mode: 'dashboard',
    viewMode: 'normal',
    currentConversion: 0,
    masteredConversions: new Set(),
    sessionStartTime: Date.now(),
    totalCardsReviewed: 0,
    correctAnswers: 0,
    darkMode: false,
    drillResults: null
  });

  const criticalConversions = getCriticalConversions();
  const allConversions = getAllConversions(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
          case 'd':
            e.preventDefault();
            toggleDarkMode();
            break;
          case '1':
            e.preventDefault();
            setSession(prev => ({ ...prev, mode: 'flashcards' }));
            break;
          case '2':
            e.preventDefault();
            setSession(prev => ({ ...prev, mode: 'drill' }));
            break;
          case '3':
            e.preventDefault();
            setSession(prev => ({ ...prev, mode: 'reference' }));
            break;
        }
      }
      
      if (e.key === 'Escape' && session.viewMode !== 'normal') {
        setSession(prev => ({ ...prev, viewMode: 'normal' }));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [session.viewMode]);

  const toggleFullscreen = () => {
    setSession(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'fullscreen' ? 'normal' : 'fullscreen'
    }));
  };

  const toggleFocusMode = () => {
    setSession(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'focus' ? 'normal' : 'focus'
    }));
  };

  const toggleDarkMode = () => {
    setSession(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const startNewSession = () => {
    setSession(prev => ({
      ...prev,
      sessionStartTime: Date.now(),
      totalCardsReviewed: 0,
      correctAnswers: 0,
      currentConversion: 0,
      masteredConversions: new Set(),
      drillResults: null
    }));
  };

  const handleFlashcardAnswer = (correct: boolean) => {
    setSession(prev => ({
      ...prev,
      totalCardsReviewed: prev.totalCardsReviewed + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0)
    }));

    if (correct) {
      const currentConv = criticalConversions[session.currentConversion];
      setSession(prev => ({
        ...prev,
        masteredConversions: new Set([...prev.masteredConversions, currentConv.id])
      }));
    }
  };

  const handleNextFlashcard = () => {
    setSession(prev => ({
      ...prev,
      currentConversion: (prev.currentConversion + 1) % criticalConversions.length
    }));
  };

  const handleDrillComplete = (results: DrillResults) => {
    setSession(prev => ({ ...prev, drillResults: results }));
  };

  const masteryPercentage = (session.masteredConversions.size / criticalConversions.length) * 100;
  const accuracy = session.totalCardsReviewed > 0 ? (session.correctAnswers / session.totalCardsReviewed) * 100 : 0;

  // Layout classes based on view mode
  const getLayoutClasses = () => {
    const baseClasses = session.darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-50 min-h-screen';
    
    switch (session.viewMode) {
      case 'fullscreen':
        return `${baseClasses} fixed inset-0 z-50 overflow-auto`;
      case 'focus':
        return `${baseClasses} fixed inset-0 z-50 overflow-auto`;
      default:
        return baseClasses;
    }
  };

  const getContainerClasses = () => {
    switch (session.viewMode) {
      case 'focus':
        return 'w-full px-4 py-8';
      case 'fullscreen':
        return 'w-full px-4 py-4';
      default:
        return 'w-full px-4 py-8';
    }
  };

  const showHeader = session.viewMode !== 'focus';
  const showStats = session.viewMode === 'normal';

  return (
    <div className={getLayoutClasses()}>
      {showHeader && (
        <div className={`sticky top-0 z-40 ${session.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/memorize"
                  className={`flex items-center gap-2 ${session.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Memorize
                </Link>
                
                <div className={`h-6 w-px ${session.darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                
                <h1 className={`text-lg font-semibold ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Unit Conversion Training
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Session Stats */}
                {showStats && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-green-600">
                      {session.masteredConversions.size}/{criticalConversions.length} mastered
                    </div>
                    {session.totalCardsReviewed > 0 && (
                      <div className="text-blue-600">
                        {Math.round(accuracy)}% accuracy
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-lg ${session.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                    title="Toggle dark mode (Ctrl+D)"
                  >
                    {session.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={toggleFocusMode}
                    className={`p-2 rounded-lg ${session.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                    title="Toggle focus mode"
                  >
                    <Focus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className={`p-2 rounded-lg ${session.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                    title="Toggle fullscreen (Ctrl+F)"
                  >
                    {session.viewMode === 'fullscreen' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={startNewSession}
                    className={`p-2 rounded-lg ${session.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                    title="Reset session"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            {session.mode === 'dashboard' && (
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'flashcards' }))}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  Flashcards (Ctrl+1)
                </button>
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'drill' }))}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                >
                  Speed Drill (Ctrl+2)
                </button>
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'reference' }))}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  Reference (Ctrl+3)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={getContainerClasses()}>
        {session.mode === 'dashboard' && (
          <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-4 ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                Choose Your Training Mode
              </h2>
              <p className={`text-lg ${session.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Focused, distraction-free memorization training
              </p>
            </div>

            {/* Training Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setSession(prev => ({ ...prev, mode: 'flashcards' }))}
                className={`p-6 rounded-xl text-left hover:scale-105 transition-all ${
                  session.darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Flashcards
                </h3>
                <p className={`text-sm ${session.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Learn conversions through confidence-based spaced repetition
                </p>
              </button>

              <button
                onClick={() => setSession(prev => ({ ...prev, mode: 'drill' }))}
                className={`p-6 rounded-xl text-left hover:scale-105 transition-all ${
                  session.darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Speed Drill
                </h3>
                <p className={`text-sm ${session.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Build automatic recall with timed practice sessions
                </p>
              </button>

              <button
                onClick={() => setSession(prev => ({ ...prev, mode: 'reference' }))}
                className={`p-6 rounded-xl text-left hover:scale-105 transition-all ${
                  session.darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reference
                </h3>
                <p className={`text-sm ${session.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Browse the complete conversion table with memory tricks
                </p>
              </button>
            </div>

            {/* Progress Overview */}
            {(session.totalCardsReviewed > 0 || session.masteredConversions.size > 0) && (
              <div className={`p-6 rounded-xl ${session.darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${session.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Current Session
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{session.masteredConversions.size}</div>
                    <div className={`text-sm ${session.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mastered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{session.totalCardsReviewed}</div>
                    <div className={`text-sm ${session.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reviewed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{Math.round(accuracy)}%</div>
                    <div className={`text-sm ${session.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {session.mode === 'flashcards' && (
          <div className="space-y-6">
            {showHeader && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'dashboard' }))}
                  className={`flex items-center gap-2 ${session.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  ← Back to Dashboard
                </button>
                <div className={`text-sm ${session.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {session.currentConversion + 1} of {criticalConversions.length} • {session.masteredConversions.size} mastered
                </div>
              </div>
            )}

            <FlashCard
              conversion={criticalConversions[session.currentConversion]}
              onAnswer={handleFlashcardAnswer}
              onNext={handleNextFlashcard}
              showHints={true}
            />

            {/* Progress bar */}
            <div className="text-center">
              <div className={`w-full ${session.darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-2`}>
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
              <p className={`text-sm ${session.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mastery Progress: {Math.round(masteryPercentage)}%
              </p>
            </div>
          </div>
        )}

        {session.mode === 'drill' && (
          <div className="space-y-6">
            {showHeader && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'dashboard' }))}
                  className={`flex items-center gap-2 ${session.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  ← Back to Dashboard
                </button>
              </div>
            )}

            <ConversionDrill
              conversions={allConversions}
              timeLimit={60}
              questionCount={20}
              onComplete={handleDrillComplete}
              difficulty="mixed"
            />
          </div>
        )}

        {session.mode === 'reference' && (
          <div className="space-y-6">
            {showHeader && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSession(prev => ({ ...prev, mode: 'dashboard' }))}
                  className={`flex items-center gap-2 ${session.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  ← Back to Dashboard
                </button>
              </div>
            )}

            <ConversionReference
              searchable={true}
              showMemoryTricks={true}
              compact={false}
            />
          </div>
        )}
      </div>

      {/* Keyboard shortcuts help */}
      {session.viewMode === 'focus' && (
        <div className="fixed bottom-4 right-4 text-xs opacity-50">
          Press Esc to exit focus mode
        </div>
      )}
    </div>
  );
}