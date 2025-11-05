# Guide de Déploiement sur Vercel

Ce guide explique comment déployer l'application fullstack-auth-app sur Vercel, incluant le frontend (React/Vite) et le backend (NestJS) ainsi que la configuration avec Supabase.

## Prérequis

- Un compte Vercel ([vercel.com](https://vercel.com))
- Un projet Supabase configuré ([supabase.com](https://supabase.com))
- Le code source de l'application

## Architecture de Déploiement

L'application utilise une architecture monorepo avec :

- **Client** : Application React/TypeScript déployée comme site statique
- **Serveur** : API NestJS déployée comme fonctions serverless

## 1. Configuration Supabase

### Création d'un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un nouveau projet
2. Notez l'URL de votre projet et les clés API

### Variables d'environnement Supabase

Dans le tableau de bord Supabase, récupérez :

- **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
- **anon public key** (pour le frontend si nécessaire)
- **service_role key** (clé secrète pour le backend)

### Configuration de la base de données

Assurez-vous que votre base de données PostgreSQL est configurée avec les tables nécessaires (users, etc.). Les migrations peuvent être exécutées localement puis appliquées en production.

## 2. Déploiement sur Vercel

### Connexion à Vercel

1. Connectez-vous à votre compte Vercel
2. Importez votre projet depuis GitHub/GitLab/Bitbucket
3. Lors de l'import, Vercel détectera automatiquement la configuration monorepo grâce au fichier `vercel.json` à la racine

### Configuration du Monorepo

Le fichier `vercel.json` à la racine définit deux projets :

```json
{
  "projects": {
    "client": {
      "rootDirectory": "client"
    },
    "server": {
      "rootDirectory": "server"
    }
  }
}
```

Vercel créera automatiquement deux déploiements séparés.

## 3. Variables d'Environnement

### Pour le Backend (Serveur)

Dans les paramètres du projet serveur sur Vercel, ajoutez ces variables d'environnement :

```env
# JWT Secret (générez un secret sécurisé)
JWT_SECRET=votre_secret_jwt_tres_long_et_securise

# Base de données Supabase
DB_HOST=votre-host.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_db
DB_NAME=postgres

# Supabase
SUPABASE_URL=https://votre-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# URL du frontend (sera mis à jour après déploiement)
VITE_FRONT_URL=https://votre-frontend-url.vercel.app
```

**⚠️ Important :** Ne commitez jamais ces valeurs sensibles dans le code. Utilisez uniquement les variables d'environnement de Vercel.

### Pour le Frontend (Client)

Dans les paramètres du projet client sur Vercel, ajoutez :

```env
# URL de l'API backend (sera disponible après déploiement du serveur)
VITE_API_URL=https://votre-server-url.vercel.app/api
```

## 4. Configuration Post-Déploiement

### Mise à Jour des URLs

Après le premier déploiement :

1. Récupérez l'URL du serveur déployé (ex: `https://school-projet-server.vercel.app`)
2. Mettez à jour `VITE_API_URL` dans le frontend : `https://school-projet-server.vercel.app/api`
3. Récupérez l'URL du frontend déployé (ex: `https://school-projet-client.vercel.app`)
4. Mettez à jour `VITE_FRONT_URL` dans le backend

### Redéploiement Automatique

Après avoir mis à jour les variables d'environnement, déclenchez un nouveau déploiement :

- Poussez les changements sur votre branche principale, ou
- Utilisez le bouton "Redeploy" dans le dashboard Vercel

## 5. Configuration Supabase pour la Production

### CORS Settings

Dans les paramètres de votre projet Supabase :

1. Allez dans **Settings > API**
2. Ajoutez votre domaine frontend dans **Site URL** : `https://votre-frontend-url.vercel.app`
3. Dans **Redirect URLs**, ajoutez : `https://votre-frontend-url.vercel.app/auth/callback`

### Storage Buckets (si utilisé)

Si votre application utilise le stockage Supabase pour les fichiers :

1. Créez les buckets nécessaires dans le dashboard Supabase
2. Configurez les politiques RLS (Row Level Security) selon vos besoins
3. Assurez-vous que les clés API ont les permissions appropriées

## 6. Vérification du Déploiement

### Tests Fonctionnels

Après déploiement, vérifiez :

1. **Frontend** : L'application se charge correctement
2. **Authentification** : Inscription/connexion fonctionnent
3. **API** : Les endpoints backend répondent correctement
4. **Base de données** : Les données sont persistées dans Supabase

### Logs et Debugging

- Utilisez le dashboard Vercel pour consulter les logs
- Vérifiez les erreurs dans la console du navigateur
- Testez les fonctions serverless via les logs de Vercel

## 7. Optimisations et Bonnes Pratiques

### Performance

- Les fonctions serverless de Vercel ont un cold start, considérez les optimisations si nécessaire
- Utilisez la mise en cache appropriée pour les ressources statiques

### Sécurité

- Utilisez HTTPS (activé par défaut sur Vercel)
- Gardez les clés API privées et utilisez les variables d'environnement
- Configurez CORS correctement dans Supabase

### Monitoring

- Activez les analytics Vercel pour surveiller les performances
- Configurez des alertes pour les erreurs de déploiement

## 8. Mise à Jour et Maintenance

### Déploiements Automatiques

Chaque push sur la branche principale déclenchera automatiquement un déploiement.

### Rollbacks

En cas de problème, utilisez la fonctionnalité de rollback de Vercel pour revenir à une version précédente.

### Variables d'Environnement

Pour changer des variables sensibles, mettez-les à jour dans le dashboard Vercel et redéployez.

## Support et Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Guide de déploiement monorepo Vercel](https://vercel.com/docs/concepts/projects/monorepos)

## Résolution des Problèmes Courants

### Erreur de connexion à la base de données

- Vérifiez que les variables DB\_\* sont correctement définies
- Assurez-vous que l'IP de Vercel est autorisée dans Supabase (généralement pas nécessaire)

### Problème CORS

- Vérifiez la configuration CORS dans Supabase
- Assurez-vous que les URLs sont correctement définies

### Fonctions serverless timeout

- Les fonctions Vercel ont une limite de 10 secondes par défaut
- Optimisez les requêtes lentes ou considérez des solutions alternatives

---

Ce guide couvre le déploiement de base. Pour des configurations avancées, consultez la documentation officielle de chaque service.
