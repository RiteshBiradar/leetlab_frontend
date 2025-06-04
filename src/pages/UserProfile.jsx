import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Code, Trophy, Target, Calendar, TrendingUp, Clock, Plus, List } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState("");
  const [solvedProblem, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/check");
        const user = userRes.data.user;
        setUser(user);

        const [problemsRes, submissionsRes, solvedProblemsRes] = await Promise.all([
          api.get("/problems/getAllProblems"),
          api.get("/submission/getAllSubmissions", { params: { userId: user.id } }),
          api.get("/problems/getSolvedProblems"),
        ]);

        setProblems(problemsRes.data.problems);
        setSubmissions(submissionsRes.data.submission);
        setSolvedProblems(solvedProblemsRes.data.problems);
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSubmission() {
      if (!user?.id) return;
      try {
        const res = await api.get("/submission/getAllSubmissions", {
          params: { userId: user.id },
        });
        setSubmissions(res.data.submission);
      } catch (err) {
        toast.error("Failed to fetch submissions");
        console.error(err);
      }
    }
    fetchSubmission();
  }, [user]);

  const getCurrentStreak = () => {
    const dateSet = new Set(
      submissions.map((sub) => new Date(sub.createdAt).toDateString())
    );
    let streak = 0;
    let currentDate = new Date();
    
    while (dateSet.has(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const totalProblems = problems.length;
  const solvedProblems = solvedProblem.length;
  const attemptedProblemIds = new Set(submissions.map((s) => s.problemId));
  const attemptedProblems = attemptedProblemIds.size;

  const easyProblems = problems.filter(problem => {
    if (problem.difficulty !== "EASY") return false;
    const acceptedSubmission = submissions.find(sub => 
      sub.problemId === problem.id && sub.status === "Accepted"
    );
    return !!acceptedSubmission; 
  }).length;

  const mediumProblems = submissions.filter(p => p.difficulty === "MEDIUM" && p.status === "Accepted").length;
  const hardProblems = submissions.filter(p => p.difficulty === "HARD" && p.status === "Accepted").length;
  
  const solvedPercentage = Math.round((solvedProblems / totalProblems) * 100);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // days
    
    if (diff === 0) return "today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <Link 
          to="/problems" 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Problems
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            CodeChallenge
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{user?.name || "User"}</h1>
              <p className="text-xl text-gray-600 mb-1">{user?.email}</p>
              {console.log(user)}
              <p className="text-gray-500">Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{solvedProblems}</div>
              <div className="text-sm text-gray-600">Solved</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{solvedPercentage}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">{attemptedProblems}</div>
              <div className="text-sm text-gray-600">Attempted</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{getCurrentStreak()}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Problems Solved</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{solvedProblems}</div>
            <p className="text-gray-600 mb-4">out of {totalProblems} problems</p>
            <div className="bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${solvedPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{solvedPercentage}% completion rate</p>
          </div>

<div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
  <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                <List className="w-6 h-6 text-yellow-600" />
          </div>
  <h3 className="text-xl font-bold text-gray-900">Manage Playlists</h3>
  </div>
  <div className="flex flex-col gap-4 mt-4">
    <Link 
      to="/view-playlists"
      className="w-full flex justify-center items-center gap-2 py-3 px-6 bg-yellow-500 text-white no-underline rounded-md text-sm font-medium transition-colors hover:bg-yellow-600"
    >
      <List className="w-4 h-8" />
      View Playlists
    </Link>

    <Link 
      to="/create-playlist"
      className="w-full flex justify-center items-center gap-2 py-3 px-6 bg-blue-600 text-white no-underline rounded-md text-sm font-medium transition-colors hover:bg-blue-700"
    >
      <Plus className="w-4 h-8" />
      Create Playlist
    </Link>
  </div>
</div>


          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Current Streak</h3>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">{getCurrentStreak()}</div>
            <p className="text-gray-600">days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Problems Solved by Difficulty</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Easy */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-4">{easyProblems}</div>
              <div className="inline-block px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                Easy
              </div>
            </div>
            
            {/* Medium */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-4">{mediumProblems}</div>
              <div className="inline-block px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">
                Medium
              </div>
            </div>
            
            {/* Hard */}
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-4">{hardProblems}</div>
              <div className="inline-block px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm font-semibold">
                Hard
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No recent activity</div>
                <div className="text-sm text-gray-500">Start solving problems to see your activity here</div>
              </div>
            ) : (
              submissions.slice(0, 5).map((sub, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${sub.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div>
                      <div className="font-semibold text-gray-900">{sub.problem?.title || "Untitled Problem"}</div>
                      <div className="text-sm text-gray-600">{sub.status}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(sub.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {user?.role === "ADMIN" && (
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <Link to="/create-problem">
            <button
              className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Create New Problem
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}