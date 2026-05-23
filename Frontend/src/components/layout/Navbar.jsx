import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dumbbell, Bell, User, Settings, LogOut } from "lucide-react";
import { setCredentials, logout } from "../../features/auth.slice";

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const TokenConnector = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  const connect = () => {
    const t = input.trim();
    if (!t) return;
    const user = decodeToken(t);
    dispatch(setCredentials({ token: t, user }));
    setOpen(false);
    setInput("");
  };

  if (token) {
    return (
      <button
        className="navbar-icon-btn"
        title="Cerrar sesión"
        onClick={() => dispatch(logout())}
      >
        <LogOut size={16} strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button className="connect-btn" onClick={() => setOpen((v) => !v)}>
        Conectar
      </button>
      {open && (
        <div className="token-dropdown">
          <p>Pega tu token JWT para ver tus datos</p>
          <input
            type="text"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
            autoFocus
          />
          <button onClick={connect}>Conectar</button>
        </div>
      )}
    </div>
  );
};

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "rutinas",   label: "Rutinas" },
  { id: "ejercicios", label: "Ejercicios" },
  { id: "categorias", label: "Categorias" },
];

const Navbar = ({ activeTab = "dashboard" }) => (
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
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="navbar-actions">
      <button className="navbar-icon-btn" title="Ajustes">
        <Settings size={16} strokeWidth={1.5} />
      </button>
      <button className="navbar-icon-btn" title="Notificaciones">
        <Bell size={16} strokeWidth={1.5} />
      </button>
      <TokenConnector />
    </div>
  </nav>
);

export default Navbar;
