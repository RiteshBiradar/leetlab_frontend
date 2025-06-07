import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  ChevronLeft,
  List,
  Clock,
  Hash,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

function ViewPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await api.get("/playlist/");
      setPlaylists(res.data.playlists || []);
    } catch (error) {
      toast.error("Error while fetching playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Keep your toggle function from UI
  const togglePlaylist = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  // Delete handler with perfect API call & error handling
  const handleDelete = async (playlistId) => {
    try {
      await api.delete(`/playlist/${playlistId}`);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      toast.success("Playlist deleted");
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Hard":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <Link to='/profile'>
        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ChevronLeft className="w-5 h-5 " />
          Back to Profile
        </button>
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
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex gap-2 justify-center">
            My
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Playlists
            </span>
          </h1>
          <p className="text-xl text-gray-600">View and manage your custom problem collections</p>
        </div>

        {/* Playlist Cards */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {playlists.map((playlist) => {
            const isExpanded = expandedPlaylist === playlist.id;
            const problems = playlist.problems || [];

            return (
              <div
                key={playlist.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
              >
                {/* Playlist Header */}
                <div
                  onClick={() => togglePlaylist(playlist.id)}
                  className={`p-6 cursor-pointer ${isExpanded ? "border-b border-gray-200" : ""}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
                        <List className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{playlist.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(playlist.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {playlist.description?.trim() && (
                    <p className="text-sm text-gray-500 mb-4">{playlist.description}</p>
                  )}

                  <div className="flex gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      {problems.length} problems
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Created {new Date(playlist.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Problems */}
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="grid gap-3">
                      {problems.map((problemObj) => {
                        const problem = problemObj.problem;
                        if (!problem) return null;

                        return (
                          <Link
                            key={problem.id}
                            to={`/problems/${problem.title}`}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-transform transform hover:-translate-y-0.5"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {problem.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {problem.description?.substring(0, 80) ?? "No description"}...
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-medium ${getDifficultyColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>

                              {problem.status === "solved" && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              )}
                              {problem.status === "attempted" && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Playlists Message */}
        {playlists.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center mt-8">
            <List className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No playlists yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first playlist to organize problems
            </p>
            <Link
              to="/create-playlist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Create Playlist
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPlaylists;
