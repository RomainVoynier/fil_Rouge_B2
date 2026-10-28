import React from 'react';
import { Equipment } from '../types';

interface EquipmentTableProps {
  equipments: Equipment[];
  onDelete: (id: number) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({ equipments, onDelete }) => {
  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Type</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {equipments.map((eq) => (
          <tr key={eq.id}>
            <td>{eq.id}</td>
            <td>{eq.name}</td>
            <td>{eq.type}</td>
            <td>{eq.status}</td>
            <td>
              <button onClick={() => onDelete(eq.id)} style={{ color: 'red' }}>
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};