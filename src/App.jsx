import { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminProfile from "./pages/AdminProfile";
import AdminSkills from "./pages/AdminSkills";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken, clearToken } from "./api/client";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isAdminArea = pathname.startsWith("/admin");

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
    navigate("/");
  }

  function handleExpired() {
    clearToken();
    setLoggedIn(false);
    navigate("/login");
  }

  const protectedPage = (Page) => (
    <ProtectedRoute>
      <Page onExpired={handleExpired} />
    </ProtectedRoute>
  );

  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand">Portfolio</Link>
        <div className="nav-links">
          {isAdminArea ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/admin">Projects</Link>
              <Link to="/admin/skills">Skills</Link>
              <Link to="/admin/profile">Profile</Link>
            </>
          ) : isHome ? (
            <>
              <a href="#home">Home</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
              {loggedIn && <Link to="/admin">Admin</Link>}
            </>
          ) : (
            <Link to="/">Home</Link>
          )}

          {loggedIn ? (
            <button className="link-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/admin" element={protectedPage(Admin)} />
        <Route path="/admin/skills" element={protectedPage(AdminSkills)} />
        <Route path="/admin/profile" element={protectedPage(AdminProfile)} />
      </Routes>
    </>
  );
}