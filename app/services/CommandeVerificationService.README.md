# CommandeVerificationService

Service réutilisable pour vérifier si un étudiant a commandé un produit et gérer les redirections appropriées.

## 🎯 Objectif

Ce service factorise la logique de vérification des commandes étudiants qui était précédemment dupliquée dans plusieurs composants. Il offre une API flexible pour différents cas d'usage.

## 📦 Installation

```typescript
import CommandeVerificationService from '@/app/services/CommandeVerificationService';
```

## 🚀 Utilisation de base

### 1. Vérification simple avec redirections automatiques

```typescript
const result = await CommandeVerificationService.checkCommande({
  produitId: 'product123',
  matricule: 'ETU001',
  redirections: {
    hasCommande: '/questionnaire/123',    // Si l'étudiant a commandé
    noCommande: '/produits/product123',   // Si pas de commande
    error: '/produits/product123'         // En cas d'erreur
  }
});
```

### 2. Vérification avec matricule automatique

```typescript
// Récupère automatiquement le matricule depuis localStorage
const result = await CommandeVerificationService.checkCommandeWithStoredMatricule('product123', {
  onSuccess: (hasCommande, data) => {
    if (hasCommande) {
      // L'étudiant a accès
      window.open('/contenu/product123', '_blank');
    } else {
      // Rediriger vers l'achat
      window.open('/produits/product123', '_blank');
    }
  }
});
```

### 3. Vérification sans redirection

```typescript
// Pour usage dans des composants/modals
const result = await CommandeVerificationService.checkCommandeOnly('product123', 'ETU001');

if (result.success && result.hasCommande) {
  // Afficher le contenu
} else {
  // Afficher un message d'accès refusé
}
```

## 🔧 API Reference

### `checkCommande(options: CommandeVerificationOptions)`

Méthode principale pour vérifier une commande avec options complètes.

**Paramètres:**
- `produitId: string` - ID du produit à vérifier
- `matricule: string` - Matricule de l'étudiant
- `onSuccess?: (hasCommande: boolean, data: any) => void` - Callback de succès
- `onError?: (error: any) => void` - Callback d'erreur
- `redirections?: object` - URLs de redirection
  - `hasCommande?: string` - URL si l'étudiant a commandé
  - `noCommande?: string` - URL si pas de commande
  - `error?: string` - URL en cas d'erreur
- `openInNewTab?: boolean` - Ouvrir dans un nouvel onglet (défaut: true)

### `checkCommandeOnly(produitId: string, matricule: string)`

Version simplifiée sans redirection automatique.

### `checkCommandeWithStoredMatricule(produitId: string, options?)`

Récupère automatiquement le matricule depuis localStorage.

## 📋 Cas d'usage

### 1. Système de travaux/devoirs (comme ECDetail)

```typescript
const checkTravail = async (travail: any) => {
  const produitId = typeof travail.produitId === 'object' ? travail.produitId._id : travail.produitId;
  
  await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId, {
    onSuccess: (hasCommande) => {
      if (hasCommande) {
        window.open(travail.questionnaire, '_blank');
      } else {
        window.open(`/produits/${produitId}`, '_blank');
      }
    }
  });
};
```

### 2. Contrôle d'accès aux ressources

```typescript
const checkResourceAccess = async (resourceId: string) => {
  const result = await CommandeVerificationService.checkCommandeWithStoredMatricule(resourceId);
  
  return result.hasCommande; // true/false
};
```

### 3. Hook React personnalisé

```typescript
const useCommandeVerification = (produitId: string) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    CommandeVerificationService.checkCommandeOnly(produitId, matricule)
      .then(result => setHasAccess(result.hasCommande));
  }, [produitId]);
  
  return hasAccess;
};
```

### 4. Vérification multiple

```typescript
const checkMultipleProducts = async (productIds: string[], matricule: string) => {
  const results = await Promise.all(
    productIds.map(id => CommandeVerificationService.checkCommandeOnly(id, matricule))
  );
  
  return results.map(r => r.hasCommande);
};
```

## 🔄 Migration depuis l'ancienne méthode

### Avant (dans ECDetail.tsx)

```typescript
const checkCommande = async ({ produitId, matricule, callback }) => {
  // Logique spécifique et non réutilisable
  const response = await EtudiantService.checkProduct(produitId, matricule);
  // ... logique hardcodée
};
```

### Après

```typescript
await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId, {
  onSuccess: (hasCommande, data) => {
    // Logique personnalisée
  }
});
```

## ✅ Avantages

1. **Réutilisabilité** - Un seul service pour tous les cas d'usage
2. **Flexibilité** - Options configurables selon le contexte
3. **Maintenabilité** - Logique centralisée et testable
4. **Type Safety** - Interfaces TypeScript complètes
5. **Gestion d'erreurs** - Callbacks et redirections d'erreur
6. **Performance** - Évite la duplication de code

## 🧪 Tests

Le service peut être testé unitairement en mockant `EtudiantService.checkProduct`:

```typescript
jest.mock('@/app/services/EtudiantService');

test('should redirect to questionnaire when student has commande', async () => {
  EtudiantService.checkProduct.mockResolvedValue({ success: true, data: true });
  
  const result = await CommandeVerificationService.checkCommandeOnly('prod123', 'ETU001');
  
  expect(result.hasCommande).toBe(true);
});
```

## 📁 Fichiers

- `CommandeVerificationService.ts` - Service principal
- `CommandeVerificationService.examples.ts` - Exemples d'utilisation
- `CommandeVerificationService.README.md` - Cette documentation
