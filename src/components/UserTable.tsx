import React from 'react';
import { User } from '../types';

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((usr) => (
          <tr key={usr.id}>
            <td>{usr.id}</td>
            <td>{usr.name}</td>
            <td>{usr.email}</td>
            <td>{usr.role}</td>
            <td>
              <button onClick={() => onDelete(usr.id)} style={{ color: 'red' }}>
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};