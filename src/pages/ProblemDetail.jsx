import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {  Play, RotateCcw, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { getLanguageId } from "../libs/languageMap.js";
import { getStarterCode } from "../libs/starterCode.js";

function ProblemDetail() {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [userId,setUserId] = useState("");
  const [language,setLanguage] = useState("Java");


  useEffect(() => {
  if (problem) {
    setCode(getStarterCode(language));
  }
}, [language]);


   useEffect(()=>{
    async function fetchUser(){
      try{
        const res = axios.get("http://localhost:8080/api/v1/auth/check",{
          withCredentials : true,
        });
        setUserId(res.data.user.id)
      }
      catch(err){
        console.log("Error fetching user",err)
      }
    }
    fetchUser();
   },[])



  useEffect(() => {
    async function fetchProblemById() {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/problems/getProblem/${title}`, {
          withCredentials: true,
        });
        const problem = res.data.problem;
  
        setProblem(problem);
        setCode(getStarterCode(language)); 
      } catch (err) {
        console.error("Error while fetching data:", err.message);
      }
    }
    fetchProblemById();
  }, [title]);

async function fetchSubmissions() {
  if (!problem?.id) return;
  try {
    const res = await axios.get(
      `http://localhost:8080/api/v1/submission/getSubmission/${problem.id}`,
      {
        params: { userId },
        withCredentials: true,
      }
    );
    setSubmissions(res.data.submissions || []);
  } catch (err) {
    console.error("Error fetching submissions:", err.message);
  }
}
useEffect(() => {
  fetchSubmissions();
}, [problem]);


  const generateText = (title) => {
  return title
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1) +" ")
    .join("");
};

  function getDifficultyColor(difficulty) {
    if (difficulty === "Easy") return "text-green-900 bg-green-250 border-green-600";
    if (difficulty === "Medium") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (difficulty === "Hard") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  }

async function handleRun() {
  setIsRunning(true);
  try {
    const res = await axios.post("http://localhost:8080/api/v1/execute-code/", {
      languageId: getLanguageId(language), 
      source_code: code,
      stdin: problem.testcases.map(tc => tc.input), 
      expected_outputs: problem.testcases.map(tc => tc.output),
      problemId : problem.id,
    }, { withCredentials: true });

  
    setOutput(res.data.output || "No output returned.");
    await fetchSubmissions();
  } catch (err) {
    setOutput(`Error: ${err.message}`);
  } finally {
    setIsRunning(false);
  }
}

  function handleReset() {
    setCode(problem?.starterCode || "");
    setOutput("");
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading problem...</h1>
          <Link to="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="flex justify-between items-center p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <Link to="/problems" className="flex items-center text-gray-600 hover:text-blue-600">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Problems
          </Link>

        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleReset} className="flex">
            <RotateCcw className="w-4 h-4 mr-2 mt-1" />
            Reset
          </Button>
          <Button onClick={handleRun} disabled={isRunning} className="flex">
            <Play className="w-4 h-4 mr-2 mt-1" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 shadow-sm transition"
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
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {generateText(problem.title)}
                </h1>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{problem.description}</p>

                <h3 className="text-lg font-semibold mb-3">Examples:</h3>
                {problem.testcases.map((example, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="mb-2">
                      <strong>Input:</strong> {example.input}
                    </div>
                    <div className="mb-2">
                      <strong>Output:</strong> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="submissions" className="flex-1 p-6 overflow-auto">
            {submissions.length === 0 ? (
    <p className="text-gray-500">No submissions yet.</p>
  ) : (
    <div className="space-y-4">
      {submissions.map((sub, index) => (
        <div key={index} className="p-4 border rounded bg-white shadow">
          <div className="text-sm text-gray-600 mb-2">Submitted at: {new Date(sub.createdAt).toLocaleString()}</div>
          <div className={`text-sm font-medium mb-1 ${(sub.status=="Accepted") ? "text-green-600" : "text-red-600"}`}>
            {(sub.status=="Accepted") ? "✅ Passed" : "❌ Failed"}
          </div>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {sub.sourceCode.length > 300
              ? sub.sourceCode.substring(0, 300) + "... (truncated)"
              : sub.sourceCode}
          </pre>
<div className="text-sm text-gray-500 mb-1">
  ⏱ Time: {
    sub.time
      ? (
          JSON.parse(sub.time)
            .reduce((sum, t) => sum + parseFloat(t), 0) / JSON.parse(sub.time).length
        ).toFixed(2) + " s"
      : "N/A"
  } | 💾 Memory: {
    sub.memory
      ? (
          JSON.parse(sub.memory)
            .reduce((sum, m) => sum + parseFloat(m), 0) / JSON.parse(sub.memory).length
        ).toFixed(2) + " KB"
      : "N/A"
  }
</div>

        </div>
      ))}
    </div>
  )}
</TabsContent>

          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
        
            </TabsList>

<TabsContent value="code" className="flex min-h-[500px]">
  <Editor
    height="100%"
    defaultLanguage={language.toLowerCase()}
    language={language.toLowerCase()} 
    value={code}
    onChange={(newCode) => setCode(newCode)}
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
