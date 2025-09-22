# 🛒 Système de Panier E-commerce

## Vue d'ensemble

Ce système de panier e-commerce complet permet aux étudiants d'ajouter des produits (cours, formations) à leur panier et de passer commande avec leur matricule étudiant.

## 🏗️ Architecture

### Store Zustand (`store/panierStore.ts`)
- **Gestion d'état** : Items du panier, UI, données de checkout
- **Persistance** : Sauvegarde automatique dans localStorage
- **Actions** : Ajouter, retirer, modifier quantité, vider panier
- **Getters** : Total items, prix total, quantité par produit

### Composants

#### 1. PanierIcon (`components/Panier/PanierIcon.tsx`)
- Icône panier avec badge animé
- Affichage du nombre d'articles
- Animation de pulsation lors d'ajouts

#### 2. PanierDrawer (`components/Panier/PanierDrawer.tsx`)
- Drawer latéral élégant
- Liste des produits avec images et détails
- Contrôles de quantité (+/- buttons)
- Boutons d'action (vider, checkout)

#### 3. CheckoutModal (`components/Panier/CheckoutModal.tsx`)
- Formulaire de commande avec validation
- Matricule étudiant obligatoire
- Champs optionnels : nom, email, téléphone
- Résumé de commande et total

#### 4. PanierProvider (`components/Panier/PanierProvider.tsx`)
- Wrapper pour intégrer tous les composants
- Gestion des modals et états globaux

### Services

#### CommandeService (`app/services/CommandeService.ts`)
- Création et gestion des commandes
- Validation des données
- Génération de numéros de commande
- API endpoints pour CRUD operations

## 🚀 Utilisation

### Installation
Le système utilise Zustand qui est déjà installé dans le projet.

### Intégration dans l'application

1. **Layout principal** (`app/(site)/layout.tsx`)
```tsx
import PanierDrawer from "@/components/Panier/PanierDrawer";

// Dans le JSX
<PanierDrawer />
```

2. **Header** (`components/Header/index.tsx`)
```tsx
import PanierIcon from "@/components/Panier/PanierIcon";

// Dans le JSX
<PanierIcon />
```

3. **Composants produits**
```tsx
import { usePanierStore } from "@/store/panierStore";

const { ajouterProduit } = usePanierStore();

// Ajouter un produit
<button onClick={() => ajouterProduit(produit, quantite)}>
  Ajouter au panier
</button>
```

## 🎯 Fonctionnalités

### Gestion du panier
- ✅ Ajouter des produits avec quantité
- ✅ Modifier la quantité des items
- ✅ Supprimer des produits individuellement
- ✅ Vider complètement le panier
- ✅ Persistance des données (localStorage)

### Interface utilisateur
- ✅ Icône panier avec badge animé
- ✅ Drawer latéral responsive
- ✅ Animations fluides (Framer Motion)
- ✅ Support du mode sombre
- ✅ États visuels (loading, erreurs)

### Checkout
- ✅ Formulaire avec validation
- ✅ Matricule étudiant obligatoire (min 5 caractères)
- ✅ Validation email et téléphone
- ✅ Résumé de commande
- ✅ Génération de numéro de commande

## 🧪 Test

### Page de test
Visitez `/test-panier` pour tester toutes les fonctionnalités :
- Ajouter des produits de test
- Vérifier les mises à jour du badge
- Tester le drawer et ses fonctionnalités
- Essayer le processus de checkout

### Produits de test inclus
- Cours de Mathématiques Avancées (15 000 FC)
- Formation en Informatique (25 000 FC)
- Cours de Français (8 000 FC)

## 💰 Formatage des prix

Le système utilise le Franc Congolais (FC) avec formatage personnalisé :
```typescript
// utils/priceFormatter.ts
export const formatPriceFC = (price: number): string => {
  return new Intl.NumberFormat('fr-CD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' FC';
};
```

## 🔧 Configuration

### Variables d'environnement
Aucune configuration spéciale requise. Le système fonctionne en mode simulation par défaut.

### Personnalisation
- Modifier les couleurs dans `tailwind.config.js`
- Ajuster les animations dans les composants
- Personnaliser les validations dans `CheckoutModal`

## 📱 Responsive Design

Le système est entièrement responsive :
- **Mobile** : Drawer pleine largeur, boutons tactiles
- **Tablet** : Drawer adaptatif, grilles optimisées
- **Desktop** : Drawer latéral, interactions hover

## 🔮 Prochaines étapes

1. **Intégration API** : Connecter aux vrais endpoints
2. **Notifications** : Remplacer les alerts par des toasts
3. **Historique** : Page des commandes passées
4. **Paiement** : Intégration gateway de paiement
5. **Email** : Confirmations automatiques

## 🐛 Dépannage

### Problèmes courants

1. **Badge ne se met pas à jour**
   - Vérifier que `usePanierStore` est utilisé correctement
   - S'assurer que le composant est dans le bon contexte

2. **Persistance ne fonctionne pas**
   - Vérifier que localStorage est disponible
   - Contrôler la configuration Zustand persist

3. **Erreurs de validation**
   - Vérifier les types des produits
   - S'assurer que les champs requis sont présents

## 📄 Licence

Ce système fait partie du projet app-section et suit la même licence.
