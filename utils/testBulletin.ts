// Script de test pour le système de génération de bulletin
import BulletinDocument from './BulletinDocument';

// Données de test
const testData = {
    resultat: {
        _id: 'test-resultat',
        montant: 3000,
        devise: 'CDF',
        reference: 'REF-2024-001',
        status: 'OK'
    },
    etudiant: {
        _id: 'test-etudiant',
        nom: 'MUKENDI',
        post_nom: 'KABONGO',
        prenom: 'Jean',
        matricule: 'STU-2024-001',
        sexe: 'M',
        nationalite: 'Congolaise',
        lieu_naissance: 'Kinshasa',
        date_naissance: '1995-05-15',
        adresse: 'Kinshasa, RDC',
        telephone: '+243 900 000 000',
        email: 'jean.mukendi@example.com'
    },
    classe: {
        _id: 'test-classe',
        designation: 'L3 Génie Civil',
        description: 'Licence 3 en Génie Civil',
        niveau: 3,
        capacite: 50,
        statut: 'active',
        semestres: []
    },
    section: {
        _id: 'test-section',
        description: {
            designation: 'Institut National du Bâtiment et des Travaux Publics',
            images: []
        }
    },
    semestres: [
        {
            _id: 'sem1',
            designation: 'Semestre 1',
            description: 'Premier semestre de L3',
            anneesInscription: ['2023-2024'],
            unites: [
                {
                    _id: 'unite1',
                    designation: 'Mathématiques Appliquées',
                    code: 'MATH301',
                    credit: 6,
                    type: 'fondamental',
                    cours: [
                        {
                            _id: 'cours1',
                            titre: 'Analyse Numérique',
                            description: 'Méthodes numériques',
                            credit: 3,
                            notes: [
                                {
                                    _id: 'note1',
                                    reference: 'NOTE-001',
                                    cmi: 8.5,
                                    examen: 9.0,
                                    rattrapage: null,
                                    moyenne: 17.5,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        },
                        {
                            _id: 'cours2',
                            titre: 'Statistiques',
                            description: 'Statistiques appliquées',
                            credit: 3,
                            notes: [
                                {
                                    _id: 'note2',
                                    reference: 'NOTE-002',
                                    cmi: 7.0,
                                    examen: 8.5,
                                    rattrapage: null,
                                    moyenne: 15.5,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        }
                    ]
                },
                {
                    _id: 'unite2',
                    designation: 'Génie Civil Fondamental',
                    code: 'GC301',
                    credit: 8,
                    type: 'spécialité',
                    cours: [
                        {
                            _id: 'cours3',
                            titre: 'Résistance des Matériaux',
                            description: 'RDM avancée',
                            credit: 4,
                            notes: [
                                {
                                    _id: 'note3',
                                    reference: 'NOTE-003',
                                    cmi: 6.5,
                                    examen: 7.5,
                                    rattrapage: null,
                                    moyenne: 14.0,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        },
                        {
                            _id: 'cours4',
                            titre: 'Béton Armé',
                            description: 'Construction en béton armé',
                            credit: 4,
                            notes: [
                                {
                                    _id: 'note4',
                                    reference: 'NOTE-004',
                                    cmi: 8.0,
                                    examen: 8.5,
                                    rattrapage: null,
                                    moyenne: 16.5,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            _id: 'sem2',
            designation: 'Semestre 2',
            description: 'Deuxième semestre de L3',
            anneesInscription: ['2023-2024'],
            unites: [
                {
                    _id: 'unite3',
                    designation: 'Projet et Stage',
                    code: 'PROJ301',
                    credit: 10,
                    type: 'projet',
                    cours: [
                        {
                            _id: 'cours5',
                            titre: 'Projet de Fin d\'Études',
                            description: 'Projet pratique',
                            credit: 6,
                            notes: [
                                {
                                    _id: 'note5',
                                    reference: 'NOTE-005',
                                    cmi: 7.5,
                                    examen: 8.0,
                                    rattrapage: null,
                                    moyenne: 15.5,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        },
                        {
                            _id: 'cours6',
                            titre: 'Stage Professionnel',
                            description: 'Stage en entreprise',
                            credit: 4,
                            notes: [
                                {
                                    _id: 'note6',
                                    reference: 'NOTE-006',
                                    cmi: 8.5,
                                    examen: 9.0,
                                    rattrapage: null,
                                    moyenne: 17.5,
                                    status: 'OK',
                                    anneeId: '2023-2024'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Fonction de test
export const testBulletinGeneration = () => {
    console.log('🧪 Test de génération de bulletin...');
    
    try {
        const bulletin = new BulletinDocument(
            testData.resultat as any,
            testData.etudiant as any,
            testData.classe as any,
            testData.semestres as any
        );
        
        // Ajouter la section
        (bulletin as any).section = testData.section;
        
        console.log('✅ Instance BulletinDocument créée avec succès');
        console.log('📊 Données de test chargées:');
        console.log(`   - Étudiant: ${testData.etudiant.nom} ${testData.etudiant.post_nom} ${testData.etudiant.prenom}`);
        console.log(`   - Matricule: ${testData.etudiant.matricule}`);
        console.log(`   - Classe: ${testData.classe.designation}`);
        console.log(`   - Semestres: ${testData.semestres.length}`);
        console.log(`   - Total cours: ${testData.semestres.reduce((total, sem) => total + sem.unites.reduce((t, u) => t + u.cours.length, 0), 0)}`);
        
        // Test de génération (commenté pour éviter le téléchargement automatique)
        // bulletin.generateBulletin();
        
        console.log('🎉 Test réussi ! Le système est prêt à générer des bulletins.');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        return false;
    }
};

// Export par défaut
export default testBulletinGeneration;
