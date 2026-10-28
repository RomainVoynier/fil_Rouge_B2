import { User } from '../types';
import { API_ENDPOINTS } from './api';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(API_ENDPOINTS.users);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return response.json();
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(API_ENDPOINTS.users, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }
  
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.users}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
};