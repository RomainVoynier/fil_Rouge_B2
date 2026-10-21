import React, { useEffect, useState } from 'react';
import { Equipment } from '../types';
import { getEquipments } from '../services/equipmentService';

export const Equipments: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
    getEquipments()
      .then(setEquipments)
  }, []);

  return (
    <div>
      <h2>Équipements</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Site</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((eq) => (
            <tr key={eq.id}>
              <td>{eq.id}</td>
              <td>{eq.name}</td>
              <td>{eq.type}</td>
              <td>{eq.site}</td>
              <td>{eq.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Equipments;