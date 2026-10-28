import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers, deleteUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError('Erreur de chargement des utilisateurs'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((usr) => usr.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
};

export default Users;