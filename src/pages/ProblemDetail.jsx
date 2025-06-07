import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, RotateCcw, ChevronLeft, Code, Terminal, FileText, CheckCircle2, XCircle } from "lucide-react"
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


  const fetchSubmission = async () => {
  if (!problem?.id || !user?.id) return;
  try {
    const res = await api.get(`submission/getSubmission/${problem.id}`, {
      params: {
        userId: user.id,
      },
    });
    setSubmissions(res.data.submissions);
  } catch (error) {
    console.log("Error while fetching submissions", error.message);
    toast.error("Error while fetching submissions");
  }
};

  useEffect(() => {
  if (problem && user?.id) fetchSubmission();
}, [problem?.id, user?.id]);

  useEffect(() => {
    if (problem) setCode(getStarterCode(language));
  }, [language, problem]);

  const generateText = (slug) =>
    slug.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");

   const getDifficultyColor = (difficulty) => {
    const map = {
      EASY: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-orange-100 text-orange-700 border-orange-200", 
      HARD: "bg-red-100 text-red-700 border-red-200",
    }
    return map[difficulty] || "bg-gray-100 text-gray-700 border-gray-200"
  }

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
      await fetchSubmission();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-full mx-auto w-full bg-white shadow-sm border-b border-gray-100">
        <Link to="/problems">
        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Problems
        </button>
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center px-4 py-2 rounded-lg border-gray-200 hover:bg-blue-50 text-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 h-10 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel: Description & Submissions */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-100 shadow-lg rounded-br-2xl overflow-hidden flex flex-col">
          <Tabs defaultValue="description" className="h-full flex flex-col">
             <TabsList className="grid w-full grid-cols-2 bg-gray-100 border-b border-gray-200 rounded-none">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                 Description
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                 Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 p-8 overflow-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{generateText(problem.title)}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(
                    problem.difficulty,
                  )}`}
                >
                  {problem.difficulty}
                </span>
                {problem.tags && (
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{problem.description}</p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Examples:</h3>
              {problem.testcases.map((tc, idx) => (
                <div key={idx} className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                  <div className="font-semibold text-gray-800 mb-2">Example {idx + 1}:</div>
                  <div className="text-gray-700 mb-1">
                    <strong className="text-gray-900">Input:</strong>{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm">{tc.input}</code>
                  </div>
                  <div className="text-gray-700 mb-1">
                    <strong className="text-gray-900">Output:</strong>{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm">{tc.output}</code>
                  </div>
                  {tc.explanation && (
                    <div className="text-gray-700 mt-2">
                      <strong className="text-gray-900">Explanation:</strong> {tc.explanation}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 p-8 overflow-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Terminal className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">No submissions yet</p>
                  <p className="text-gray-600">Run your code to see your submission history here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((sub, idx) => (
                    <div key={idx} className="p-6 border border-gray-200 rounded-xl bg-white shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">
                          Submitted: {new Date(sub.createdAt).toLocaleString()}
                        </div>
                        <div
                          className={`flex items-center gap-1 text-sm font-semibold ${
                            sub.status === "Accepted" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {sub.status === "Accepted" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {sub.status}
                        </div>
                      </div>
                      <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-gray-800 border border-gray-200">
                        {sub.sourceCode.length > 300
                          ? sub.sourceCode.substring(0, 300) + "... (truncated)"
                          : sub.sourceCode}
                      </pre>
                      <div className="text-sm text-gray-500 mt-3 flex gap-4">
                        <span>
                          ⏱ Time:{" "}
                          {sub.time
                            ? `${(
                                JSON.parse(sub.time).reduce((a, b) => a + Number.parseFloat(b), 0) /
                                  JSON.parse(sub.time).length
                              ).toFixed(2)} s`
                            : "N/A"}
                        </span>
                        <span>
                          💾 Memory:{" "}
                          {sub.memory
                            ? `${(
                                JSON.parse(sub.memory).reduce((a, b) => a + Number.parseFloat(b), 0) /
                                  JSON.parse(sub.memory).length
                              ).toFixed(2)} KB`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#1e1e1e] rounded-bl-2xl overflow-hidden">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-1 bg-gray-800 border-b border-gray-700 rounded-none">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-gray-300"
              >
                Code Editor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="flex flex-1">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail;
