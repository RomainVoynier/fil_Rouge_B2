import { Equipment } from "../types";

const API_URL = "http://localhost:3001";

export async function getEquipments(): Promise<Equipment[]> {
  const response = await fetch(`${API_URL}/equipments`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des équipements");
  return response.json();
}