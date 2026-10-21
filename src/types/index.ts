export interface Equipment {
  id: number;
  name: string;
  type: string;
  site: string;
  status: "online" | "offline";
}

export interface Incident {
  id: number;
  title: string;
  severity: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  equipmentId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
}