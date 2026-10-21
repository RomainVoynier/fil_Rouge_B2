import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getUsers } from '../services/userService';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);;

  useEffect(() => {
    getUsers()
      .then(setUsers)
  }, []);

  return (
    <div>
      <h2>Utilisateurs</h2>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;