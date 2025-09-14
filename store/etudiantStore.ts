import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Etudiant } from '../types/etudiant';
import BlobManager from '../app/services/BlobManager';
import HomeService from '../app/services/HomeService';
import { useSectionStore } from './sectionStore';

interface EtudiantFormData {
  // Identité
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: 'M' | 'F' | '';
  nationalite: string;
  lieu_naissance: string;
  date_naissance: string;
  
  // Section
  sectionId?: string;
  
  // Informations
  photo?: File | null;
  photoUrl?: string;
  secure: string;
  confirmPassword: string;
  
  // Documents
  documents: File[];
  documentsUrls: string[];
}

interface EtudiantState {
  // État du formulaire
  currentStep: number;
  formData: EtudiantFormData;
  isSubmitting: boolean;
  error: string | null;
  
  // Étudiant inscrit (résultat de l'inscription)
  etudiant: Etudiant | null;
  
  // Actions du formulaire
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<EtudiantFormData>) => void;
  resetForm: () => void;
  
  // Actions de gestion des fichiers
  uploadPhoto: (file: File) => Promise<string>;
  uploadDocument: (file: File) => Promise<string>;
  
  // Actions d'inscription
  submitInscription: () => Promise<Etudiant | null>;
  
  // Actions utilitaires
  generateMatricule: () => string;
  setError: (error: string | null) => void;
}

const initialFormData: EtudiantFormData = {
  nom: '',
  post_nom: '',
  prenom: '',
  sexe: '',
  nationalite: '',
  lieu_naissance: '',
  date_naissance: '',
  sectionId: '',
  photo: null,
  photoUrl: '',
  secure: '',
  confirmPassword: '',
  documents: [],
  documentsUrls: []
};

export const useEtudiantStore = create<EtudiantState>()(
  persist(
    (set, get) => ({
      // État initial
      currentStep: 1,
      formData: initialFormData,
      isSubmitting: false,
      error: null,
      etudiant: null,

  // Actions du formulaire
  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  updateFormData: (data: Partial<EtudiantFormData>) => 
    set(state => ({ 
      formData: { ...state.formData, ...data } 
    })),
  
  resetForm: () => set({ 
    formData: initialFormData, 
    currentStep: 1, 
    error: null 
  }),

  // Actions de gestion des fichiers
  uploadPhoto: async (file: File) => {
    try {
      const result = await BlobManager.createBlob(file, { 
        type: 'photo',
        studentId: Date.now().toString() 
      });
      return result.url;
    } catch (error) {
      throw new Error('Erreur lors de l\'upload de la photo');
    }
  },

  uploadDocument: async (file: File) => {
    try {
      const result = await BlobManager.createBlob(file, { 
        type: 'document',
        studentId: Date.now().toString() 
      });
      return result.url;
    } catch (error) {
      throw new Error('Erreur lors de l\'upload du document');
    }
  },

  // Génération du matricule
  generateMatricule: () => {
    const { formData } = get();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // Obtenir le sigle de la section
    let sectionCode = 'GEN'; // Code par défaut
    let sectionId = formData.sectionId;
    
    // Si aucune section sélectionnée, utiliser la première disponible
    if (!sectionId) {
      const sectionStore = useSectionStore.getState();
      if (sectionStore.sections.length > 0) {
        sectionId = sectionStore.sections[0]._id;
      }
    }
    
    if (sectionId) {
      const sectionStore = useSectionStore.getState();
      const section = sectionStore.sections.find(s => s._id === sectionId);
      if (section && section.description.sigle) {
        // Utiliser le sigle de la section
        sectionCode = section.description.sigle.toUpperCase();
      }
    }
    
    return `${sectionCode}${year}${random}`;
  },

  // Action d'inscription
  submitInscription: async () => {
    const { formData, generateMatricule, uploadPhoto, uploadDocument } = get();
    
    set({ isSubmitting: true, error: null });
    
    try {
      // Validation
      if (!formData.nom || !formData.post_nom || !formData.prenom) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      if (formData.secure !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      if (formData.secure.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Upload de la photo
      let photoUrl = '';
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
      }

      // Upload des documents
      const documentsUrls: string[] = [];
      for (const doc of formData.documents) {
        const url = await uploadDocument(doc);
        documentsUrls.push(url);
      }

      // Utiliser section par défaut si aucune n'est sélectionnée
      let sectionId = formData.sectionId;
      if (!sectionId) {
        const sectionStore = useSectionStore.getState();
        // Prendre la première section disponible comme défaut
        if (sectionStore.sections.length > 0) {
          sectionId = sectionStore.sections[0]._id;
        }
      }

      const request = await HomeService.submitInscription({
        nom: formData.nom,
        post_nom: formData.post_nom,
        prenom: formData.prenom,
        sexe: formData.sexe as 'M' | 'F',
        nationalite: formData.nationalite,
        lieu_naissance: formData.lieu_naissance,
        date_naissance: formData.date_naissance,
        sectionId: sectionId,
        secure: formData.secure,
        photo: photoUrl,
        documents: documentsUrls,
        matricule: generateMatricule()
      })

      if (!request) {
        throw new Error('Erreur lors de l\'inscription');
      }

      // Création de l'étudiant
      const nouvelEtudiant: Etudiant = request;

      // Stockage de l'étudiant inscrit
      set(state => ({
        etudiant: nouvelEtudiant,
        isSubmitting: false
      }));

      // Reset du formulaire
      get().resetForm();
      
      return nouvelEtudiant;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'inscription',
        isSubmitting: false 
      });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'etudiant-storage',
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);