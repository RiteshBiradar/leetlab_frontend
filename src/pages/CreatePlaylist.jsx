import { useState, useEffect } from "react"
import { Code, ChevronLeft, Plus, Check, List, Target } from "lucide-react"
import { Button } from "../components/ui/button.jsx"
import { Input } from "../components/ui/input.jsx"
import { Link } from "react-router-dom"
import api from "../api/axios.js"
import toast from "react-hot-toast"

function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("")
  const [playlistDescription, setPlaylistDescription] = useState("")
  const [selectedProblems, setSelectedProblems] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [problems, setProblems] = useState([])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems/getAllProblems")
        setProblems(response.data?.problems || [])
      } catch (error) {
        console.error("Error fetching problems:", error)
      }
    }

    fetchProblems()
  }, [])

  const handleProblemToggle = (problemId) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId]
    )
  }

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Please enter a playlist name")
      return
    }

    if (selectedProblems.length === 0) {
      alert("Please select at least one problem")
      return
    }

    setIsCreating(true)

    try {
      const createRes = await api.post("/playlist/create", {
        name: playlistName,
        description: playlistDescription,
      })

      const playlistId = createRes.data?.playlist?.id
      if (!playlistId) throw new Error("Playlist creation failed")

      await api.post(`/playlist/${playlistId}/addProblem`, {
        problemIds: selectedProblems,
      })
      toast.success(`Playlist "${playlistName}" created successfully!`)
      setPlaylistName("")
      setPlaylistDescription("")
      setSelectedProblems([])
    } catch (err) {
      console.error("Failed to create playlist:", err)
      alert("Something went wrong. Try again!")
    } finally {
      setIsCreating(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <Link to="/profile" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Link>
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6  flex items-center justify-center ">
            <img src="../../public/logo.jpeg" alt="Logo"  />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mt-2">
            ChaiAurDSA
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex gap-2 justify-center">
            Create New
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Playlist
            </span>
          </h1>
          <p className="text-xl text-gray-600">Organize your favorite coding problems into custom collections</p>
        </div>

        {/* Playlist Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <List className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Playlist Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Playlist Name *</label>
              <Input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Enter playlist description"
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 text-lg resize-none"
              />
            </div>
          </div>
        </div>

        {/* Problem Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Select Problems</h2>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
              {selectedProblems.length} selected
            </div>
          </div>

          <div className="space-y-4">
            {problems.map((problem) => {
              const isSelected = selectedProblems.includes(problem.id)
              return (
                <div
                  key={problem.id}
                  onClick={() => handleProblemToggle(problem.id)}
                  className={`flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 shadow-lg"
                        : "border-gray-300 bg-white hover:border-blue-400"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border flex-shrink-0 ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            size="lg"
            className={`px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl transition-all duration-200 ${
              isCreating
                ? "bg-gray-400 cursor-not-allowed flex"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl flex"
            }`}
          >
            <Plus className="w-5 h-5 mr-2 mt-1" />
            {isCreating ? "Creating..." : "Create Playlist"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreatePlaylist
