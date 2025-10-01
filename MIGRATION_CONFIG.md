# Migration de config.json vers les variables d'environnement

## 📋 Résumé des changements

La configuration de l'application a été migrée de `config.json` (valeurs hardcodées) vers un système utilisant les variables d'environnement pour plus de flexibilité et de sécurité.

## 🔄 Changements effectués

### 1. Fichiers supprimés
- ❌ `app/services/config.json` - Configuration statique
- ❌ `app/services/config.js` - Version JavaScript temporaire

### 2. Fichiers créés
- ✅ `app/services/config.ts` - Configuration TypeScript avec variables d'environnement
- ✅ `.env.example` - Template des variables d'environnement

### 3. Fichiers modifiés
Tous les services ont été mis à jour pour importer `config.ts` au lieu de `config.json` :

- ✅ `app/services/EtudiantService.ts`
- ✅ `app/services/CommandeService.ts`
- ✅ `app/services/TransactionService.ts`
- ✅ `app/services/Service.ts`
- ✅ `app/services/CycleService.ts`
- ✅ `app/services/ProduitService.ts`
- ✅ `app/services/SemestreService.ts`
- ✅ `app/services/HomeService.ts`
- ✅ `app/services/ContactService.ts`
- ✅ `app/(site)/produits/page.tsx`

## 🔧 Configuration requise

### Variables d'environnement nécessaires

Créez un fichier `.env.local` avec les variables suivantes :

```env
# ID de l'application
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c

# URL de base de l'API
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1

# Environnement (optionnel)
NEXT_PUBLIC_ENVIRONMENT=development

# Version de l'API (optionnel)
NEXT_PUBLIC_API_VERSION=v1
```

### Valeurs par défaut

Si les variables d'environnement ne sont pas définies, le système utilisera ces valeurs par défaut :

```typescript
{
  _id: "68c52ec8957f9a89ad8bfc3c",
  base_url: "http://localhost:4011/api/v1"
}
```

## 🚀 Avantages de la migration

### 1. **Flexibilité d'environnement**
- Configuration différente pour développement/production
- Pas besoin de modifier le code pour changer d'environnement

### 2. **Sécurité améliorée**
- Pas de valeurs sensibles dans le code source
- Variables d'environnement non versionnées

### 3. **Déploiement simplifié**
- Configuration via variables d'environnement
- Pas de rebuild nécessaire pour changer la config

### 4. **Type Safety**
- Interface TypeScript pour la configuration
- Validation automatique des types

## 📝 Utilisation

### Import de la configuration

```typescript
// Ancien (config.json)
import config from './config.json';

// Nouveau (config.ts)
import config from './config';
```

### Accès aux valeurs

```typescript
// ID de l'application
const appId = config._id;

// URL de base de l'API
const apiUrl = config.base_url;
```

### Validation et debug

```typescript
import { validateConfig, debugConfig } from './config';

// Valider la configuration
const isValid = validateConfig();

// Afficher la configuration (dev uniquement)
debugConfig();
```

## ⚠️ Points d'attention

### 1. **Variables NEXT_PUBLIC_**
Les variables utilisées côté client doivent être préfixées par `NEXT_PUBLIC_` pour être accessibles dans le navigateur.

### 2. **Fichier .env.local**
- Créez le fichier `.env.local` à la racine du projet
- Ajoutez-le à `.gitignore` (déjà fait)
- Utilisez `.env.example` comme template

### 3. **Redémarrage requis**
Après modification des variables d'environnement, redémarrez le serveur de développement :

```bash
npm run dev
```

## 🧪 Test de la migration

### 1. Vérifier que tous les imports fonctionnent
```bash
npm run build
```

### 2. Tester avec différentes configurations
Modifiez `.env.local` et vérifiez que les changements sont pris en compte.

### 3. Validation automatique
Le système affiche des warnings si des variables sont manquantes :

```
⚠️ NEXT_PUBLIC_API_BASE_URL non définie dans .env.local, utilisation de la valeur par défaut
⚠️ NEXT_PUBLIC_APP_ID non définie dans .env.local, utilisation de la valeur par défaut
```

## 📁 Structure finale

```
app/services/
├── config.ts              # ✅ Configuration avec variables d'env
├── EtudiantService.ts      # ✅ Import mis à jour
├── CommandeService.ts      # ✅ Import mis à jour
└── ...                     # ✅ Tous les services mis à jour

.env.example               # ✅ Template des variables
.env.local                 # 📝 À créer avec vos valeurs
```

## 🔄 Rollback (si nécessaire)

En cas de problème, vous pouvez temporairement revenir à l'ancienne configuration :

1. Recréer `config.json` avec les valeurs hardcodées
2. Modifier les imports dans tous les services
3. Supprimer `config.ts`

Mais il est recommandé de résoudre les problèmes de variables d'environnement plutôt que de faire un rollback.

---

✅ **Migration terminée avec succès !**

La configuration utilise maintenant les variables d'environnement pour plus de flexibilité et de sécurité.
