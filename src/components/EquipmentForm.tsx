import React, { useState } from 'react';

interface EquipmentFormProps {
  onSubmit: (equipment: { name: string; type: string; status: string }) => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    onSubmit({ name, type, status });
    setName('');
    setType('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Ajouter un équipement</h3>
      <div>
        <label>Nom : </label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Type : </label>
        <input value={type} onChange={(e) => setType(e.target.value)} required />
      </div>
      <div>
        <label>Statut : </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
      <button type="submit">Créer</button>
    </form>
  );
};