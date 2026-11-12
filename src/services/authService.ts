const API_URL = 'http://localhost:3001';

export async function login(formData: any) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de la connexion');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
}

export const loginUser = login;

export async function register(formData: any) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de l inscription');
  }

  return await response.json();
}

export async function registerUser(name: string, email: string, password: string, role: string = 'operator') {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de l inscription');
  }

  return await response.json();
}

export async function getUsers() {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la recuperation des utilisateurs');
  }

  return await response.json();
}

export async function deleteUser(userId: number) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de la suppression');
  }

  return await response.json();
}

export async function getMetrics() {
  const response = await fetch(`${API_URL}/metrics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la recuperation des indicateurs');
  }

  return await response.json();
}

export async function createEquipment(name: string, type: string, status: string = 'active') {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/equipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, type, status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de la creation de l equipement');
  }

  return await response.json();
}

export async function createIncident(title: string, severity: string, description?: string, equipment_id?: number) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, severity, description, equipment_id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de la creation de l incident');
  }

  return await response.json();
}