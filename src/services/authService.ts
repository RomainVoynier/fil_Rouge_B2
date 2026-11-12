const API_URL = 'http://localhost:3001';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Identifiants incorrects');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export function logoutUser() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}
export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur lors de l inscription');
  }

  return await response.json();
}