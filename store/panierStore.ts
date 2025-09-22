import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Produit } from '@/app/services/ProduitService';

export interface PanierItem {
  produit: Produit;
  quantite: number;
  dateAjout: Date;
}

export interface CheckoutData {
  matricule: string;
  nom?: string;
  email?: string;
  telephone?: string;
}

interface PanierStore {
  items: PanierItem[];
  isOpen: boolean;
  checkoutData: CheckoutData | null;
  
  // Actions pour gérer les items
  ajouterProduit: (produit: Produit, quantite?: number) => void;
  retirerProduit: (produitId: string) => void;
  modifierQuantite: (produitId: string, quantite: number) => void;
  viderPanier: () => void;
  
  // Actions pour le panier UI
  ouvrirPanier: () => void;
  fermerPanier: () => void;
  togglePanier: () => void;
  
  // Actions pour le checkout
  setCheckoutData: (data: CheckoutData) => void;
  clearCheckoutData: () => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (produitId: string) => number;
}

export const usePanierStore = create<PanierStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutData: null,

      // Ajouter un produit au panier
      ajouterProduit: (produit: Produit, quantite = 1) => {
        set((state) => {
          // Générer un ID unique si le produit n'en a pas
          const produitId = produit._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const produitAvecId = { ...produit, _id: produitId };
          
          const existingItemIndex = state.items.findIndex(
            (item) => item.produit._id === produitId
          );

          if (existingItemIndex >= 0) {
            // Si le produit existe déjà, augmenter la quantité
            const newItems = [...state.items];
            newItems[existingItemIndex].quantite += quantite;
            return { items: newItems };
          } else {
            // Sinon, ajouter un nouvel item
            return {
              items: [
                ...state.items,
                {
                  produit: produitAvecId,
                  quantite,
                  dateAjout: new Date(),
                },
              ],
            };
          }
        });
      },

      // Retirer un produit du panier
      retirerProduit: (produitId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.produit._id !== produitId),
        }));
      },

      // Modifier la quantité d'un produit
      modifierQuantite: (produitId: string, quantite: number) => {
        if (quantite <= 0) {
          get().retirerProduit(produitId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.produit._id === produitId
              ? { ...item, quantite }
              : item
          ),
        }));
      },

      // Vider le panier
      viderPanier: () => {
        set({ items: [], checkoutData: null });
      },

      // Actions UI du panier
      ouvrirPanier: () => set({ isOpen: true }),
      fermerPanier: () => set({ isOpen: false }),
      togglePanier: () => set((state) => ({ isOpen: !state.isOpen })),

      // Actions checkout
      setCheckoutData: (data: CheckoutData) => set({ checkoutData: data }),
      clearCheckoutData: () => set({ checkoutData: null }),

      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantite, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.produit.montant * item.quantite,
          0
        );
      },

      getItemQuantity: (produitId: string) => {
        const item = get().items.find((item) => item.produit._id === produitId);
        return item ? item.quantite : 0;
      },
    }),
    {
      name: 'panier-storage', // nom de la clé dans localStorage
      partialize: (state) => ({
        items: state.items,
        checkoutData: state.checkoutData,
      }), // ne persister que les items et checkoutData
    }
  )
);
