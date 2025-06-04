import { useState } from "react"
import { Code, Plus, Trash2, ChevronLeft, Save } from "lucide-react"
import { Button } from "../components/ui/button.jsx"
import { Input } from "../components/ui/input.jsx"
import { Link } from "react-router-dom"
import api from "../api/axios.js"

function AdminCreateProblem() {
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: [],
    examples: {
      PYTHON: { input: "", output: "", explanation: "" },
      JAVASCRIPT: { input: "", output: "", explanation: "" },
    },
    constraints: "",
    testcases: [{ input: "", output: "" }],
    codeSnippets: {
      JAVASCRIPT: "",
      PYTHON: "",
      JAVA: "",
    },
    referenceSolutions: {
      JAVASCRIPT: "",
      PYTHON: "",
      JAVA: "",
    },
  })

  const [newTag, setNewTag] = useState("")

    const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            const res = await api.post("http://localhost:8080/api/v1/problems/createProblem", problem);
            alert("Problem created successfully!");
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert("Error creating problem.");
        }
    };

  const addTag = () => {
    if (newTag.trim() && !problem.tags.includes(newTag.trim())) {
      setProblem((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setProblem((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addTestcase = () => {
    setProblem((prev) => ({
      ...prev,
      testcases: [...prev.testcases, { input: "", output: "" }],
    }))
  }

  const removeTestcase = (index) => {
    setProblem((prev) => ({
      ...prev,
      testcases: prev.testcases.filter((_, i) => i !== index),
    }))
  }

  const updateTestcase = (index, field, value) => {
    setProblem((prev) => ({
      ...prev,
      testcases: prev.testcases.map((testcase, i) => (i === index ? { ...testcase, [field]: value } : testcase)),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
        <Link to="/problems">
        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Problems
        </button>
        </Link>
        </div>
        <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
            </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            CodeChallenge
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Admin
        </span>
        </div>
    </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex gap-4 justify-center">
            Create New
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Problem
            </span>
          </h1>
          <p className="text-xl text-gray-600">Design and configure a new coding challenge</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Problem Title</label>
                <Input
                  value={problem.title}
                  onChange={(e) => setProblem((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Two Sum"
                  className="h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={problem.description}
                  onChange={(e) => setProblem((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the problem in detail..."
                  rows={5}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={problem.difficulty}
  onChange={(e) => setProblem((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="h-12 px-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-base"
                  >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Constraints</label>
                  <Input
                    value={problem.constraints}
                    onChange={(e) => setProblem((prev) => ({ ...prev, constraints: e.target.value }))}
                    placeholder="e.g., 1 ≤ n ≤ 10^4"
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>

            <div className="flex gap-3 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                onClick={addTag}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-200"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
              <Button
                type="button"
                onClick={addTestcase}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex"
              >
                <Plus className="w-5 h-5 mr-2 mt-1" />
                Add Test Case
              </Button>
            </div>

            <div className="space-y-4">
              {problem.testcases.map((testcase, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Test Case {index + 1}</h3>
                    {problem.testcases.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTestcase(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Input</label>
                      <Input
                        value={testcase.input}
                        onChange={(e) => updateTestcase(index, "input", e.target.value)}
                        placeholder="Test input..."
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Output</label>
                      <Input
                        value={testcase.output}
                        onChange={(e) => updateTestcase(index, "output", e.target.value)}
                        placeholder="Expected output..."
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Examples</h2>

            <div className="space-y-8">
              {["PYTHON", "JAVASCRIPT"].map((lang) => (
                <div
                  key={lang}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-4">{lang} Example</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Input</label>
                        <Input
                          value={problem.examples[lang].input}
                          onChange={(e) =>
                            setProblem((prev) => ({
                              ...prev,
                              examples: {
                                ...prev.examples,
                                [lang]: { ...prev.examples[lang], input: e.target.value },
                              },
                            }))
                          }
                          placeholder="Example input..."
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Output</label>
                        <Input
                          value={problem.examples[lang].output}
                          onChange={(e) =>
                            setProblem((prev) => ({
                              ...prev,
                              examples: {
                                ...prev.examples,
                                [lang]: { ...prev.examples[lang], output: e.target.value },
                              },
                            }))
                          }
                          placeholder="Example output..."
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Explanation</label>
                      <textarea
                        value={problem.examples[lang].explanation}
                        onChange={(e) =>
                          setProblem((prev) => ({
                            ...prev,
                            examples: {
                              ...prev.examples,
                              [lang]: { ...prev.examples[lang], explanation: e.target.value },
                            },
                          }))
                        }
                        placeholder="Explain the example..."
                        rows={3}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippets and Reference Solutions */}
          {[
            { key: "codeSnippets", title: "Code Snippets", subtitle: "Starter code templates" },
            { key: "referenceSolutions", title: "Reference Solutions", subtitle: "Complete solution implementations" },
          ].map(({ key, title, subtitle }) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600 mt-1">{subtitle}</p>
              </div>

              <div className="space-y-6">
                {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
                  <div key={lang}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{lang}</label>
                    <textarea
                      value={problem[key][lang]}
                      onChange={(e) =>
                        setProblem((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            [lang]: e.target.value,
                          },
                        }))
                      }
                      placeholder={`${lang} ${key === "codeSnippets" ? "starter code" : "solution"}...`}
                      rows={8}
                      className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl flex"
            >
              <Save className="w-5 h-5 mr-2 mt-1" />
              Create Problem
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCreateProblem
