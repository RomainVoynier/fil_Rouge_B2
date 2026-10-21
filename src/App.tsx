import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipments from "./pages/Equipments";
import Incidents from "./pages/Incidents";
import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation visible en permanence */}
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#f4f4f4" }}>
          <Link to="/">Tableau de bord</Link>
          <Link to="/equipements">Équipements</Link>
          <Link to="/incidents">Incidents</Link>
          <Link to="/utilisateurs">Utilisateurs</Link>
        </nav>

        <main style={{ padding: "1.5rem" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipements" element={<Equipments />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/utilisateurs" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}