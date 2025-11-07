import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Etudiant, AuthResponse, Semestre, Produit, ProduitWithStatus, LoginCredentials } from '../types/etudiant';
import EtudiantService from '../app/services/EtudiantService';

interface UserAuthState {
  // État d'authentification
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
  
  // Données de l'étudiant connecté
  etudiant: Etudiant | null;
  mySemestres: Semestre[];
  myRecherches: ProduitWithStatus[];
  myStages: ProduitWithStatus[];
  myValidations: ProduitWithStatus[];
  myReleves: ProduitWithStatus[];
  mySessions: ProduitWithStatus[];
  
  // Actions d'authentification
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  connect: (credentials: LoginCredentials) => Promise<boolean>;
  
  // Actions de gestion du profil
  updateProfile: (updateData: Partial<Etudiant>) => Promise<boolean>;
  refreshProfile: () => Promise<boolean>;
  
  // Actions utilitaires
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getFullName: () => string;
  getTotalCredits: () => number;
  getValidatedCredits: () => number;
  getPendingCredits: () => number;
}

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set, get) => ({
      // État initial
      isAuthenticated: false,
      isLoading: false,
      token: null,
      error: null,
      etudiant: null,
      mySemestres: [],
      myRecherches: [] as ProduitWithStatus[],
      myStages: [] as ProduitWithStatus[],
      myValidations: [] as ProduitWithStatus[],
      myReleves: [] as ProduitWithStatus[],
      mySessions: [] as ProduitWithStatus[],

      // Action de connexion
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await EtudiantService.loginEtudiant(credentials);
          
          if (response.success && response.data) {
            const { token, etudiant, mySemestres, myRecherches, myStages, myValidations, myReleves, mySessions } = response.data;
            
            set({
              isAuthenticated: true,
              isLoading: false,
              token,
              etudiant,
              mySemestres,
              myRecherches,
              myStages,
              myValidations,
              myReleves,
              mySessions,
              error: null
            });
            
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Échec de la connexion'
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de la connexion'
          });
          return false;
        }
      },

      connect: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await EtudiantService.login(credentials);
          
          if (response.success && response.data) {
            const { token, etudiant, mySemestres, myRecherches, myStages, myValidations, myReleves, mySessions } = response.data;
            
            set({
              isAuthenticated: true,
              isLoading: false,
              token,
              etudiant,
              mySemestres,
              myRecherches,
              myStages,
              myValidations,
              myReleves,
              mySessions,
              error: null
            });
            
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Échec de la connexion'
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de la connexion'
          });
          return false;
        }
      },

      // Action de déconnexion
      logout: () => {
        EtudiantService.logout();
        set({
          isAuthenticated: false,
          token: null,
          etudiant: null,
          mySemestres: [],
          myRecherches: [] as ProduitWithStatus[],
          myStages: [] as ProduitWithStatus[],
          myValidations: [] as ProduitWithStatus[],
          myReleves: [] as ProduitWithStatus[],
          mySessions: [] as ProduitWithStatus[],
          error: null
        });
      },

      // Action de mise à jour du profil
      updateProfile: async (updateData: Partial<Etudiant>) => {
        const { etudiant } = get();
        if (!etudiant) return false;

        set({ isLoading: true, error: null });

        try {
          const response = await EtudiantService.updateEtudiant(etudiant._id, updateData);
          
          if (response.success && response.data) {
            set({
              etudiant: response.data,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Échec de la mise à jour'
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de la mise à jour'
          });
          return false;
        }
      },

      // Action de rafraîchissement du profil
      refreshProfile: async () => {
        const { etudiant } = get();
        if (!etudiant) return false;

        set({ isLoading: true, error: null });

        try {
          const response = await EtudiantService.getEtudiantProfile(etudiant._id);
          
          if (response.success && response.data) {
            const { etudiant: updatedEtudiant, mySemestres, myRecherches, myStages, myValidations, myReleves, mySessions } = response.data;
            
            set({
              etudiant: updatedEtudiant,
              mySemestres,
              myRecherches,
              myStages,
              myValidations,
              myReleves,
              mySessions,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Échec du rafraîchissement'
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors du rafraîchissement'
          });
          return false;
        }
      },

      // Actions utilitaires
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Getters
      getFullName: () => {
        const { etudiant } = get();
        if (!etudiant) return '';
        return `${etudiant.prenom} ${etudiant.nom} ${etudiant.post_nom}`.trim();
      },

      getTotalCredits: () => {
        const { mySemestres } = get();
        return mySemestres.reduce((total, semestre) => {
          return total + semestre.unites.reduce((semestreTotal, unite) => {
            return semestreTotal + unite.cours.reduce((uniteTotal, cours) => {
              return uniteTotal + cours.credit;
            }, 0);
          }, 0);
        }, 0);
      },

      getValidatedCredits: () => {
        const { mySemestres } = get();
        return mySemestres.reduce((total, semestre) => {
          return total + semestre.unites.reduce((semestreTotal, unite) => {
            return semestreTotal + unite.cours.reduce((uniteTotal, cours) => {
              // Considérer comme validé si la fiche de cotation existe et est validée
              if (cours.fiche_cotation && cours.fiche_cotation.status === 'APPROVED') {
                return uniteTotal + cours.credit;
              }
              return uniteTotal;
            }, 0);
          }, 0);
        }, 0);
      },

      getPendingCredits: () => {
        const { mySemestres } = get();
        return mySemestres.reduce((total, semestre) => {
          return total + semestre.unites.reduce((semestreTotal, unite) => {
            return semestreTotal + unite.cours.reduce((uniteTotal, cours) => {
              // Considérer comme en attente si la fiche de cotation existe mais n'est pas validée
              if (cours.fiche_cotation && cours.fiche_cotation.status === 'PENDING') {
                return uniteTotal + cours.credit;
              }
              return uniteTotal;
            }, 0);
          }, 0);
        }, 0);
      }
    }),
    {
      name: 'etudiant-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        etudiant: state.etudiant,
        mySemestres: state.mySemestres,
        myRecherches: state.myRecherches,
        myStages: state.myStages,
        myValidations: state.myValidations,
        myReleves: state.myReleves,
        mySessions: state.mySessions,
      }),
    }
  )
);