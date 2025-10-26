# GlycAmed
 
## Description
 
[Brève description du projet]
 
## Prérequis
 
- Docker et docker-compose
- Node.js 18+ (pour développement local)
 
## Installation et lancement
 
### Avec Docker (recommandé)
 
```bash
docker compose up
```
```
glycamed/
├── backend/
│   ├── src/
│   │   ├── models/         # Schémas Mongoose
│   │   ├── controllers/    # Logique de traitement des requêtes
│   │   ├── services/       # Logique métier
│   │   ├── routes/         # Définition des routes
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── types/          # Interfaces et types TypeScript
│   │   │   └── dtos/       # Data Transfer Objects
│   │   ├── utils/          # Fonctions utilitaires
│   │   ├── config/         # Configuration (DB, etc.)
│   │   └── index.ts        # Point d'entrée
│   ├── Dockerfile
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── assets/
├── docker-compose.yml
└── README.md
```