import React, { useEffect, useState } from 'react';
import { Equipment } from '../types';
import { getEquipments, deleteEquipment } from '../services/equipmentService';
import { EquipmentTable } from '../components/EquipmentTable';

export const Equipments: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEquipments()
      .then(setEquipments)
      .catch(() => setError('Erreur de chargement des équipements'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEquipment(id);
      setEquipments(equipments.filter((eq) => eq.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Gestion des Équipements</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <EquipmentTable equipments={equipments} onDelete={handleDelete} />
    </div>
  );
};

export default Equipments;