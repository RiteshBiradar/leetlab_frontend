import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, RotateCcw, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import Editor from "@monaco-editor/react";
import { getLanguageId } from "../libs/languageMap.js";
import { getStarterCode } from "../libs/starterCode.js";
import toast from "react-hot-toast";
import api from "../api/axios.js";


function ProblemDetail() {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [language, setLanguage] = useState("Java");
  const [user,setUser] = useState([]);
  
useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [userRes, problemRes] = await Promise.all([
        api.get("/auth/check"),
        api.get(`/problems/getProblem/${title}`)
      ]);

      setUser(userRes.data.user);
      setProblem(problemRes.data.problem);
      setCode(getStarterCode(language));
    } catch (err) {
      console.error("Initial data fetch failed", err);
      toast.error("Failed to load problem or user");
    }
  };

  fetchInitialData();
}, []);


  useEffect(() => {
    if (!problem?.id || !user?.id) return;
    async function fetchSubmission() {
        try {
        const res = await api.get(`submission/getSubmission/${problem.id}`, {
          userId: user.id ,
        });
            setSubmissions(res.data.submissions)
        } catch (error) {
            console.log("Error while fetching submissions",error.message)
            toast.error("Error while fetching submissions")
        }
    }
    fetchSubmission();    
  }, [problem, user]);


  useEffect(() => {
    if (problem) setCode(getStarterCode(language));
  }, [language, problem]);

  const generateText = (slug) =>
    slug.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");

  const getDifficultyColor = (difficulty) => {
    const map = {
      Easy: "text-green-900 bg-green-250 border-green-600",
      Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      Hard: "text-red-600 bg-red-50 border-red-200",
    };
    return map[difficulty] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await api.post("/execute-code/", {
        languageId: getLanguageId(language),
        source_code: code,
        stdin: problem.testcases.map(tc => tc.input),
        expected_outputs: problem.testcases.map(tc => tc.output),
        problemId: problem.id,
      });
      toast.success("Submission completed successfully");
    } catch (err) {
      toast.error("Error while submitting code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => setCode(getStarterCode(language));

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading problem...</h1>
          <Link to="/problems"><Button>Back to Problems</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex justify-between items-center p-4 bg-white border-b">
        <Link to="/problems" className="flex items-center text-gray-600 hover:text-blue-600">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Problems
        </Link>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleReset} className="flex"><RotateCcw className="w-4 h-4 mr-2 mt-1" />Reset</Button>
          <Button onClick={handleRun} disabled={isRunning} className="flex"><Play className="w-4 h-4 mr-2 mt-1" />{isRunning ? "Running..." : "Run Code"}</Button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2"
          >
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-1/2 bg-white border-r">
          <Tabs defaultValue="description" className="h-full flex flex-col">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 p-6 overflow-auto">
              <h1 className="text-2xl font-bold mb-2">{generateText(problem.title)}</h1>
              <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
              <p className="text-gray-700 mt-4">{problem.description}</p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Examples:</h3>
              {problem.testcases.map((tc, idx) => (
                <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div><strong>Input:</strong> {tc.input}</div>
                  <div><strong>Output:</strong> {tc.output}</div>
                  {tc.explanation && <div><strong>Explanation:</strong> {tc.explanation}</div>}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 p-6 overflow-auto">
              {submissions.length === 0 ? (
                <p className="text-gray-500">No submissions yet.</p>
              ) : (
                submissions.map((sub, idx) => (
                  <div key={idx} className="p-4 border rounded bg-white shadow">
                    <div className="text-sm text-gray-600 mb-2">Submitted: {new Date(sub.createdAt).toLocaleString()}</div>
                    <div className={`text-sm font-medium ${(sub.status === "Accepted") ? "text-green-600" : "text-red-600"}`}>
                      {(sub.status === "Accepted") ? "✅ Passed" : "❌ Failed"}
                    </div>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {sub.sourceCode.length > 300 ? sub.sourceCode.substring(0, 300) + "... (truncated)" : sub.sourceCode}
                    </pre>
                    <div className="text-sm text-gray-500 mt-1">
                      ⏱ Time: {sub.time ? (JSON.parse(sub.time).reduce((a, b) => a + parseFloat(b), 0) / JSON.parse(sub.time).length).toFixed(2) + " s" : "N/A"}
                      {" | "}
                      💾 Memory: {sub.memory ? (JSON.parse(sub.memory).reduce((a, b) => a + parseFloat(b), 0) / JSON.parse(sub.memory).length).toFixed(2) + " KB" : "N/A"}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList><TabsTrigger value="code">Code</TabsTrigger></TabsList>
            <TabsContent value="code" className="flex flex-1">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
