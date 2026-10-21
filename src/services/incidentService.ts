import { Incident } from "../types";

const API_URL = "http://localhost:3001";

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_URL}/incidents`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des incidents");
  return response.json();
}

export async function createIncident(newIncident: Omit<Incident, "id">): Promise<Incident> {
  const response = await fetch(`${API_URL}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIncident),
  });
  if (!response.ok) throw new Error("Erreur lors de la création de l'incident");
  return response.json();
}