import "./AdminDashboard.css";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("adminToken");
    navigate("/admin");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>
          Ahmed<span>.</span>
        </h2>

        <nav>
          <a href="#overview">Overview</a>
          <a href="#skills">Manage Skills</a>
          <a href="#projects">Manage Projects</a>
        </nav>

        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p>Portfolio Management</p>
            <h1>Admin Dashboard</h1>
          </div>

          <span>Administrator</span>
        </header>

        <section id="overview" className="admin-content">
          <h2>Welcome back!</h2>
          <p>Manage your portfolio skills and projects from here.</p>

          <div className="admin-cards">
            <div className="admin-card" id="skills">
              <h3>Manage Skills</h3>
              <p>Add, edit, and delete your technical skills.</p>
              <Link to="/admin/skills" className="admin-action-link">
                Manage Skills
              </Link>
            </div>

            <div className="admin-card" id="projects">
              <h3>Manage Projects</h3>
              <p>
                Add projects, upload screenshots, and update project details.
              </p>
              <Link to="/admin/projects" className="admin-action-link">
                Manage Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
