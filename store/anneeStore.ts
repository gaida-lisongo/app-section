import { create } from 'zustand';
import { Annee, Response } from '../types/section';
import HomeService from '../app/services/HomeService';

interface AnneeState {
  // État
  annee: Annee | null;
  annees: Annee[];
  currentAnnee: Annee | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setAnnee: (annee: Annee) => void;
  setAnnees: (annees: Annee[]) => void;
  setCurrentAnnee: (annee: Annee | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions async
  fetchAnnee: (id: string) => Promise<void>;
  fetchAnnees: () => Promise<void>;
  fetchCurrentAnnee: () => Promise<void>;
  
  // Actions utilitaires
  clearAnnee: () => void;
  clearError: () => void;
  getAnneeByYear: (year: number) => Annee | undefined;
}

export const useAnneeStore = create<AnneeState>((set, get) => ({
  // État initial
  annee: null,
  annees: [],
  currentAnnee: null,
  loading: false,
  error: null,

  // Actions synchrones
  setAnnee: (annee: Annee) => set({ annee }),
  setAnnees: (annees: Annee[]) => set({ annees }),
  setCurrentAnnee: (annee: Annee | null) => set({ currentAnnee: annee }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Actions asynchrones
  fetchAnnee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const annees = await HomeService.fetchAnnees();
      
      if (annees) {
        const annee = annees.find(a => a._id === id);
        if (annee) {
          set({ annee, loading: false });
        } else {
          set({ error: 'Année non trouvée', loading: false });
        }
      } else {
        set({ error: 'Erreur lors du chargement de l\'année', loading: false });
      }
    } catch (error) {
      set({ error: 'Erreur réseau lors du chargement de l\'année', loading: false });
    }
  },

  fetchAnnees: async () => {
    set({ loading: true, error: null });
    try {
      const annees = await HomeService.fetchAnnees();
      
      if (annees) {
        // Trier les années par ordre décroissant (plus récente en premier)
        const sortedAnnees = annees.sort((a: Annee, b: Annee) => b.debut - a.debut);
        set({ annees: sortedAnnees, loading: false });
      } else {
        set({ error: 'Erreur lors du chargement des années', loading: false });
      }
    } catch (error) {
      set({ error: 'Erreur réseau lors du chargement des années', loading: false });
    }
  },

  fetchCurrentAnnee: async () => {
    set({ loading: true, error: null });
    try {
      const annees = await HomeService.fetchAnnees();
      
      if (annees) {
        const currentAnnee = annees[annees.length - 1] || null;
        set({ currentAnnee, loading: false });
      } else {
        set({ error: 'Erreur lors du chargement de l\'année courante', loading: false });
      }
    } catch (error) {
      set({ error: 'Erreur réseau lors du chargement de l\'année courante', loading: false });
    }
  },

  // Actions utilitaires
  clearAnnee: () => set({ annee: null }),
  clearError: () => set({ error: null }),
  
  getAnneeByYear: (year: number) => {
    const { annees } = get();
    return annees.find(a => year >= a.debut && year <= a.fin);
  },
}));