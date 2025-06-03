import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, CheckCircle2, Circle, Clock, LogOut, Code, User } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await api.get("/problems/getAllProblems");
        setProblems(res.data.problems);
      } catch (err) {
        toast.error("Failed to fetch problems");
        console.log("Failed fetching problems",err);
      }
    }
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "bg-green-100 text-green-700 border-green-200";
    if (difficulty === "Medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (difficulty === "Hard") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === "Failed") return <Clock className="w-5 h-5 text-yellow-600" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const formatTitle = (title) =>
    title
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };


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
        <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="hover:bg-blue-50 text-gray-700 px-4 py-2 rounded-xl flex items-center space-x-2 border border-transparent transition duration-200"
        >
        <User className="w-4 h-4" />
        <span>Profile</span>
        </Link>
        <Button variant="ghost" className="hover:bg-blue-50 flex items-center space-x-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
  
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex justify-center items-center gap-2 text-center">
            Coding
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Problems
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Solve coding challenges and improve your programming skills
          </p>
        </div>

      
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Native select instead of custom Select */}
            <div className="relative w-full sm:w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="appearance-none w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 text-sm font-semibold text-gray-700">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Difficulty</div>
            <div className="col-span-2">Acceptance</div>
          </div>

          {/* Problems */}
          {filteredProblems.map((problem, index) => (
            <div
              key={problem.id}
              className={`grid grid-cols-12 gap-4 p-6 hover:bg-blue-50 transition-all duration-200 cursor-pointer group ${
                index !== filteredProblems.length - 1 ? "border-b border-gray-100" : ""
              }`}
              onClick={() => navigate(`/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}`)}
            >
              <div className="col-span-1 flex items-center">{getStatusIcon(problem.status)}</div>
              <div className="col-span-6 flex items-center">
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                  {formatTitle(problem.title)}
                </span>
              </div>
              <div className="col-span-3 flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-gray-600 font-medium">{problem.acceptance || "N/A"}</span>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredProblems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2">No problems found</div>
              <div className="text-gray-600">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <span className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredProblems.length}</span> of{" "}
              <span className="font-semibold text-blue-600">{problems.length}</span> problems
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;
