# ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

# School_projet

Ce projet est une application web développée pour la gestion scolaire. Il permet aux utilisateurs de s'inscrire, de se connecter et d'accéder à un tableau de bord administrateur pour gérer les utilisateurs et les rôles. Ce projet utilise une architecture client-serveur, avec une interface utilisateur construite en React et un backend développé avec NestJS.

## Fonctionnalités clés

- **Inscription et connexion des utilisateurs** : Les utilisateurs peuvent créer un compte et se connecter.
- **Tableau de bord administrateur** : Accès à un tableau de bord pour gérer les utilisateurs et les rôles.
- **Routes protégées** : Accès sécurisé aux pages en fonction des rôles des utilisateurs.

## Stack Technologique

| Technologie       | Description                                                |
|-------------------|------------------------------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Environnement d'exécution JavaScript côté serveur.        |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Superset de JavaScript qui ajoute des types statiques.    |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateur. |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | Framework pour construire des applications serveur efficaces. |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Outil de construction et de développement rapide pour les projets modernes. |

## Instructions d'installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)

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

4. Configurez les variables d'environnement (si nécessaire) :
   - Créez un fichier `.env` à la racine du dossier `server` et ajoutez les variables nécessaires, par exemple :
     ```
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     ```

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

### Exemple d'utilisation

- Accédez à l'application via `http://localhost:3000` dans votre navigateur.
- Utilisez les formulaires d'inscription et de connexion pour accéder au tableau de bord.

## Structure du projet

Voici un aperçu de la structure du projet :

```
School_projet/
├── client/                # Code source de l'application frontend
│   ├── public/            # Fichiers publics (images, etc.)
│   ├── src/               # Code source de l'application
│   │   ├── components/     # Composants React
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── services/       # Services API
│   │   ├── types/          # Types TypeScript
│   │   ├── App.tsx         # Point d'entrée de l'application
│   │   └── main.tsx        # Fichier principal pour le rendu
├── server/                # Code source de l'application backend
│   ├── src/               # Code source du serveur
│   │   ├── auth/          # Gestion de l'authentification
│   │   ├── users/         # Gestion des utilisateurs
│   │   └── app.module.ts   # Module principal de l'application
└── package.json           # Fichier de configuration des dépendances
```

### Explication des fichiers principaux

- **client/src/App.tsx** : Point d'entrée de l'application React.
- **server/src/main.ts** : Point d'entrée de l'application NestJS.
- **server/src/auth/** : Contient la logique d'authentification (contrôleurs, services, etc.).
- **server/src/users/** : Contient la logique de gestion des utilisateurs.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre ces étapes :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalité`).
3. Effectuez vos modifications et validez (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vos modifications (`git push origin feature/ma-fonctionnalité`).
5. Ouvrez une Pull Request.

Merci de votre intérêt pour ce projet !
