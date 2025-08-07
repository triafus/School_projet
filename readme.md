# ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

# School_projet

Ce projet est une application web de gestion scolaire qui permet aux utilisateurs de s'inscrire, de se connecter et d'accéder à un tableau de bord administrateur. Il est construit avec une architecture basée sur le framework NestJS pour le backend et React avec Vite pour le frontend.

## Fonctionnalités clés

- Authentification des utilisateurs avec des rôles administratifs.
- Tableau de bord administrateur pour la gestion des utilisateurs.
- Interface utilisateur réactive et moderne.
- Gestion des images et des fichiers.

## Stack Technologique

| Technologie   | Description                          |
|---------------|--------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Environnement d'exécution JavaScript côté serveur. |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Langage de programmation pour le développement. |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | Framework pour construire des applications serveur efficaces et évolutives. |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateurs. |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Outil de construction pour le développement rapide d'applications web. |

## Instructions d'installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)

### Guide d'installation

1. **Clonez le dépôt :**

   ```bash
   git clone https://github.com/triafus/School_projet.git
   cd School_projet
   ```

2. **Installez les dépendances pour le client :**

   ```bash
   cd client
   npm install
   ```

3. **Installez les dépendances pour le serveur :**

   ```bash
   cd ../server
   npm install
   ```

4. **Configuration de l'environnement :**

   Créez un fichier `.env` dans le répertoire `server` et ajoutez les variables d'environnement nécessaires (par exemple, pour la connexion à la base de données, les secrets JWT, etc.). Un exemple de fichier `.env` pourrait ressembler à ceci :

   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

## Utilisation

### Lancer le projet

1. **Démarrez le serveur :**

   ```bash
   cd server
   npm run start
   ```

2. **Démarrez le client :**

   ```bash
   cd ../client
   npm run dev
   ```

### Exemples d'utilisation

- Accédez à l'application via `http://localhost:3000` pour le client.
- Utilisez les routes définies dans le backend pour interagir avec les fonctionnalités de l'application.

## Structure du projet

Voici un aperçu de la structure du projet :

```
School_projet/
├── client/                  # Répertoire du client
│   ├── public/              # Fichiers publics (images, etc.)
│   ├── src/                 # Code source du client
│   │   ├── components/      # Composants React
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── layout/          # Mise en page de l'application
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services pour les appels API
│   │   ├── apiClient.ts     # Client API
│   │   └── App.tsx          # Point d'entrée de l'application
├── server/                  # Répertoire du serveur
│   ├── src/                 # Code source du serveur
│   │   ├── auth/            # Authentification
│   │   ├── images/          # Gestion des images
│   │   ├── users/           # Gestion des utilisateurs
│   │   └── app.module.ts     # Module principal de l'application
└── .gitignore               # Fichiers à ignorer par Git
```

### Explications des répertoires principaux

- **client/** : Contient le frontend de l'application, construit avec React.
- **server/** : Contient le backend de l'application, construit avec NestJS.
- **public/** : Contient les fichiers statiques accessibles au client.
- **src/** : Contient le code source pour le client et le serveur.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

Merci de respecter les bonnes pratiques de codage et d'écrire des tests pour toute nouvelle fonctionnalité.
