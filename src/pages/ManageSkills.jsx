import "./ManageSkills.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "../utils/adminFetch";
import { API_URL } from "../config";

const SKILLS_URL = `${API_URL}/api/skills`;

function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //   const token = sessionStorage.getItem("adminToken");

  async function fetchSkills() {
    try {
      const response = await fetch(SKILLS_URL);
      if (!response.ok) throw new Error("Failed to load skills");

      const data = await response.json();
      setSkills(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    const url = editingId ? `${SKILLS_URL}/${editingId}` : SKILLS_URL;

    try {
      const response = await adminFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save skill");
      }

      setMessage(data.message);
      setName("");
      setCategory("Frontend");
      setEditingId(null);
      await fetchSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(skill) {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setMessage("");
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setName("");
    setCategory("Frontend");
  }

  async function deleteSkill(id) {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const response = await adminFetch(`${SKILLS_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete skill");
      }

      setMessage(data.message);
      await fetchSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="manage-page">
      <header className="manage-header">
        <div>
          <h1>Manage Skills</h1>
          <p>Add, update, and remove your portfolio skills.</p>
        </div>

        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </header>

      {error && <p className="manage-error">{error}</p>}
      {message && <p className="manage-success">{message}</p>}

      <form className="manage-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Skill" : "Add New Skill"}</h2>

        <label htmlFor="skill-name">Skill Name</label>
        <input
          id="skill-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: React"
          required
        />

        <label htmlFor="skill-category">Category</label>
        <select
          id="skill-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="Tools">Tools</option>
        </select>

        <button type="submit">
          {editingId ? "Save Changes" : "Add Skill"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEditing}>
            Cancel
          </button>
        )}
      </form>

      <section className="manage-list">
        <h2>Existing Skills ({skills.length})</h2>

        {skills.map((skill) => (
          <div className="manage-item" key={skill.id}>
            <div>
              <h3>{skill.name}</h3>
              <p>{skill.category}</p>
            </div>

            <div className="manage-actions">
              <button onClick={() => startEditing(skill)}>Edit</button>
              <button onClick={() => deleteSkill(skill.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ManageSkills;
