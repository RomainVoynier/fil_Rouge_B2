import React, { useEffect, useState } from 'react';
import { Incident, Equipment } from '../types';
import { getIncidents, createIncident, deleteIncident } from '../services/incidentService';
import { getEquipments } from '../services/equipmentService';
import { IncidentForm } from '../components/IncidentForm';
import { IncidentTable } from '../components/IncidentTable';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getIncidents(), getEquipments()])
      .then(([incidentsData, equipmentsData]) => {
        setIncidents(incidentsData);
        setEquipments(equipmentsData);
      })
      .catch(() => setError('Erreur de chargement des données'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (newIncidentData: any) => {
    try {
      const newIncident = await createIncident(newIncidentData);
      setIncidents([...incidents, newIncident]);
    } catch (err) {
      setError('Erreur lors de la création de l\'incident');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIncident(id);
      setIncidents(incidents.filter((inc) => inc.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'incident');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Gestion des Incidents</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <IncidentForm equipments={equipments} onSubmit={handleCreate} />
      <IncidentTable incidents={incidents} onDelete={handleDelete} />
    </div>
  );
};

export default Incidents;