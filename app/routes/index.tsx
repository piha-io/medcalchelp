import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth/AuthContext'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-16 sm:space-y-20 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 lg:py-16 animate-fade-in relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center p-1 px-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6 animate-bounce-in">
            <span className="text-primary-700 text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Trusted by 10,000+ nursing professionals
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 text-balance">
            Master Medical Math with{' '}
            <span className="gradient-text-vibrant">Confidence</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto text-balance">
            Built by nurses, for nurses. Practice dosage calculations, IV drip rates, 
            and unit conversions with real-world scenarios and instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/practice" className="btn btn-primary btn-lg group">
                Continue Practice
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/practice" className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl group">
                  Start Free Practice
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/auth/register" className="btn btn-secondary btn-lg">
                  Create Account
                </Link>
              </>
            )}
          </div>
          
          {/* Animated medical icons */}
          <div className="mt-12 flex justify-center gap-8 opacity-30">
            <div className="animate-float" style={{ animationDelay: '0s' }}>
              <HeartPulseIcon />
            </div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              <StethoscopeIcon />
            </div>
            <div className="animate-float" style={{ animationDelay: '2s' }}>
              <PillIcon />
            </div>
            <div className="animate-float" style={{ animationDelay: '3s' }}>
              <SyringeIcon />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-secondary-50"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <TrustMetric value="10,000+" label="Active Nurses" icon={<UsersIcon />} delay="0s" />
            <TrustMetric value="500,000+" label="Problems Solved" icon={<CheckCircleIcon />} delay="0.1s" />
            <TrustMetric value="98%" label="Pass Rate Improvement" icon={<TrendingUpIcon />} delay="0.2s" />
            <TrustMetric value="4.9/5" label="User Rating" icon={<StarIcon />} delay="0.3s" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-display font-bold text-center mb-4 text-gray-900">
          Everything You Need to <span className="gradient-text-warm">Excel</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our comprehensive platform is designed to help you master medical calculations with confidence and ease.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard
            icon={<CalculatorIcon />}
            title="Real-World Scenarios"
            description="Practice with actual medication orders and clinical situations you'll encounter on the floor"
            color="primary"
            delay="0s"
          />
          <FeatureCard
            icon={<ChartIcon />}
            title="Adaptive Learning"
            description="Questions adjust to your skill level, focusing on areas where you need the most practice"
            color="secondary"
            delay="0.1s"
          />
          <FeatureCard
            icon={<ClockIcon />}
            title="Learn at Your Pace"
            description="Study during breaks, between shifts, or whenever you have time. Progress saves automatically"
            color="accent"
            delay="0.2s"
          />
          <FeatureCard
            icon={<BookIcon />}
            title="Detailed Explanations"
            description="Step-by-step solutions help you understand the 'why' behind every calculation"
            color="purple"
            delay="0.3s"
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="NCLEX-RN Aligned"
            description="Questions mirror the format and difficulty of nursing board examinations"
            color="amber"
            delay="0.4s"
          />
          <FeatureCard
            icon={<HeartIcon />}
            title="Built by Nurses"
            description="Created by experienced RNs who understand the challenges of medication math"
            color="accent"
            delay="0.5s"
          />
        </div>
      </section>

      {/* Categories Section with gradient background */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-labelledby="categories-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50"></div>
        <div className="relative max-w-6xl mx-auto">
          <h2 id="categories-heading" className="text-3xl sm:text-4xl font-display font-bold text-center mb-4 text-gray-900">
            Comprehensive Practice Categories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Master every type of medical calculation with our extensive question library.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <CategoryCard 
              title="Dosage Calculations" 
              description="Oral, IM, SubQ medications"
              questionCount={50}
              difficulty="Beginner to Advanced"
              gradient="from-primary-500 to-primary-600"
              delay="0s"
            />
            <CategoryCard 
              title="IV Drip Rates" 
              description="mL/hr, gtt/min, pump settings"
              questionCount={40}
              difficulty="Intermediate"
              gradient="from-secondary-500 to-secondary-600"
              delay="0.1s"
            />
            <CategoryCard 
              title="Unit Conversions" 
              description="Metric, household, apothecary"
              questionCount={30}
              difficulty="Beginner"
              gradient="from-purple-500 to-purple-600"
              delay="0.2s"
            />
            <CategoryCard 
              title="Pediatric Dosing" 
              description="Weight-based calculations"
              questionCount={25}
              difficulty="Advanced"
              gradient="from-accent-500 to-accent-600"
              delay="0.3s"
            />
            <CategoryCard 
              title="Critical Care" 
              description="Vasoactive drips, titrations"
              questionCount={35}
              difficulty="Advanced"
              gradient="from-amber-500 to-amber-600"
              delay="0.4s"
            />
            <CategoryCard 
              title="Insulin Dosing" 
              description="Sliding scale, corrections"
              questionCount={20}
              difficulty="Intermediate"
              gradient="from-primary-500 to-secondary-500"
              delay="0.5s"
            />
            <CategoryCard 
              title="Heparin Protocol" 
              description="Bolus and infusion rates"
              questionCount={15}
              difficulty="Advanced"
              gradient="from-secondary-500 to-purple-500"
              delay="0.6s"
            />
            <CategoryCard 
              title="Reconstitution" 
              description="Powder to liquid calculations"
              questionCount={20}
              difficulty="Intermediate"
              gradient="from-purple-500 to-accent-500"
              delay="0.7s"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 sm:py-20 relative">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-3xl p-12 animate-scale-in">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-gray-900">
              Ready to Build Your <span className="gradient-text">Confidence?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of nurses who have mastered medical math with our proven practice system.
            </p>
            <Link to="/practice" className="btn btn-primary btn-lg animate-pulse-glow">
              Start Practicing Now
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function TrustMetric({ value, label, icon, delay }: { value: string; label: string; icon: React.ReactNode; delay: string }) {
  return (
    <div className="animate-bounce-in" style={{ animationDelay: delay }}>
      <div className="text-5xl font-bold gradient-text mb-2">{value}</div>
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <div className="w-5 h-5 text-primary-500">{icon}</div>
        <span className="text-sm sm:text-base">{label}</span>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  delay: string;
}) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-primary-600',
    secondary: 'from-secondary-500 to-secondary-600 text-secondary-600',
    accent: 'from-accent-500 to-accent-600 text-accent-600',
    purple: 'from-purple-500 to-purple-600 text-purple-600',
    amber: 'from-amber-500 to-amber-600 text-amber-600',
  }[color] || 'from-gray-500 to-gray-600 text-gray-600'

  return (
    <div 
      className="card-3d p-6 group animate-slide-up" 
      style={{ animationDelay: delay }}
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses} bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <div className="w-8 h-8 text-white">
          <div className={`w-full h-full bg-gradient-to-br ${colorClasses} rounded-lg p-1.5`}>
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function CategoryCard({ 
  title, 
  description, 
  questionCount, 
  difficulty,
  gradient,
  delay
}: { 
  title: string; 
  description: string; 
  questionCount: number;
  difficulty: string;
  gradient: string;
  delay: string;
}) {
  return (
    <Link 
      to="/practice" 
      className="block group animate-scale-in"
      style={{ animationDelay: delay }}
      aria-label={`Practice ${title} - ${questionCount} questions, ${difficulty} level`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
        <h3 className="font-semibold text-lg mb-1 text-gray-900 relative z-10">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 relative z-10">{description}</p>
        <div className="flex items-center justify-between text-xs relative z-10">
          <span className={`font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {questionCount}+ questions
          </span>
          <span className="badge badge-primary">{difficulty}</span>
        </div>
      </div>
    </Link>
  )
}

// Icon Components
function CalculatorIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
      <path d="M6.5 7.5h5v1h-5zM13 7.5h5v1h-5zM13 15.5h5v1h-5zM13 13.5h5v1h-5zM13 11.5h5v1h-5zM13 9.5h5v1h-5zM6.5 9.5h5v5h-5zM6.5 15.5h5v1h-5z"/>
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function HeartPulseIcon() {
  return (
    <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h1.5L12 9.5 13.5 14.5 15 12h1.5" />
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg className="w-12 h-12 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="10" r="3" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7V3m0 0a2 2 0 012 2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4m-2-8a2 2 0 00-2 2H6a2 2 0 00-2 2v2a2 2 0 002 2h4m-3 4v3a5 5 0 0010 0v-3" />
    </svg>
  )
}

function PillIcon() {
  return (
    <svg className="w-12 h-12 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

function SyringeIcon() {
  return (
    <svg className="w-12 h-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-2 2m0 0l-2 2m2-2l2 2m-2-2l-2-2m-1-1L9 8m0 0L6.5 5.5M9 8l3 3m-7.5 9.5L3 22m0 0l1.5-1.5M3 22l1.5-1.5m0 0L9 16m-4.5 4.5L6 19" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 6l3-3 3 3-3 3m-6 2l7-7" />
    </svg>
  )
}