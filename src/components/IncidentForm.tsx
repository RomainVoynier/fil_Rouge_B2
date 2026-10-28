import React, { useState } from 'react';
import { Equipment } from '../types';

interface IncidentFormProps {
  equipments: Equipment[];
  onSubmit: (incident: { title: string; severity: 'low' | 'medium' | 'high'; status: 'open' | 'in_progress' | 'resolved'; equipmentId: number }) => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ equipments, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'resolved'>('open');
  const [equipmentId, setEquipmentId] = useState<number | ''>(equipments.length > 0 ? equipments[0].id : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || equipmentId === '') return;

    onSubmit({
      title,
      severity,
      status,
      equipmentId: Number(equipmentId),
    });

    setTitle('');
  };

  return (
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
        <label>Statut : </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="open">Ouvert</option>
          <option value="in_progress">En cours</option>
          <option value="resolved">Résolu</option>
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
  );
};