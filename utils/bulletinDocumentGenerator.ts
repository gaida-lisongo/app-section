import { Resultat } from '@/app/services/CommandeService';
import { Classe } from '@/app/services/CycleService';
import { Etudiant } from '@/types/etudiant';
import { SemestreResultat } from '@/types/resultat';
import { Section } from '@/types/section';
import BulletinDocument from './BulletinDocument';

/**
 * Génère un bulletin PDF en utilisant la classe BulletinDocument
 * Cette fonction remplace generateBulletinPDF du bulletinGenerator.ts
 */
export const generateBulletinPDF = (
    resultat: Resultat,
    etudiant: Etudiant,
    classe: Classe,
    semestres: SemestreResultat[],
    section?: Section
) => {
    try {
        // Créer une instance du générateur de bulletin
        const bulletinDoc = new BulletinDocument(resultat, etudiant, classe, semestres);
        
        // Ajouter la section si disponible
        if (section) {
            (bulletinDoc as any).section = section;
        }
        
        // Générer et télécharger le bulletin
        bulletinDoc.generateBulletin();
        
        console.log('Bulletin PDF généré avec succès');
        
    } catch (error) {
        console.error('Erreur lors de la génération du bulletin PDF:', error);
        throw new Error('Impossible de générer le bulletin PDF. Veuillez réessayer.');
    }
};

/**
 * Interface pour les données nécessaires à la génération du bulletin
 */
export interface BulletinGenerationData {
    resultat: Resultat;
    etudiant: Etudiant;
    classe: Classe;
    semestres: SemestreResultat[];
    section?: Section;
}

/**
 * Fonction utilitaire pour valider les données avant génération
 */
export const validateBulletinData = (data: BulletinGenerationData): boolean => {
    const { resultat, etudiant, classe, semestres } = data;
    
    // Vérifications de base
    if (!etudiant || !etudiant.matricule) {
        console.error('Données étudiant manquantes ou incomplètes');
        return false;
    }
    
    if (!classe || !classe.designation) {
        console.error('Données classe manquantes ou incomplètes');
        return false;
    }
    
    if (!semestres || semestres.length === 0) {
        console.error('Aucun semestre trouvé');
        return false;
    }
    
    // Vérifier que chaque semestre a des unités
    const hasValidSemestres = semestres.some(semestre => 
        semestre.unites && semestre.unites.length > 0
    );
    
    if (!hasValidSemestres) {
        console.error('Aucun semestre avec des unités valides trouvé');
        return false;
    }
    
    return true;
};

/**
 * Fonction principale pour générer un bulletin avec validation
 */
export const generateValidatedBulletinPDF = (data: BulletinGenerationData) => {
    // Valider les données
    if (!validateBulletinData(data)) {
        throw new Error('Données invalides pour la génération du bulletin');
    }
    
    // Générer le bulletin
    generateBulletinPDF(
        data.resultat,
        data.etudiant,
        data.classe,
        data.semestres,
        data.section
    );
};

export default {
    generateBulletinPDF,
    generateValidatedBulletinPDF,
    validateBulletinData
};
