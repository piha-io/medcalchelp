import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth/AuthContext";
import { Calculator, Brain, Target, Timer, Trophy, Book, Github, Twitter, Mail, ExternalLink, Zap } from 'lucide-react';

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="py-4 sm:py-6 lg:py-8">
      <div className="space-y-12 sm:space-y-16 lg:space-y-20 overflow-hidden">
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-10 lg:py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center p-1 px-4 bg-primary-100 rounded-full mb-6">
            <span className="text-primary-700 text-sm font-medium">
              Perfect for students and nurses preparing for exams
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 text-balance">
            Master Medical Math with{" "}
            <span className="text-primary-600">Confidence</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto text-balance">
            Built for students and nurses to stay sharp. Practice dosage
            calculations, IV drip rates, and unit conversions with real-world
            scenarios and instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/learn" className="btn btn-primary btn-lg group">
                  Continue Learning
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link to="/practice" className="btn btn-secondary btn-lg group">
                  Quick Practice
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link to="/memorize" className="btn btn-outline btn-lg group">
                  Memorize Facts
                  <Zap className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/learn"
                  className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl group"
                >
                  Start Learning Path
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/practice"
                  className="btn btn-secondary btn-lg shadow-xl hover:shadow-2xl group"
                >
                  Start Free Practice
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/memorize"
                  className="btn btn-outline btn-lg shadow-xl hover:shadow-2xl group"
                >
                  Try Memorization
                  <Zap className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4 text-gray-900">
              Master Medical Math for <span className="text-primary-600">NCLEX Success</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Practice the exact calculations you'll see on your exam with instant feedback and detailed explanations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<Calculator className="w-full h-full" />}
              title="NCLEX-Style Questions"
              description="Practice dosage calculations, IV rates, and unit conversions exactly as they appear on the real exam"
              color="primary"
              highlight="500+ Questions"
            />
            <FeatureCard
              icon={<Brain className="w-full h-full" />}
              title="Instant Learning"
              description="Get immediate explanations for every answer to understand the 'why' behind each calculation"
              color="secondary"
              highlight="Step-by-Step"
            />
            <FeatureCard
              icon={<Target className="w-full h-full" />}
              title="Weakness Detection"
              description="Focus your study time on areas where you need the most improvement with smart tracking"
              color="accent"
              highlight="Adaptive"
            />
            <FeatureCard
              icon={<Timer className="w-full h-full" />}
              title="Exam Preparation"
              description="Build speed and confidence with timed practice sessions that mirror real testing conditions"
              color="purple"
              highlight="Timed Practice"
            />
            <FeatureCard
              icon={<Trophy className="w-full h-full" />}
              title="Progress Tracking"
              description="Watch your scores improve over time with detailed analytics and achievement badges"
              color="amber"
              highlight="Visual Progress"
            />
            <FeatureCard
              icon={<Zap className="w-full h-full" />}
              title="Memorization Training"
              description="Build instant recall of critical conversions and formulas through flashcards and speed drills"
              color="indigo"
              highlight="Focused Practice"
            />
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-12 lg:py-16 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4 gradient-text">Learn Med Math</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Master medical math calculations with confidence. Practice NCLEX-style questions 
                and build the skills you need for nursing success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="mailto:support@learnmedmath.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Learning */}
            <div>
              <h4 className="font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/learn" className="text-gray-400 hover:text-white transition-colors">
                    Learning Path
                  </Link>
                </li>
                <li>
                  <Link to="/practice" className="text-gray-400 hover:text-white transition-colors">
                    Practice Questions
                  </Link>
                </li>
                <li>
                  <Link to="/memorize" className="text-gray-400 hover:text-white transition-colors">
                    Memorization Training
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-gray-400 hover:text-white transition-colors">
                    Study Guides
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/auth" className="text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Learn Med Math. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built for nursing students</span>
              <div className="flex items-center space-x-1">
                <span className="text-red-500">❤️</span>
                <span className="text-gray-400 text-sm">by </span>
                <a href="https://piha.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm underline">
                  piha
                </a>
              </div>
            </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  highlight: string;
}) {
  const colorClasses =
    {
      primary: "from-primary-500 to-primary-600 text-primary-600",
      secondary: "from-secondary-500 to-secondary-600 text-secondary-600",
      accent: "from-accent-500 to-accent-600 text-accent-600",
      purple: "from-purple-500 to-purple-600 text-purple-600",
      amber: "from-amber-500 to-amber-600 text-amber-600",
      green: "from-green-500 to-green-600 text-green-600",
    }[color] || "from-gray-500 to-gray-600 text-gray-600";

  const badgeClasses =
    {
      primary: "bg-primary-100 text-primary-700",
      secondary: "bg-secondary-100 text-secondary-700",
      accent: "bg-accent-100 text-accent-700",
      purple: "bg-purple-100 text-purple-700",
      amber: "bg-amber-100 text-amber-700",
      green: "bg-green-100 text-green-700",
    }[color] || "bg-gray-100 text-gray-700";

  return (
    <div className="card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-transparent hover:border-primary-500 relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses} rounded-xl flex items-center justify-center shadow-lg`}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses} shadow-sm`}>
          {highlight}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
}
