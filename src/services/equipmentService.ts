import { Equipment } from '../types';
import { API_ENDPOINTS } from './api';

export const getEquipments = async (): Promise<Equipment[]> => {
  const response = await fetch(API_ENDPOINTS.equipments);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return response.json();
};

export const createEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
  const response = await fetch(API_ENDPOINTS.equipments, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'équipement');
  }
  
  return response.json();
};

export const deleteEquipment = async (id: number): Promise<void> => {
  const response = await fetch(`${API_ENDPOINTS.equipments}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'équipement');
  }
};