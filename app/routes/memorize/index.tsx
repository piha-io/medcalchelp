import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Calculator, Target, Timer, Trophy, Zap, Book, ArrowRight } from 'lucide-react';

export const Route = createFileRoute("/memorize/")({
  component: MemorizeIndexPage,
});

function MemorizeIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="w-full px-4 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-1 px-4 bg-indigo-100 rounded-full mb-6">
              <Brain className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-indigo-700 text-sm font-medium">
                Focus • Memorize • Master
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              Memorization 
              <span className="text-indigo-600"> Training</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build instant recall of critical medical facts through focused, distraction-free practice. 
              Master the essential conversions, formulas, and values that need to be second nature.
            </p>
          </div>
        </div>
      </div>

      {/* Available Tools */}
      <div className="w-full px-4 lg:px-8 py-8">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Available Training Tools
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-16">
            {/* Unit Conversions */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Calculator className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Available Now
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Unit Conversions
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Master critical medical conversions through flashcards, speed drills, and interactive reference. 
                  Build automatic recall of kg↔lbs, mg↔mcg, mL↔oz, and more.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">45+</div>
                    <div>Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">3</div>
                    <div>Study Modes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">∞</div>
                    <div>Practice</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    to="/memorize/conversions"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Start Training
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>Speed Drills</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span>Flashcards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      <span>Reference</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon - Medication Calculations */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 opacity-75">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Coming Soon
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                  Medication Formulas
                </h3>
                
                <p className="text-gray-500 mb-6">
                  Memorize essential dosage calculation formulas, drug classifications, and therapeutic ranges 
                  for instant recall during clinical practice.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-400">
                  <div className="text-center">
                    <div className="font-semibold">50+</div>
                    <div>Formulas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">3</div>
                    <div>Study Modes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">∞</div>
                    <div>Practice</div>
                  </div>
                </div>
                
                <button 
                  disabled
                  className="w-full bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>Timed Recall</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span>Spaced Rep</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>Mastery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Memorization Training */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Focused Memorization Training?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Recall</h3>
                <p className="text-gray-600 text-sm">
                  Build automatic responses for critical values that need to be second nature in clinical situations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Focused Practice</h3>
                <p className="text-gray-600 text-sm">
                  Distraction-free environment designed specifically for memorization without learning path interruptions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Proven Methods</h3>
                <p className="text-gray-600 text-sm">
                  Spaced repetition, active recall, and confidence-based learning optimize long-term retention.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              💡 Quick Start Tips
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">For Best Results:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Practice in short, focused 15-20 minute sessions</li>
                  <li>• Use flashcards first to learn, then drills for speed</li>
                  <li>• Be honest about your confidence level</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Study Schedule:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Daily practice is more effective than long sessions</li>
                  <li>• Review difficult conversions more frequently</li>
                  <li>• Use reference mode to reinforce learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}