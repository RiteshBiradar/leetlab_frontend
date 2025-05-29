import { Link } from "react-router-dom";
import { Code, ArrowRight, Zap, Target } from "lucide-react";
import { Button } from "../components/ui/button.jsx";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">CodeChallenge</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Coding
            <span className="block text-blue-600">One Problem at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice coding problems and improve your programming skills with our collection of challenges.
          </p>
          <div className="flex justify-center items-center">
            <Link to="/problems">
              <Button size="lg" className="px-8 py-4 flex">
                Start Solving 
                <ArrowRight className="w-4 h-4 ml-2 mt-1.5 " />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Clean Code Editor</h3>
            <p className="text-gray-600">
              Write and test your code with our simple editor.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Testing</h3>
            <p className="text-gray-600">
              Run your code and see results immediately.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Different Levels</h3>
            <p className="text-gray-600">
              Start easy and work your way up to harder problems.
            </p>
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-medium">Ready to start coding?</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-800 rounded p-6 font-mono text-sm">
            <div className="text-purple-400">{'function twoSum(nums, target) {'}</div>
            <div className="text-gray-400 ml-4">{`'// Your solution here'`}</div>
            <div className="text-green-400 ml-4">{'return result;'}</div>
            <div className="text-purple-400">{'}'}</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-6 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Coding?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join others learning to code better every day.
          </p>
          
          <Link to="/problems">
            <Button size="lg" variant="secondary" className="px-8 py-4 flex justify-center items-center">
                Browse Problems
                <ArrowRight className="w-4 h-4 ml-2 mt-1.5 " />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
