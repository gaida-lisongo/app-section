export interface Semestre {
  _id: string;
  numero: number;
  annee_academique: string;
  notes?: Note[];
}

export interface Note {
  matiere: string;
  note: number;
  credits: number;
}

export interface Etudiant {
  _id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  nationalite: string;
  lieu_naissance: string;
  date_naissance: Date | string;
  matricule: string;
  sectionId: string; // Référence à la section
  secure: string; // mot de passe
  solde: number;
  documents?: string[]; // URLs des documents
  photo?: string;
  semestres?: Semestre[]; // Géré par l'étudiant lui-même
  created_at: Date | string;
  updated_at?: Date | string;
}