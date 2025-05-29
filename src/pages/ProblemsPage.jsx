import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import axios from "axios"

function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [problems,setProblems] = useState([]);

const generateText = (title) => {
  return title
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1) +" ")
    .join("");
};

  const slugify = (title) => title.replace(/\s+/g,' ');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
  async function fetchProblems() {
    try{
      const res = await axios.get("http://localhost:8080/api/v1/problems/getAllProblems",{
        withCredentials : true,
      });
      console.log("Problems ", res)
      setProblems(res.data.problems);
    }
    catch(err){
      console.log("Error while fetching data", err.message);
    }
  }
  fetchProblems();    
  },[])


  setInterval(()=>{
    if(problems.length>0) setIsLoggedIn(true)
    else setIsLoggedIn(false);
  },1000)

  console.log(problems)
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  function getDifficultyColor(difficulty) {
    if (difficulty === "Easy") return "text-green-600 bg-green-50 border-green-200";
    if (difficulty === "Medium") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (difficulty === "Hard") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  }

  function getStatusIcon(status) {
    if (status === "solved") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === "attempted") return <Clock className="w-5 h-5 text-yellow-600" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6">
      <div></div>
<div className="flex items-center space-x-4 ml-auto">
  {isLoggedIn ? (
    <Button
      onClick={async () => {
        try {
          await axios.post("http://localhost:8080/api/v1/auth/logout", {}, {
            withCredentials: true,
          });
          setIsLoggedIn(false);
        } catch (err) {
          console.log("Logout failed", err.message);
        }
      }}
    >
      Logout
    </Button>
  ) : (
    <>
      <Link to="/login">
        <Button variant="outline">Login</Button>
      </Link>
      <Link to="/signup">
        <Button>Sign Up</Button>
      </Link>
    </>
  )}
</div>

      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Problems</h1>
          <p className="text-gray-600">Solve coding challenges and improve your skills</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700 text-sm">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-3">Acceptance</div>
          </div>

          
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${slugify(problem.title)}`}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors"
            >
              <div className="col-span-1 flex items-center">
                {getStatusIcon((problem.status=="Accepted"))}
              </div>
              <div className="col-span-6 flex items-center">
                <span className="font-medium text-gray-800 hover:text-blue-600">
                  {generateText(problem.title)}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <div className="col-span-3 flex items-center text-gray-600">
                <span className="text-sm">
                  {Math.floor(Math.random() * 40 + 30)}%
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No problems found</div>
            <div className="text-gray-600">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;
