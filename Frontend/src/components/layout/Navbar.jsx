import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dumbbell, LogOut } from "lucide-react";
import { logout } from "../../features/auth.slice";

const TABS = [
  { id: "dashboard",  label: "Dashboard",   path: "/dashboard" },
  { id: "ejercicios", label: "Ejercicios",  path: "/ejercicios" },
];

const Navbar = ({ activeTab = "dashboard" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Dumbbell size={16} strokeWidth={2.2} />
        FitTrack
      </div>

      <div className="navbar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`navbar-tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <div className="navbar-user-info">
          <span className="navbar-user-email">{user?.email || ""}</span>
          <span className={`navbar-plan-tag plan-${user?.plan || "plus"}`}>
            {user?.plan || "plus"}
          </span>
        </div>
        <button className="navbar-icon-btn" title="Cerrar sesión" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
