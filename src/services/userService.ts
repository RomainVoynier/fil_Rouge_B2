import { User } from "../types";

const API_URL = "http://localhost:3001";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  return response.json();
}