import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageSkills from "./pages/ManageSkills.jsx";
import ManageProjects from "./pages/ManageProjects.jsx";

// function AdminDashboard() {
//   return <h1>Admin Dashboard</h1>;
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/skills" element={<ManageSkills />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
