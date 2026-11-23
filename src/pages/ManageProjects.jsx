import { adminFetch } from "../utils/adminFetch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ManageProjects.css";

const API_URL = "http://localhost:5000/api/projects";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //   const token = sessionStorage.getItem("adminToken");

  async function fetchProjects() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("technologies", technologies);
    formData.append("github_url", githubUrl);
    formData.append("live_url", liveUrl);

    if (image) {
      formData.append("image", image);
    }

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const response = await adminFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project");
      }

      setMessage(data.message);
      resetForm();
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setTechnologies("");
    setGithubUrl("");
    setLiveUrl("");
    setImage(null);
    setEditingId(null);

    const fileInput = document.getElementById("project-image");
    if (fileInput) fileInput.value = "";
  }

  function startEditing(project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies || "");
    setGithubUrl(project.github_url || "");
    setLiveUrl(project.live_url || "");
    setImage(null);
    setError("");
    setMessage("");
  }

  async function deleteProject(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await adminFetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project");
      }

      setMessage(data.message);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="manage-page">
      <header className="manage-header">
        <div>
          <h1>Manage Projects</h1>
          <p>Add, update, and remove your portfolio projects.</p>
        </div>

        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </header>

      {error && <p className="manage-error">{error}</p>}
      {message && <p className="manage-success">{message}</p>}

      <form className="manage-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>

        <label htmlFor="project-title">Project Title</label>
        <input
          id="project-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: Inventory Management System"
          required
        />

        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          required
        />

        <label htmlFor="project-technologies">Technologies</label>
        <input
          id="project-technologies"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, Node.js, MySQL"
        />

        <label htmlFor="project-github">GitHub URL</label>
        <input
          id="project-github"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/project"
        />

        <label htmlFor="project-live">Live Demo URL</label>
        <input
          id="project-live"
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://example.com"
        />

        <label htmlFor="project-image">Project Screenshot</label>
        <input
          id="project-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setImage(e.target.files[0] || null)}
          required={!editingId}
        />

        <button type="submit">
          {editingId ? "Save Changes" : "Add Project"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <section className="manage-list">
        <h2>Existing Projects ({projects.length})</h2>

        {projects.map((project) => (
          <div className="manage-item" key={project.id}>
            <div>
              <h3>{project.title}</h3>
              <p>{project.technologies}</p>
            </div>

            <div className="manage-actions">
              <button onClick={() => startEditing(project)}>Edit</button>
              <button onClick={() => deleteProject(project.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ManageProjects;
