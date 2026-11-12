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