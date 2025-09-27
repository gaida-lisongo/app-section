// Types pour la structure des résultats étudiants

export interface NoteEtudiant {
  _id: string;
  reference: string;
  cmi: number | null;
  examen: number | null;
  rattrapage: number | null;
  moyenne: number;
  status: 'OK' | 'PENDING' | 'FAILED';
  anneeId: string;
}

export interface CoursResultat {
  _id: string;
  titre: string;
  description: string;
  credit: number;
  notes: NoteEtudiant[];
}

export interface UniteResultat {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  type: string;
  cours: CoursResultat[];
}

export interface SemestreResultat {
  _id: string;
  designation: string;
  description: string;
  anneesInscription: string[];
  unites: UniteResultat[];
}

export interface EtudiantInfo {
  _id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  matricule: string;
}

export interface StatistiquesResultat {
  totalCredits: number;
  creditsValides: number;
  creditsEchoues: number;
  pourcentageReussite: number;
  moyenneGenerale: number;
  nombreCours: number;
  nombreCoursValides: number;
  nombreCoursEchoues: number;
}

export interface ResultatResponse {
  success: boolean;
  message: string;
  data: {
    etudiant: EtudiantInfo;
    semestres: SemestreResultat[];
    statistiques: StatistiquesResultat;
  };
}

// Types pour l'affichage dans les DataTables
export interface NoteTableRow {
  _id?: string;
  cours: string;
  unite: string;
  cmi: number | null;
  examen: number | null;
  rattrapage: number | null;
  moyenne: number;
  credit: number;
  status: 'VALIDÉ' | 'ÉCHEC' | 'EN ATTENTE';
  annee: string;
}

export interface SemestreTableData {
  semestre: SemestreResultat;
  notes?: NoteTableRow[];
  statistiques: {
    totalCredits: number;
    creditsValides: number;
    moyenneGenerale: number;
    pourcentageReussite: number;
  };
}

// Types pour la génération PDF
export interface BulletinData {
  etudiant: EtudiantInfo;
  semestres: SemestreTableData[];
  statistiquesGlobales: StatistiquesResultat;
  dateGeneration: string;
}

export interface PageBulletin {
  type: 'garde' | 'semestre' | 'synthese';
  titre: string;
  contenu: any;
}
