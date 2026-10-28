import { Incident } from '../types';
import { API_URL } from './api';

export const getIncidents = async (): Promise<Incident[]> => {
  const response = await fetch(`${API_URL}/incidents`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des incidents');
  }
  return response.json();
};

export const createIncident = async (incident: Omit<Incident, 'id'>): Promise<Incident> => {
  const response = await fetch(`${API_URL}/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(incident),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'incident');
  }
  
  return response.json();
};