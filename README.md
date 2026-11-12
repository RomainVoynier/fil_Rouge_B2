# NexusOps - Système de Supervision et Gestion d'Incidents

NexusOps est une application web modulaire de supervision technique permettant de gérer des équipements, de déclarer et suivre des incidents en temps réel, et d'administrer les utilisateurs. Le projet repose sur une architecture moderne séparant un backend robuste (FastAPI + SQLite) et un frontend modulaire (React + TypeScript).

---

## Stack Technique

### Backend (`/backend`)
* Python / FastAPI : Framework asynchrone pour la création de l'API REST.
* SQLAlchemy : ORM pour la gestion de la base de données.
* SQLite : Base de données légère et persistante (`nexusops.db`).
* Uvicorn : Serveur ASGI pour lancer l'application.

### Frontend (`/src`)
* React avec TypeScript : Pour une interface utilisateur typée et sécurisée.
* Architecture Modulaire : Découpage rigoureux par entités (Composants `Form` et `Table` séparés, services centralisés).
* Fetch API : Pour la communication avec le backend via des endpoints centralisés (`API_ENDPOINTS`).

---

## Structure du Projet

```text
fil_Rouge_B2/
│
├── backend/
│   ├── main.py          # Point d'entrée FastAPI (Routes CRUD & Metrics)
│   ├── models.py        # Modèles SQLAlchemy (Base de données SQLite)
│   ├── database.py      # Configuration de la connexion SQLite
│   ├── requirements.txt # Dépendances Python
│   └── nexusops.db      # Fichiers de persistance SQLite
│
└── src/
    ├── components/      # Composants réutilisables (Formulaires & Tableaux)
    │   ├── IncidentForm.tsx
    │   ├── IncidentTable.tsx
    │   ├── EquipmentTable.tsx
    │   └── UserTable.tsx
    ├── pages/           # Pages principales de l'application
    │   ├── Dashboard.tsx
    │   ├── Incidents.tsx
    │   ├── Equipments.tsx
    │   └── Users.tsx
    ├── services/        # Services API centralisés
    │   ├── api.ts       # URLs globales et endpoints
    │   ├── incidentService.ts
    │   ├── equipmentService.ts
    │   └── userService.ts
    ├── types/           # Définitions des types TypeScript (Interfaces)
    └── App.tsx          # Routeur principal