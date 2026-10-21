import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Equipments } from './pages/Equipments';
import { Incidents } from './pages/Incidents';
import { Users } from './pages/Users';
import { Dashboard } from './pages/Dashboard';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>NexusOps - Cockpit de supervision</h1>

      <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <Link to="/dashboard">Tableau de bord</Link>
        <Link to="/equipments">Équipements</Link>
        <Link to="/incidents">Incidents</Link>
        <Link to="/users">Utilisateurs</Link>
      </nav>
      <hr />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipments" element={<Equipments />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;