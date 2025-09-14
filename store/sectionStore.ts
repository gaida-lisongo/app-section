import { create } from 'zustand';
import { Section, Response } from '../types/section';
import HomeService from '../app/services/HomeService';

interface SectionState {
  // État
  section: Section | null;
  sections: Section[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setSection: (section: Section) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions async
  fetchSection: () => Promise<void>;
  
  // Actions utilitaires
  clearSection: () => void;
  clearError: () => void;
}

export const useSectionStore = create<SectionState>((set, get) => ({
  // État initial
  section: null,
  sections: [],
  loading: false,
  error: null,

  // Actions synchrones
  setSection: (section: Section) => set({ section }),
  
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Actions asynchrones
  fetchSection: async () => {
    set({ loading: true, error: null });
    try {
      const section = await HomeService.fetchSection();
      
      if (section) {
        set({ section, loading: false });
      } else {
        set({ error: 'Erreur lors du chargement de la section', loading: false });
      }
    } catch (error) {
      set({ error: 'Erreur réseau lors du chargement de la section', loading: false });
    }
  },

  // Actions utilitaires
  clearSection: () => set({ section: null }),
  clearError: () => set({ error: null }),
}));