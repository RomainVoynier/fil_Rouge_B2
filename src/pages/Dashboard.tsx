import React, { useEffect, useState } from 'react';
import { getEquipments } from '../services/equipmentService';
import { getIncidents } from '../services/incidentService';
import { getUsers } from '../services/userService';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    equipmentsCount: 0,
    openIncidentsCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getEquipments(), getIncidents(), getUsers()])
      .then(([equipments, incidents, users]) => {
        const openIncidents = incidents.filter(
          (inc) => inc.status === 'open' || inc.status === 'in_progress'
        );

        setStats({
          equipmentsCount: equipments.length,
          openIncidentsCount: openIncidents.length,
          usersCount: users.length,
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
          <h3>Équipements</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.equipmentsCount}</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
          <h3>Incidents ouverts</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: stats.openIncidentsCount > 0 ? 'red' : 'green' }}>
            {stats.openIncidentsCount}
          </p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '150px' }}>
          <h3>Utilisateurs</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.usersCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;