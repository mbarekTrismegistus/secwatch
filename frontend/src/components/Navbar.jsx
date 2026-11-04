import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings2,
  Sun,
  Users,
} from "lucide-react";
import { auth } from "../services/authService";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import BrandMark from "./BrandMark";

const roleNames = {
  ADMIN: "Administrateur",
  TECHNICIAN: "Technicien",
  EMPLOYEE: "Employé",
};

export default function Navbar() {
  const user = auth.user();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const incidentPath =
    user?.role === "TECHNICIAN"
      ? "/assigned"
      : user?.role === "ADMIN"
        ? "/admin/incidents"
        : "/incidents";

  const links = [
    { to: "/", label: "Vue d’ensemble", icon: LayoutDashboard, end: true },
    { to: incidentPath, label: "Incidents", icon: ClipboardList },
    ...(user?.role === "ADMIN"
      ? [{ to: "/admin/users", label: "Utilisateurs", icon: Users }]
      : []),
    { to: "/profile", label: "Mon profil", icon: Settings2 },
  ];

  function logout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="SecWatch, accueil">
          <BrandMark />
          <span>secwatch</span>
        </NavLink>

        <div className="workspace-switcher">
          <div className="workspace-icon">S</div>
          <div className="workspace-copy">
            <strong>Équipe sécurité</strong>
            <span>Espace de travail</span>
          </div>
          <Activity size={15} className="workspace-signal" />
        </div>

        <div className="nav-section-label">ESPACE</div>
        <nav className="side-nav" aria-label="Navigation principale">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Incidents" && user?.role === "TECHNICIAN" && (
                <span className="nav-link-dot" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-status">
            <span className="status-pulse" />
            <span>Suivi des incidents</span>
          </div>
          <button className="profile-chip" onClick={() => navigate("/profile")}>
            <span className="avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
            </span>
            <span className="profile-copy">
              <strong>{user?.fullName || "Utilisateur"}</strong>
              <small>{roleNames[user?.role] || user?.role}</small>
            </span>
            <Settings2 size={15} />
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>SecWatch</span>
            <span className="breadcrumb-slash">/</span>
            <strong>
              {links.find((link) => link.to === location.pathname)?.label ||
                "Détail incident"}
            </strong>
          </div>
          <div className="topbar-actions">
            <span className="environment-badge">
              <span /> Espace de travail
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                theme === "dark"
                  ? "Activer le thème clair"
                  : "Activer le thème sombre"
              }
              title={theme === "dark" ? "Thème clair" : "Thème sombre"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="logout-button"
              onClick={logout}
            >
              <LogOut size={15} />
              <span>Déconnexion</span>
            </Button>
          </div>
        </header>
        <main className="content-area" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
