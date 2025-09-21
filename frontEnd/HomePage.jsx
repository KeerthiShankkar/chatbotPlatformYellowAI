
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [deletingProject, setDeletingProject] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDRESS}/home/getProjects`, {
        withCredentials: true,
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setCreateError("Name is required");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_ADDRESS}/home/createProject`,
        { name: newProjectName, description: newProjectDesc },
        { withCredentials: true }
      );
      setShowModal(false);
      setNewProjectName("");
      setNewProjectDesc("");
      fetchProjects();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setDeletingProject(projectId);

    const previousProjects = projects;

    setProjects((prev) => prev.filter((p) => String(p._id) !== String(projectId)));

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_ADDRESS}/home/deleteProject/${projectId}`, {
        withCredentials: true,
      });
    } catch (err) {
      setProjects(previousProjects);
      alert(err.response?.data?.message || "Failed to delete project");
    } finally {
      setDeletingProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
          <div className="flex space-x-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setShowModal(true)}
            >
              + New Project
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No projects found</h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => {
              const isDeleting = String(deletingProject) === String(project._id);
              return (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
                >
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{project.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {project.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {project.prompts?.length || 0} chats
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDeleting) handleDeleteProject(project._id);
                    }}
                    disabled={isDeleting}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Project Description (optional)"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {createError && <p className="text-red-600 mb-3">{createError}</p>}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${creating ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
