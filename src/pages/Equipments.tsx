import React, { useEffect, useState } from 'react';
import { createEquipment } from '../services/authService';

export const Equipments = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  const fetchEquipments = async () => {
    try {
      const response = await fetch('http://localhost:3001/equipments');
      const data = await response.json();
      setEquipments(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des equipements');
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createEquipment(name, type, status);
      setName('');
      setType('');
      setStatus('active');
      fetchEquipments();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la creation');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestion des equipements</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nom</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((eq) => (
            <tr key={eq.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.type}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{eq.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};