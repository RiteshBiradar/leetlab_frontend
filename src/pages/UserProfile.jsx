import { Link } from "react-router-dom";
import { Code, ChevronLeft, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";

function UserProfile() {
    const [problems,setProblems] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [user,setUser] = useState("");
    const [solvedProblem,setSolvedProblems] = useState([]);

    useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/check");
        console.log(res.data.user)
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to fetch user");
        console.error(err);
      }
    }
    fetchUser();
  }, []);
    

    useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await api.get("/problems/getAllProblems");
      
        setProblems(res.data.problems);
      } catch (err) {
        toast.error("Failed to fetch problems");
        console.error(err);
      }
    }
    fetchProblems();
  }, []);

useEffect(() => {
    async function fetchSubmission() {
      if(!user?.id) return;
      try {
        const res = await api.get("/submission/getAllSubmissions",{
                userId : user.id,
        });
     
        setSubmissions(res.data.submission);
      } catch (err) {
        toast.error("Failed to fetch problems");
         console.log(user.id)
      }
    }
    fetchSubmission();
  }, [user]);

  useEffect(() => {
  console.log("Updated submissions:", submissions);
}, [submissions]);
 

    useEffect(() => {
    async function fetchSolvedProblems() {

      try {
        const res = await api.get("/problems/getSolvedProblems");
        setSolvedProblems(res.data.problems);
      } catch (err) {
        toast.error("Failed to fetch problems solved by user");
      }
    }
    fetchSolvedProblems();
  },[]);

  function getCurrentStreak(submissions) {
  const dateSet = new Set(
    submissions.map(sub => new Date(sub.createdAt).toDateString())
  );

  let streak = 0;
  let currentDate = new Date();

  while (dateSet.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
  }

  const totalProblems = problems.length;
  const solvedProblems = solvedProblem.length;
  const attemptedProblemIds = new Set(submissions.map(s => s.problemId));
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



  function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // days

  if (diff === 0) return "today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
        {console.log(user)}
      {/* Header */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1.5rem 2rem", 
        backgroundColor: "white", 
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "2rem"
      }}>
        <Link to="/problems" style={{ 
          display: "flex", 
          alignItems: "center", 
          color: "#6b7280", 
          textDecoration: "none" 
        }}>
          <ChevronLeft style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.25rem" }} />
          Back to Problems
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ 
            width: "2rem", 
            height: "2rem", 
            backgroundColor: "#2563eb", 
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Code style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2563eb" }}>CodeChallenge</span>
        </div>
      </nav>

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Profile Header */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "0.5rem", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "2rem",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{
              width: "4rem",
              height: "4rem",
              backgroundColor: "#2563eb",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white"
            }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: "0" }}>
                {user?.name || "User"}
              </h1>
              <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Problems Solved */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "0.5rem", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "1.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Trophy style={{ width: "1.5rem", height: "1.5rem", color: "#f59e0b" }} />
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", margin: "0" }}>Problems Solved</h3>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2563eb", marginBottom: "0.5rem" }}>
              {solvedProblem.length}
            </div>
            <p style={{ color: "#6b7280", margin: "0" }}>out of {totalProblems} problems</p>
            <div style={{ 
              backgroundColor: "#e5e7eb", 
              borderRadius: "9999px", 
              height: "0.5rem", 
              marginTop: "1rem",
              width: "100%",       
              overflow: "hidden",  
              boxSizing: "border-box" 
            }}>
              <div style={{ 
                backgroundColor: "#10b981", 
                height: "100%", 
                borderRadius: "9999px",
                width: `${solvedPercentage}%`
              }}></div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem", margin: "0.5rem 0 0 0" }}>
              {solvedPercentage}% completion rate
            </p>
          </div>

          {/* Problems Attempted */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "0.5rem", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "1.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Target style={{ width: "1.5rem", height: "1.5rem", color: "#f59e0b" }} />
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", margin: "0" }}>Attempted</h3>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "0.5rem" }}>
              {attemptedProblems}
            </div>
            <p style={{ color: "#6b7280", margin: "0" }}>problems attempted</p>
          </div>

          {/* Streak */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "0.5rem", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "1.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Calendar style={{ width: "1.5rem", height: "1.5rem", color: "#ef4444" }} />
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", margin: "0" }}>Current Streak</h3>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444", marginBottom: "0.5rem" }}>
              {getCurrentStreak(submissions)}
            </div>
            <p style={{ color: "#6b7280", margin: "0" }}>day</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "0.5rem", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <TrendingUp style={{ width: "1.5rem", height: "1.5rem", color: "#8b5cf6" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", margin: "0" }}>
              Problems Solved by Difficulty
            </h3>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {/* Easy */}
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "2rem", 
                fontWeight: "bold", 
                color: "#10b981",
                marginBottom: "0.5rem"
              }}>
                {easyProblems}
              </div>
              <div style={{ 
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#dcfce7",
                color: "#166534",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}>
                Easy
              </div>
            </div>

            {/* Medium */}
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "2rem", 
                fontWeight: "bold", 
                color: "#f59e0b",
                marginBottom: "0.5rem"
              }}>
                {mediumProblems}
              </div>
              <div style={{ 
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#fef3c7",
                color: "#92400e",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}>
                Medium
              </div>
            </div>

            {/* Hard */}
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "2rem", 
                fontWeight: "bold", 
                color: "#ef4444",
                marginBottom: "0.5rem"
              }}>
                {hardProblems}
              </div>
              <div style={{ 
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}>
                Hard
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
<div style={{ 
  backgroundColor: "white", 
  borderRadius: "0.5rem", 
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  padding: "1.5rem"
}}>
  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
    Recent Activity
  </h3>

  <div style={{ color: "#6b7280" }}>
    {submissions.length === 0 ? (
      <p>No recent activity</p>
    ) : (
      submissions.slice(0, 5).map((sub, index) => (
        <p key={index} style={{ margin: "0.5rem 0" }}>
          {console.log(sub)}
          • {sub.status} {sub.problem?.title || "Untitled Problem"} - {formatDate(sub.createdAt)}
    
        </p>
      ))
    )}
  </div>
</div>
      </div>
    </div>
  );
}

export default UserProfile;
