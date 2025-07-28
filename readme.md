# Template Fullstack React TypeScript + NestJS

Un template complet pour une application fullstack avec authentification, utilisant React TypeScript pour le frontend et NestJS pour le backend.

## 🚀 Fonctionnalités

- **Frontend React TypeScript** avec routing et context d'authentification
- **Backend NestJS** avec authentification JWT
- **Base de données SQLite** avec TypeORM
- **Authentification complète** (inscription, connexion, déconnexion)
- **Routes protégées** côté frontend et backend
- **Validation des données** avec class-validator
- **Hashage des mots de passe** avec bcryptjs
- **Interface utilisateur moderne** et responsive

## 📁 Structure du projet

```
fullstack-auth-app/
├── client/                 # Frontend React TypeScript
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── contexts/       # Context d'authentification
│   │   ├── services/       # Services API
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Module d'authentification
│   │   ├── users/         # Module utilisateurs
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── package.json           # Scripts racine
└── README.md
```

## 🛠️ Installation

### 1. Cloner le projet et installer les dépendances

```bash
# Installer les dépendances du projet principal
npm install

# Installer toutes les dépendances (client + server)
npm run install:all
```

### 2. Variables d'environnement

Créer un fichier `.env` dans le dossier `server/` :

```env
JWT_SECRET=votre-secret-jwt-super-securise-et-long
DATABASE_URL=./database.sqlite
```

## 🚀 Démarrage

### Mode développement

```bash
# Démarrer le frontend et le backend simultanément
npm run dev

# Ou séparément :
npm run start:client   # Frontend sur http://localhost:3000
npm run start:server   # Backend sur http://localhost:3001
```

### Mode production

```bash
# Build les deux applications
npm run build

# Démarrer en production
npm run start:prod
```

## 🔐 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs (protégées)

- `GET /api/users/profile` - Profil utilisateur

## 🧪 Utilisation

1. **Inscription** : Créer un compte avec email, mot de passe, prénom et nom
2. **Connexion** : Se connecter avec email et mot de passe
3. **Dashboard** : Accéder à l'espace personnel après connexion
4. **Profil** : Voir les informations utilisateur
5. **Déconnexion** : Se déconnecter et être redirigé vers la page de connexion

## 🔒 Sécurité

- Mots de passe hashés avec bcryptjs
- Authentification JWT avec expiration
- Routes protégées côté frontend et backend
- Validation des données d'entrée
- Gestion des erreurs et des cas d'edge
- CORS configuré pour la sécurité

## 🎨 Personnalisation

- Modifier les styles dans `client/src/App.css`
- Ajouter de nouvelles routes dans `client/src/App.tsx`
- Créer de nouveaux modules NestJS dans `server/src/`
- Personnaliser la base de données dans `server/src/app.module.ts`

## 📝 Scripts disponibles

```bash
npm run dev           # Démarrage en mode développement
npm run build         # Build frontend + backend
npm run start:client  # Frontend uniquement
npm run start:server  # Backend uniquement
npm run install:all   # Installer toutes les dépendances
```

## 🔧 Technologies utilisées

### Frontend
- React 18
- TypeScript
- React Router DOM
- Axios
- CSS3

### Backend
- NestJS
- TypeScript
- TypeORM
- SQLite
- JWT
- Bcryptjs
- Class Validator

## 🎯 Prochaines étapes

- Ajouter des tests unitaires
- Implémenter la réinitialisation de mot de passe
- Ajouter des rôles utilisateur
- Implémenter la pagination
- Ajouter des fonctionnalités métier
- Migrer vers PostgreSQL en production

## 📄 Licence

Ce template est libre d'utilisation pour vos projets personnels et commerciaux.