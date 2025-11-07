import { Annee } from "@/app/services/CommandeService";
import { Section } from "./section";

// Types pour les charges horaires
export interface ChargeHoraire {
  _id: string;
  agentId: string;
  coursId: string;
  anneeId: string;
  status: 'ok' | 'no' | 'pending';
  __v: number;
}

// Types pour les fiches de cotation
export interface FicheCotation {
  _id: string;
  chargeId: string | ChargeHoraire;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  logs: any[];
  __v: number;
  cmi?: string;
  examen?: string;
  rattrapage?: string;
  etudiantId: string;
  author?: string;
  reference?: string;
}

// Types pour les cours
export interface Cours {
  _id: string;
  titre: string;
  description: string;
  enseignement: string[];
  credit: number;
  contenu: string[];
  repartition: string[];
  plan: {
    anneeId: string | Annee;
    contenu: string[];
  }[];
  seances?: {
    anneeId: string | Annee;
    produitId: string | Produit;
    status: 'PENDING' | 'OK' | 'NO';
  }[];
  travaux?: {
    anneeId: string | Annee;
    questionnaire?: string;
    produitId: string | Produit;
    status: 'PENDING' | 'OK' | 'NO';
  }[];
  ressources?: string[];
  penalites?: string[];
  plagiat?: string[];
  __v: number;
  fiche_cotation?: FicheCotation | null;
}

// Types pour les descripteurs d'unités
export interface Descripteur {
  mention: string;
  code: string;
  designation: string;
  credit: number;
  type: 'Obligatoire' | 'Optionnelle';
  prealables: any[];
  objectif: string[];
  competences: string[];
  approches: any[];
  evaluation: any[];
}

// Types pour les responsables
export interface Responsable {
  titulaireId: string;
  anneeId: string;
  _id: string;
}

// Types pour les unités d'enseignement
export interface UniteEnseignement {
  descripteur: Descripteur;
  _id: string;
  semestreId: string;
  responsable: Responsable[];
  ressources: string[];
  bibliographie: any[];
  videographie: any[];
  cours: Cours[];
  __v: number;
}

// Types pour les inscriptions
export interface Inscription {
  anneeId: string;
  produitId: string;
  _id: string;
}

// Types pour les semestres
export interface Semestre {
  _id: string;
  designation: string;
  description: string;
  unites: UniteEnseignement[];
  insription: Inscription[];
  __v: number;
}

// Types pour les produits (recherches, stages, validations, etc.)
export interface Produit {
  _id: string;
  benefice: string[];
  designation: string;
  image: string;
  montant: number;
  caracteristiques: string[];
  sectionId: string | Section;
  anneeId: string | Annee;
  categorie: string[];
  avantages: string[];
  __v: number;
}

// Type alias pour les produits avec statut
export type ProduitWithStatus = Produit & { status: "OK" | "PENDING" | "NO" };

// Type principal pour l'étudiant
export interface Etudiant {
  _id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  nationalite: string;
  lieu_naissance: string;
  date_naissance: string;
  matricule: string;
  sectionId?: string;
  anneeId?: string;
  secure: string;
  documents: string[];
  photo: string;
  email?: string;
  semestres: any[];
  __v: number;
  solde: number;
}

// Type pour la réponse complète de l'authentification
export interface AuthResponse {
  token: string;
  etudiant: Etudiant;
  mySemestres: Semestre[];
  myRecherches: ProduitWithStatus[];
  myStages: ProduitWithStatus[];
  myValidations: ProduitWithStatus[];
  myReleves: ProduitWithStatus[];
  mySessions: ProduitWithStatus[];
}

// Type pour les données de connexion
export interface LoginCredentials {
  matricule: string;
  password: string;
}

// Type pour la réponse de l'API de connexion
export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}