import { Link } from "react-router-dom"
import { Code, ArrowRight, Zap, Target, Users, Trophy, BookOpen } from "lucide-react"
import { Button } from "../components/ui/button.jsx"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            CodeChallenge
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-blue-50">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Join 50,000+ developers improving their skills
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master Coding
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              One Problem at a Time
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Practice coding problems, improve your programming skills, and prepare for technical interviews with our
            curated collection of challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/problems">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl flex"
              >
                Start Solving Problems
                <ArrowRight className="w-5 h-5 ml-2 mt-1" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-blue-50">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Coding Problems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <Code className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Advanced Code Editor</h3>
            <p className="text-gray-600 leading-relaxed">
              Write and test your code with our feature-rich editor including syntax highlighting, auto-completion, and
              real-time error detection.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Run your code and see results immediately with comprehensive test cases, performance metrics, and detailed
              explanations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Progressive Difficulty</h3>
            <p className="text-gray-600 leading-relaxed">
              Start with beginner-friendly problems and gradually work your way up to advanced algorithms and data
              structures.
            </p>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-white text-xl font-semibold">Interactive Code Environment</h3>
              <div className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Live</div>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 font-mono text-sm border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">problem.js</span>
              <span className="text-green-400 text-xs">✓ All tests passed</span>
            </div>
            <div className="space-y-1">
              <div className="text-purple-400">{"function twoSum(nums, target) {"}</div>
              <div className="text-gray-400 ml-4">{"  const map = new Map();"}</div>
              <div className="text-gray-400 ml-4">{"  for (let i = 0; i < nums.length; i++) {"}</div>
              <div className="text-yellow-400 ml-8">{"    const complement = target - nums[i];"}</div>
              <div className="text-blue-400 ml-8">{"    if (map.has(complement)) {"}</div>
              <div className="text-green-400 ml-12">{"      return [map.get(complement), i];"}</div>
              <div className="text-blue-400 ml-8">{"    }"}</div>
              <div className="text-gray-400 ml-8">{"    map.set(nums[i], i);"}</div>
              <div className="text-gray-400 ml-4">{"  }"}</div>
              <div className="text-purple-400">{"}"}</div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Runtime: 52ms</span>
              <span>Memory: 42.1MB</span>
              <span>Beats 95.2% of solutions</span>
            </div>
            <Link to="/problems">
            <Button variant="secondary" size="sm">
              Try This Problem
            </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive tools and resources to help you become a better programmer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Solutions</h3>
              <p className="text-gray-600">
                Learn from expert explanations and multiple solution approaches for every problem.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h3>
              <p className="text-gray-600">
                Connect with fellow developers, share solutions, and learn from each other.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement with detailed analytics and achievement badges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Level Up Your Coding Skills?</h2>
          <p className="text-blue-100 text-xl mb-10 leading-relaxed">
            Join thousands of developers who are already improving their programming skills daily. Start your journey
            today!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/problems">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-xl flex"
              >
                Browse Problems
                <ArrowRight className="w-5 h-5 ml-2 mt-1.5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-white text-black hover:bg-white hover:text-blue-600"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
