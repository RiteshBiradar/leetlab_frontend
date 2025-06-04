import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code, ChevronLeft, Plus, Check } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import api from "../api/axios.js";

function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems/getAllProblems");
        setProblems(response.data?.problems || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemToggle = (problemId) => {
    setSelectedProblems(prev =>
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    if (selectedProblems.length === 0) {
      alert("Please select at least one problem");
      return;
    }

    setIsCreating(true);

    try {
      const createRes = await api.post("/playlist/create", {
        name: playlistName,
        description: playlistDescription,
      });

      const playlistId = createRes.data?.playlist?.id;
      if (!playlistId) throw new Error("Playlist creation failed");

      for (let problemId of selectedProblems) {
        await api.post(`/playlist/${playlistId}/addProblem`, {
          problemId,
        });
      }

      alert(`Playlist "${playlistName}" created successfully!`);
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedProblems([]);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      alert("Something went wrong. Try again!");
    } finally {
      setIsCreating(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-200 mb-8 shadow-sm">
        <Link to="/profile" className="flex items-center text-gray-500 hover:text-gray-700">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">CodeChallenge</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Playlist Details</h2>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Playlist Name *</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="w-full p-3 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Enter playlist description"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md text-sm resize-y"
              />
            </div>
          </div>
        </div>

        {/* Problem selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Problems ({selectedProblems.length} selected)
          </h2>

          <div className="grid gap-3">
            {problems.map((problem) => {
              const isSelected = selectedProblems.includes(problem.id);
              return (
                <div
                  key={problem.id}
                  onClick={() => handleProblemToggle(problem.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow"
                      : "border-gray-200 bg-white hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{problem.title}</h3>
                    <p className="text-sm text-gray-500">{problem.description}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <Button
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-md ${
              isCreating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            {isCreating ? "Creating..." : "Create Playlist"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePlaylist;
