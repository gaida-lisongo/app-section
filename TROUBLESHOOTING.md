# Guide de résolution des problèmes

## 🚨 Problème : Import trace config.js

### Symptômes
```
Import trace for requested module:
./app/services/config.js
./app/services/ProduitService.ts
./app/(site)/produits/[slug]/page.tsx
GET /favicon.ico 500 in 364ms
```

### Cause
Next.js essaie encore de résoudre l'ancien fichier `config.js` qui n'existe plus après la migration vers `config.ts` avec variables d'environnement.

### Solution complète

#### 1. Nettoyer le cache
```bash
npm run clean-cache
```

#### 2. Configurer l'environnement
```bash
npm run setup-env
```

#### 3. Vérifier la configuration
```bash
npm run verify-config
```

#### 4. Setup complet (tout en une fois)
```bash
npm run setup
```

#### 5. Redémarrer le serveur
```bash
npm run dev
```

## 🔧 Autres problèmes courants

### Variables d'environnement non définies

**Symptôme :**
```
⚠️ NEXT_PUBLIC_API_BASE_URL non définie dans .env.local
```

**Solution :**
1. Exécutez `npm run setup-env`
2. Vérifiez que `.env.local` contient les bonnes variables
3. Redémarrez le serveur

### Erreur de build TypeScript

**Symptôme :**
```
Cannot find module './config' or its corresponding type declarations
```

**Solution :**
1. Vérifiez que `config.ts` existe : `ls app/services/config.ts`
2. Vérifiez les imports : `npm run verify-config`
3. Nettoyez le cache : `npm run clean-cache`

### Page 500 au chargement

**Symptôme :**
- Pages qui se chargent avec erreur 500
- Console indique des erreurs de module

**Solution :**
1. Setup complet : `npm run setup`
2. Vérifiez les variables d'environnement
3. Redémarrez le serveur

## 📋 Scripts de diagnostic

### Vérification rapide
```bash
# Vérifier la configuration
npm run verify-config

# Voir le statut des fichiers
ls -la app/services/config*
ls -la .env*
```

### Diagnostic complet
```bash
# Setup complet
npm run setup

# Vérification finale
npm run verify-config
```

## 🔍 Vérifications manuelles

### 1. Fichiers requis
- ✅ `app/services/config.ts` doit exister
- ❌ `app/services/config.json` ne doit PAS exister
- ❌ `app/services/config.js` ne doit PAS exister
- ✅ `.env.local` doit exister avec les bonnes variables
- ✅ `.env.example` doit exister

### 2. Variables d'environnement requises
```env
NEXT_PUBLIC_APP_ID=68c52ec8957f9a89ad8bfc3c
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.85:4011/api/v1
```

### 3. Imports dans les services
Tous les services doivent importer :
```typescript
import config from './config';
```

**PAS :**
```typescript
import config from './config.json'; // ❌
import config from './config.js';   // ❌
```

## 🚀 Commandes de récupération d'urgence

### Si rien ne fonctionne

1. **Reset complet :**
```bash
npm run clean-cache
rm -f .env.local
npm run setup-env
npm run verify-config
npm run dev
```

2. **Vérification des imports :**
```bash
grep -r "config\.json" app/services/
grep -r "config\.js" app/services/
```

3. **Recréer config.ts si nécessaire :**
```bash
# Si config.ts est corrompu, le recréer
cp .env.example .env.local
# Puis modifier .env.local avec vos valeurs
```

## 📞 Support

Si le problème persiste :

1. Exécutez `npm run verify-config` et partagez la sortie
2. Vérifiez le contenu de `.env.local`
3. Vérifiez que tous les imports utilisent `./config` (sans extension)
4. Assurez-vous que le cache Next.js est nettoyé

## ✅ Configuration fonctionnelle

Une fois résolu, vous devriez voir :
- ✅ Serveur démarre sans erreur
- ✅ Pages se chargent correctement
- ✅ `npm run verify-config` passe tous les tests
- ✅ Aucune erreur 500 dans la console
