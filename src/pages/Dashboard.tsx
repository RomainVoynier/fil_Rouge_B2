import React, { useEffect, useState } from 'react';
import { getMetrics } from '../services/authService';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    equipmentsCount: 0,
    openIncidentsCount: 0,
    totalIncidents: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics()
      .then((data) => {
        setStats({
          equipmentsCount: data.total_equipments,
          openIncidentsCount: data.open_incidents,
          totalIncidents: data.total_incidents,
        });
      })
      .catch(() => setError('Erreur de chargement des indicateurs'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement du tableau de bord...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Tableau de bord</h2>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
          <h3>Equipements</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.equipmentsCount}</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
          <h3>Incidents ouverts</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: stats.openIncidentsCount > 0 ? 'red' : 'green' }}>
            {stats.openIncidentsCount}
          </p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
          <h3>Total Incidents</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalIncidents}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;