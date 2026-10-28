import React from 'react';
import { Incident } from '../types';

interface IncidentTableProps {
  incidents: Incident[];
  onDelete: (id: number) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents, onDelete }) => {
  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Titre</th>
          <th>Sévérité</th>
          <th>Statut</th>
          <th>Équipement ID</th>
          <th>Actions</th>
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
            <td>
              <button onClick={() => onDelete(inc.id)} style={{ color: 'red' }}>
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};