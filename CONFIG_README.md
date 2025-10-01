# Configuration de l'application

## 🚀 Configuration rapide

### 1. Créer le fichier de configuration

Copiez `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

### 2. Configurer les variables

Éditez `.env.local` avec vos valeurs :

```env
# ID de l'application
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c

# URL de base de l'API
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1

# Environnement (optionnel)
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Vérifier la configuration

```bash
npm run verify-config
```

### 4. Démarrer l'application

```bash
npm run dev
```

## 📋 Variables d'environnement

### Variables obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_ID` | Identifiant unique de l'application | `68c52ec8957f9a89ad8bfc3c` |
| `NEXT_PUBLIC_API_BASE_URL` | URL de base de l'API backend | `http://192.168.1.85:4011/api/v1` |

### Variables optionnelles

| Variable | Description | Défaut | Exemple |
|----------|-------------|--------|---------|
| `NEXT_PUBLIC_ENVIRONMENT` | Environnement d'exécution | `development` | `production` |
| `NEXT_PUBLIC_API_VERSION` | Version de l'API | `v1` | `v2` |

## 🔧 Configuration par environnement

### Développement local

```env
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c
NEXT_PUBLIC_API_BASE_URL=http://localhost:4011/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production

```env
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c
NEXT_PUBLIC_API_BASE_URL=https://api.votredomaine.com/api/v1
NEXT_PUBLIC_ENVIRONMENT=production
```

### Staging

```env
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c
NEXT_PUBLIC_API_BASE_URL=https://api-staging.votredomaine.com/api/v1
NEXT_PUBLIC_ENVIRONMENT=staging
```

## 🛠️ Utilisation dans le code

### Import de la configuration

```typescript
import config from '@/app/services/config';

// Accès aux valeurs
const appId = config._id;
const apiUrl = config.base_url;
```

### Validation de la configuration

```typescript
import { validateConfig, debugConfig } from '@/app/services/config';

// Valider la configuration
if (!validateConfig()) {
  console.error('Configuration invalide');
}

// Debug (développement uniquement)
debugConfig();
```

## 🔍 Dépannage

### Problème : Variables non définies

**Symptôme :** Warnings dans la console
```
⚠️ NEXT_PUBLIC_API_BASE_URL non définie dans .env.local
```

**Solution :**
1. Vérifiez que `.env.local` existe
2. Vérifiez que les variables sont correctement nommées
3. Redémarrez le serveur de développement

### Problème : Configuration non prise en compte

**Solution :**
1. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)
2. Vérifiez que les variables commencent par `NEXT_PUBLIC_`
3. Vérifiez qu'il n'y a pas d'espaces autour du `=`

### Problème : Erreur de build

**Solution :**
1. Exécutez `npm run verify-config`
2. Vérifiez que tous les imports utilisent `./config` et non `./config.json`
3. Vérifiez que `config.ts` existe et est valide

## 📝 Scripts disponibles

```bash
# Vérifier la configuration
npm run verify-config

# Démarrer en développement
npm run dev

# Builder pour la production
npm run build

# Démarrer en production
npm run start
```

## 🔒 Sécurité

### Variables sensibles

- ❌ Ne jamais commiter `.env.local`
- ✅ Utiliser `.env.example` comme template
- ✅ Documenter les variables dans ce README

### Bonnes pratiques

1. **Préfixe NEXT_PUBLIC_** : Obligatoire pour les variables côté client
2. **Pas de secrets** : Les variables `NEXT_PUBLIC_` sont visibles côté client
3. **Validation** : Toujours valider les variables critiques
4. **Valeurs par défaut** : Fournir des valeurs par défaut sécurisées

## 📚 Ressources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Guide de migration](./MIGRATION_CONFIG.md)
- [Script de vérification](./scripts/verify-config.js)
