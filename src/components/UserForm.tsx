import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (user: { name: string; email: string; role: string }) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('technician');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onSubmit({ name, email, role });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Ajouter un utilisateur</h3>
      <div>
        <label>Nom : </label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email : </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Rôle : </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="technician">Technicien</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <button type="submit">Créer</button>
    </form>
  );
};