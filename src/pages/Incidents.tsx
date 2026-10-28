import React, { useEffect, useState } from 'react';
import { Incident, Equipment } from '../types';
import { getIncidents, createIncident } from '../services/incidentService';
import { getEquipments } from '../services/equipmentService';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [equipmentId, setEquipmentId] = useState<number | ''>('');

  useEffect(() => {
    Promise.all([getIncidents(), getEquipments()])
      .then(([incidentsData, equipmentsData]) => {
        setIncidents(incidentsData);
        setEquipments(equipmentsData);
        if (equipmentsData.length > 0) setEquipmentId(equipmentsData[0].id);
      })
      .catch(() => setError('Erreur de chargement des données'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || equipmentId === '') return;

    try {
      // On envoie l'incident à l'API pour qu'il soit sauvegardé dans SQLite
      const newIncident = await createIncident({
        title,
        severity,
        status: 'open',
        equipmentId: Number(equipmentId),
      });

      // On met à jour l'affichage avec l'incident renvoyé par l'API (qui a son vrai ID de base de données)
      setIncidents([...incidents, newIncident]);
      setTitle('');
    } catch (err) {
      setError('Erreur lors de la création de l\'incident');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Incidents</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>Déclarer un incident</h3>
        <div>
          <label>Titre : </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Sévérité : </label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
        <div>
          <label>Équipement : </label>
          <select value={equipmentId} onChange={(e) => setEquipmentId(Number(e.target.value))} required>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Créer</button>
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Sévérité</th>
            <th>Statut</th>
            <th>Équipement ID</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td>{inc.id}</td>
              <td>{inc.title}</td>
              <td>{inc.severity}</td>
              <td>{inc.status}</td>
              <td>{inc.equipmentId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Incidents;