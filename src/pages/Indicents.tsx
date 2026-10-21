import React, { useEffect, useState } from 'react';
import { Incident } from '../types';
import { getIncidents } from '../services/incidentService';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    getIncidents()
      .then(setIncidents)
  }, []);

  return (
    <div>
      <h2>Incidents</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Site</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>{incident.title}</td>
              <td>{incident.severity}</td>
              <td>{incident.site}</td>
              <td>{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Incidents;