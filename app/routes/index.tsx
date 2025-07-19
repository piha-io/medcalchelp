import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Master Medical Calculations
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice dosage calculations, IV drip rates, and unit conversions with instant feedback
        </p>
        <Link to="/practice" className="btn btn-primary btn-lg">
          Start Practicing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <FeatureCard
          title="Dynamic Questions"
          description="Randomized values prevent memorization and ensure real understanding"
          icon="🎲"
        />
        <FeatureCard
          title="Step-by-Step Solutions"
          description="Learn from detailed explanations and understand the methodology"
          icon="📝"
        />
        <FeatureCard
          title="Track Your Progress"
          description="Earn points, climb the leaderboard, and maintain your streak"
          icon="📊"
        />
      </div>

      <div className="mt-20 bg-primary-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Practice Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard title="Dosage Calculations" count="50+ questions" />
          <CategoryCard title="IV Drip Rates" count="40+ questions" />
          <CategoryCard title="Unit Conversions" count="30+ questions" />
          <CategoryCard title="Pediatric Dosing" count="25+ questions" />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="card p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function CategoryCard({ title, count }: { title: string; count: string }) {
  return (
    <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="font-semibold text-lg mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{count}</p>
    </div>
  )
}