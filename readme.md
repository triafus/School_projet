# School_projet

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## Description du projet

**School_projet** est une application web complète destinée à la gestion d'une école. Elle permet aux utilisateurs de s'inscrire, de se connecter, et d'accéder à des fonctionnalités d'administration. Le projet est structuré en deux parties principales : un client construit avec React et TypeScript, et un serveur utilisant NestJS pour gérer la logique métier et les API.

### Fonctionnalités clés

- Inscription et connexion des utilisateurs
- Interface d'administration pour la gestion des utilisateurs et des images
- Affichage dynamique des contenus
- Gestion des erreurs et des chargements

## Stack Technologique

| Technologie       | Description                                       |
|-------------------|---------------------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Environnement d'exécution JavaScript côté serveur |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateur |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Superset de JavaScript qui ajoute des types statiques |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | Framework pour construire des applications serveur efficaces et évolutives |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Outil de construction rapide pour les projets modernes |

## Instructions d'installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou pnpm pour la gestion des paquets

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/triafus/School_projet.git
   cd School_projet
   ```

2. Installez les dépendances pour le client :
   ```bash
   cd client
   npm install
   ```

3. Installez les dépendances pour le serveur :
   ```bash
   cd ../server
   npm install
   ```

4. Configurez les variables d'environnement :
   - Créez un fichier `.env` dans le répertoire `server` et ajoutez les variables nécessaires (comme les clés d'API, les configurations de base de données, etc.).

## Utilisation

### Démarrer le projet

1. Démarrez le serveur :
   ```bash
   cd server
   npm run start
   ```

2. Démarrez le client :
   ```bash
   cd ../client
   npm run dev
   ```

### Exemples d'utilisation

- Accédez à l'interface utilisateur via `http://localhost:3000` (ou le port configuré).
- Utilisez les pages de connexion et d'inscription pour interagir avec l'application.

## Structure du projet

Voici un aperçu de la structure du projet :

```
School_projet/
├── client/
│   ├── dist/                  # Fichiers de distribution
│   ├── public/                # Ressources publiques
│   ├── src/                   # Code source du client
│   │   ├── components/        # Composants React
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── layout/            # Mise en page de l'application
│   │   ├── pages/             # Pages de l'application
│   │   ├── routes/            # Routes de navigation
│   │   ├── services/          # Services d'API
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Utilitaires
│   │   ├── App.tsx            # Point d'entrée de l'application
│   ├── package.json           # Dépendances du client
├── server/
│   ├── src/                   # Code source du serveur
│   │   ├── auth/              # Gestion de l'authentification
│   │   ├── images/            # Gestion des images
│   │   ├── users/             # Gestion des utilisateurs
│   │   ├── app.module.ts       # Module principal de l'application
│   ├── package.json           # Dépendances du serveur
```

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/YourFeature`).
3. Commitez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/YourFeature`).
5. Ouvrez une Pull Request.

Merci de votre intérêt pour ce projet !
