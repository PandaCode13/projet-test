# GlycAmed
 
## Description
 
GlycAmed est une application collaborative de suivi de consommation de sucre et de caféine pour un étudiant spécifique nommé Amed.
 
## Prérequis
 
- Docker et docker-compose
- Node.js 22+ (pour développement local)
- (Optionel) Devcontainers dans VScode

## Installation et lancement

Créer un fichier .env et modifier les informations nécessaires
```bash
cp .env.example .env
```
 
### Avec Docker (recommandé)
 
```bash
docker compose up
```
```
glycamed/
.
├── back
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── index.ts
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── types
│   │   └── utils
│   └── tsconfig.json
├── docker-compose.yaml
├── front
│   ├── components.json
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   ├── README.md
│   ├── src
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── components
│   │   ├── index.css
│   │   ├── layouts
│   │   ├── lib
│   │   ├── main.tsx
│   │   ├── pages
│   │   ├── providers
│   │   ├── types
│   │   └── utils
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Fonctionnalités

- Authentification
- Dashboard principal
- Ajouter une consommation
- Historique des consommations (Timeline)
- Statistiques et graphiques
- Système d'alertes
- Classement des contributeurs