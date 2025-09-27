import { Resultat } from '@/app/services/CommandeService';
import { Classe } from '@/app/services/CycleService';
import { Etudiant } from '@/types/etudiant';
import { SemestreResultat, UniteResultat } from '@/types/resultat';
import { Section } from '@/types/section';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configuration des polices
(pdfMake as any).vfs = pdfFonts.vfs;

class BulletinDocument {
    private section : Section;
    private resultat: Resultat;
    private etudiant: Etudiant;
    private classe: Classe;
    private semestres: SemestreResultat[];
    private metriques: {
        semestre: string;
        credit: number;
        moyenne: number;
        status: string;
    }[];
    private logo: string;

    constructor(resultat: Resultat, etudiant: Etudiant, classe: Classe, semestres: SemestreResultat[], section?: Section) {
        this.resultat = resultat;
        this.etudiant = etudiant;
        this.classe = classe;
        this.semestres = semestres;
        this.section = section || {} as Section;
        this.metriques = [];
        this.logo = '';
        this.init();
    }

    async init() {
        try {
            // Convertir l'image en data:image/png;base64,
            const logoUrl = this.section?.description?.images?.[0];
            
            if (logoUrl) {
                const response = await fetch(logoUrl);
                if (response.ok) {
                    const logoBlob = await response.blob();
                    const logoBase64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(logoBlob);
                    });

                    console.log("Logo base64: ", logoBase64);
                    this.logo = logoBase64;
                } else {
                    console.warn('Impossible de charger le logo:', logoUrl);
                    this.logo = '';
                }
            } else {
                console.warn('Aucune URL de logo trouvée dans la section');
                this.logo = '';
            }
        } catch (error) {
            console.error('Erreur lors du chargement du logo:', error);
            this.logo = '';
        }
        
        // Réinitialiser les métriques
        this.metriques = [];
    }

    async generateBulletin() {
        try {
            // Initialiser les métriques et charger le logo
            await this.init();

            const docDefinition: any = {
                pageSize: 'A4' as const,
                pageMargins: [40, 60, 40, 60] as [number, number, number, number],

                // Styles cohérents et modernes
                styles: {
                    // Titres principaux
                    mainTitle: {
                        fontSize: 26,
                        bold: true,
                        color: '#1e40af',
                        alignment: 'center' as const,
                        margin: [0, 0, 0, 15] as [number, number, number, number]
                    },
                    pageTitle: {
                        fontSize: 18,
                        bold: true,
                        color: '#1e40af',
                        alignment: 'center' as const,
                        margin: [0, 0, 0, 10] as [number, number, number, number]
                    },
                    sectionTitle: {
                        fontSize: 14,
                        bold: true,
                        color: '#374151',
                        alignment: 'center' as const,
                        margin: [0, 10, 0, 10] as [number, number, number, number]
                    },
                    
                    // Textes institutionnels
                    institution: {
                        fontSize: 16,
                        bold: true,
                        color: '#1e40af',
                        alignment: 'center' as const
                    },
                    ministry: {
                        fontSize: 10,
                        color: '#6b7280',
                        alignment: 'center' as const,
                        margin: [0, 0, 0, 3] as [number, number, number, number]
                    },
                    
                    // Informations étudiant
                    studentLabel: {
                        fontSize: 9,
                        color: '#6b7280',
                        bold: true,
                        alignment: 'center' as const
                    },
                    studentInfo: {
                        fontSize: 11,
                        color: '#374151',
                        bold: true,
                        alignment: 'center' as const
                    },
                    
                    // En-têtes et pieds de page
                    headerText: {
                        fontSize: 8,
                        color: '#6b7280',
                        italics: true
                    },
                    footerText: {
                        fontSize: 7,
                        color: '#9ca3af'
                    },
                    
                    // Tableaux
                    tableMainHeader: {
                        fontSize: 12,
                        bold: true,
                        color: 'white',
                        alignment: 'center' as const
                    },
                    tableSubHeader: {
                        fontSize: 9,
                        bold: true,
                        color: 'white',
                        alignment: 'center' as const
                    },
                    tableCell: {
                        fontSize: 8,
                        color: '#374151'
                    },
                    tableCellBold: {
                        fontSize: 8,
                        color: '#374151',
                        // bold: true
                    },
                    
                    // Textes généraux
                    normal: {
                        fontSize: 10,
                        color: '#374151'
                    },
                    small: {
                        fontSize: 8,
                        color: '#6b7280'
                    },
                    legal: {
                        fontSize: 8,
                        color: '#6b7280',
                        alignment: 'justify' as const,
                        italics: true
                    }
                },

                // Images en base64
                images: this.logo ? {
                    logo: this.logo
                } : {},

                //Contenu
                content: [
                    //Page de garde
                    ...this.generatePageDeGarde(),

                    //Saut de page
                    { text: '', pageBreak: 'after' },

                    //Pages par semestre
                    ...this.semestres.map((semestre, index) => [
                        ...this.generatePage(this.generatePageSemestre(semestre, index + 1)),
                        ...(index < this.semestres.length - 1 ? [{ text: '', pageBreak: 'after' }] : [])
                    ]),

                    //Saut de page
                    { text: '', pageBreak: 'after' },

                    //Page de synthèse
                    ...this.generatePageSynthese(),
                    
                ],

                //En-tête moderne
                header: (currentPage: number, pageCount: number) => {
                    if (currentPage === 1) return null; // Pas d'en-tête sur la page de garde
                    
                    return {
                        margin: [40, 15, 40, 10] as [number, number, number, number],
                        stack: [
                            // Ligne supérieure avec logo/institution
                            {
                                columns: [
                                    // Logo ou nom institution
                                    // ...(this.logo ? [{
                                    //     width: 60,
                                    //     stack: [{
                                    //         image: 'logo',
                                    //         width: 40,
                                    //         height: 40,
                                    //         alignment: 'left'
                                    //     }]
                                    // }] : [{
                                    //     width: 60,
                                    //     text: 'I.N.B.T.P',
                                    //     style: 'pageHeader',
                                    //     bold: true,
                                    //     color: '#1e40af'
                                    // }]),
                                    // Informations centrales
                                    {
                                        width: '50%',
                                        stack: [
                                            {
                                                text: 'CARNET DE NOTES',
                                                style: 'pageHeader',
                                                alignment: 'center',
                                                bold: true,
                                                color: '#1e40af'
                                            },
                                            
                                        ]
                                    },
                                    // Date et page
                                    {
                                        width: '50%',
                                        stack: [
                                            {
                                                text: `${this.etudiant?.nom || ''} ${this.etudiant?.post_nom || ''} ${this.etudiant?.prenom || ''}`,
                                                style: 'pageHeader',
                                                alignment: 'center',
                                                margin: [0, 2, 0, 0]
                                            }
                                            // {
                                            //     text: new Date().toLocaleDateString('fr-FR'),
                                            //     style: 'pageHeader',
                                            //     alignment: 'right'
                                            // },
                                            // {
                                            //     text: `Page ${currentPage}/${pageCount}`,
                                            //     style: 'pageHeader',
                                            //     alignment: 'right',
                                            //     margin: [0, 2, 0, 0]
                                            // }
                                        ]
                                    }
                                ]
                            },
                            // Ligne de séparation élégante
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0, y1: 8,
                                    x2: 515, y2: 8,
                                    lineWidth: 1,
                                    lineColor: '#e5e7eb'
                                }]
                            }
                        ]
                    };
                },

                //Pied de page moderne
                footer: (currentPage: number, pageCount: number) => {
                    return {
                        margin: [40, 10, 40, 15] as [number, number, number, number],
                        stack: [
                            // Ligne de séparation
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0, y1: 0,
                                    x2: 515, y2: 0,
                                    lineWidth: 0.5,
                                    lineColor: '#e5e7eb'
                                }],
                                margin: [0, 0, 0, 8]
                            },
                            // Contenu du footer
                            {
                                columns: [
                                    {
                                        width: '*',
                                        text: 'Institut National du Bâtiment et des Travaux Publics',
                                        style: 'watermark',
                                        alignment: 'left'
                                    },
                                    {
                                        width: 100,
                                        text: `${currentPage} / ${pageCount}`,
                                        style: 'watermark',
                                        alignment: 'right',
                                        bold: true
                                    }
                                ]
                            }
                        ]
                    };
                }
                
            };

            const filename = `Bulletin_${this.etudiant.matricule}_${new Date().getFullYear()}.pdf`;
            pdfMake.createPdf(docDefinition).download(filename);
            
        } catch (error) {
            console.error("Erreur lors de la génération du bulletin:", error);
            throw error;
        }
        
    }

    generatePageDeGarde(){
        return [
            // En-tête institutionnel propre
            {
                stack: [
                    {
                        text: 'RÉPUBLIQUE DÉMOCRATIQUE DU CONGO',
                        style: 'ministry'
                    },
                    {
                        text: 'Ministère de l\'Enseignement Supérieur, Universitaire, Recherche Scientifique et Innovation',
                        style: 'ministry'
                    },
                    {
                        text: 'INSTITUT NATIONAL DU BÂTIMENT ET DES TRAVAUX PUBLICS',
                        style: 'institution',
                        margin: [0, 0, 0, 5]
                    },
                    {
                        text: '"I.N.B.T.P / KINSHASA"',
                        style: 'institution',
                        fontSize: 14,
                        italics: true,
                        margin: [0, 0, 0, 0]
                    }
                ]
            },

            // Ligne de séparation
            {
                canvas: [{
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 515, y2: 0,
                    lineWidth: 2,
                    lineColor: '#1e40af'
                }],
                margin: [0, 0, 0, 30]
            },

            // Titre principal
            {
                text: 'BULLETIN DE NOTES OFFICIEL',
                style: 'mainTitle'
            },
            {
                text: 'Carnet des Résultats Académiques',
                style: 'sectionTitle',
                color: '#6b7280',
                margin: [0, 0, 0, 40]
            },


            // Logo centré si disponible
            ...(this.logo ? [{
                image: 'logo',
                width: 80,
                height: 80,
                alignment: 'center',
                margin: [0, 10, 0, 20]
            }] : []),
            // Informations étudiant - Design propre
            {
                table: {
                    widths: ['30%', '70%'],
                    body: [
                        [
                            { text: 'INFORMATIONS ÉTUDIANT', style: 'tableMainHeader', colSpan: 2, fillColor: '#1e40af', margin: [0, 10, 0, 10] },
                            {}
                        ],
                        [
                            { text: 'Nom complet :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: `${this.etudiant?.prenom || ''} ${this.etudiant?.nom || ''} ${this.etudiant?.post_nom || ''}`, style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Matricule :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.etudiant?.matricule || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Classe :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.classe?.designation || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Section :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.section?.description?.designation || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                },
                margin: [0, 0, 0, 30]
            },

            // Informations de génération
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Date de génération', style: 'studentLabel', fillColor: '#f1f5f9', margin: [0, 8, 0, 3] },
                            { text: 'Année académique', style: 'studentLabel', fillColor: '#f1f5f9', margin: [0, 8, 0, 3] }
                        ],
                        [
                            { text: new Date().toLocaleDateString('fr-FR'), style: 'studentInfo', margin: [0, 3, 0, 8] },
                            { text: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`, style: 'studentInfo', margin: [0, 3, 0, 8] }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                },
                margin: [0, 0, 0, 50]
            },

            // Note légale
            {
                text: 'DOCUMENT OFFICIEL',
                style: 'sectionTitle',
                color: '#dc2626',
                margin: [0, 0, 0, 0]
            },
            {
                text: 'Ce bulletin de notes constitue un document officiel de l\'Institut National du Bâtiment et des Travaux Publics. Toute falsification ou reproduction non autorisée est passible de sanctions légales.',
                style: 'legal',
                margin: [0, 0, 0, 0]
            },
            {
                text: `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
                style: 'small',
                alignment: 'center'
            }
        ]
    }

    generatePageSemestre(semestre: SemestreResultat, pageNumber: number){
        const {
            designation,
            description,
            anneesInscription,
            _id,
            unites
        } = semestre;
        
        // Calculer les métriques du semestre
        const semestreMetrics = this.calculateSemestreMetrics(unites || [], designation || `Semestre ${pageNumber}`);
        
        // Ajouter aux métriques globales
        this.metriques.push(semestreMetrics);
        
        return [
            // Titre du semestre
            {
                text: designation || `Semestre ${pageNumber}`,
                style: 'pageTitle',
                margin: [0, 0, 0, 20]
            },

            // Description si disponible
            // ...(description ? [{
            //     text: description,
            //     style: 'normal',
            //     alignment: 'center',
            //     italics: true,
            //     margin: [0, 0, 0, 15] as [number, number, number, number]
            // }] : []),

            // Informations contextuelles
            // {
            //     table: {
            //         widths: ['33%', '34%', '33%'],
            //         body: [[
            //             { text: 'Étudiant', style: 'studentLabel', fillColor: '#f8fafc' },
            //             { text: 'Classe', style: 'studentLabel', fillColor: '#f8fafc' },
            //             { text: 'Matricule', style: 'studentLabel', fillColor: '#f8fafc' }
            //         ], [
            //             { text: `${this.etudiant?.prenom || ''} ${this.etudiant?.nom || ''}`, style: 'studentInfo' },
            //             { text: this.classe?.designation || 'N/A', style: 'studentInfo' },
            //             { text: this.etudiant?.matricule || 'N/A', style: 'studentInfo' }
            //         ]]
            //     },
            //     layout: {
            //         hLineWidth: () => 1,
            //         vLineWidth: () => 1,
            //         hLineColor: () => '#e5e7eb',
            //         vLineColor: () => '#e5e7eb'
            //     },
            //     margin: [0, 0, 0, 20]
            // },

            // Années d'inscription si disponibles
            // ...(anneesInscription && anneesInscription.length > 0 ? [{
            //     text: `Période: ${anneesInscription.join(', ')}`,
            //     style: 'small',
            //     alignment: 'center',
            //     margin: [0, 0, 0, 20] as [number, number, number, number]
            // }] : []),
            
            // Tableau des résultats
            ...this.calculateUnites(unites || []),

            // Résumé du semestre
            // {
            //     table: {
            //         widths: ['25%', '25%', '25%', '25%'],
            //         body: [[
            //             { text: 'RÉSUMÉ DU SEMESTRE', style: 'tableMainHeader', colSpan: 4, fillColor: '#1e40af'},
            //             {}, {}, {}
            //         ], [
            //             { text: 'Crédits totaux', style: 'studentLabel', fillColor: '#f8fafc', margin: [0, 8, 0, 3] },
            //             { text: 'Moyenne générale', style: 'studentLabel', fillColor: '#f8fafc', margin: [0, 8, 0, 3] },
            //             { text: 'Mention', style: 'studentLabel', fillColor: '#f8fafc', margin: [0, 8, 0, 3] },
            //             { text: 'Statut', style: 'studentLabel', fillColor: '#f8fafc', margin: [0, 8, 0, 3] }
            //         ], [
            //             { text: semestreMetrics.credit.toString(), style: 'tableCellBold', alignment: 'center', margin: [0, 3, 0, 8] },
            //             { 
            //                 text: `${semestreMetrics.moyenne.toFixed(2)}/20`, 
            //                 style: 'tableCellBold', 
            //                 color: semestreMetrics.moyenne >= 10 ? '#059669' : '#dc2626',
            //                 alignment: 'center',
            //                 margin: [0, 3, 0, 8]
            //             },
            //             { text: this.calculateMention(semestreMetrics.moyenne), style: 'tableCellBold', alignment: 'center', margin: [0, 3, 0, 8] },
            //             { 
            //                 text: semestreMetrics.status, 
            //                 style: 'tableCellBold', 
            //                 color: semestreMetrics.status === 'VALIDÉ' ? '#059669' : '#dc2626',
            //                 alignment: 'center',
            //                 margin: [0, 3, 0, 8]
            //             }
            //         ]]
            //     },
            //     layout: {
            //         hLineWidth: () => 1,
            //         vLineWidth: () => 1,
            //         hLineColor: () => '#e5e7eb',
            //         vLineColor: () => '#e5e7eb'
            //     },
            //     margin: [0, 20, 0, 0]
            // }
        ]
    }

    calculateSemestreMetrics(unites: UniteResultat[], semestre: string): {semestre: string, credit: number, moyenne: number, status: string} {
        let totalCredits = 0;
        let moyenneSemestrePonderee = 0;

        unites.forEach((unite) => {
            const { credit: creditUnite, cours } = unite;
            let moyenneUnite = 0;
            let totalCreditsUnite = 0;

            cours.forEach((coursItem) => {
                const { credit, notes } = coursItem;
                
                if (notes && notes.length > 0) {
                    const bestNote = notes.reduce((a, b) => (a.moyenne || 0) > (b.moyenne || 0) ? a : b);
                    totalCreditsUnite += credit;
                    moyenneUnite += (bestNote.moyenne || 0) * credit;
                }
            });

            if (totalCreditsUnite > 0) {
                moyenneUnite = moyenneUnite / totalCreditsUnite;
            }

            totalCredits += creditUnite;
            moyenneSemestrePonderee += moyenneUnite * creditUnite;
        });

        const moyenneSemestre = totalCredits > 0 ? moyenneSemestrePonderee / totalCredits : 0;

        return {
            semestre,
            credit: totalCredits,
            moyenne: moyenneSemestre,
            status: moyenneSemestre >= 10 ? 'VALIDÉ' : 'NON VALIDÉ'
        };
    }

    calculateUnites(unites: UniteResultat[]): any[]{
        let tableRows: any[] = [];
        let rowNumber = 0;

        // Fonction pour obtenir la couleur selon la note
        const getNoteColor = (note: number) => {
            if (note >= 16) return '#059669'; // Vert - Excellent
            if (note >= 14) return '#0284c7'; // Bleu - Très bien
            if (note >= 12) return '#d97706'; // Orange - Bien
            if (note >= 10) return '#ea580c'; // Orange foncé - Passable
            return '#dc2626'; // Rouge - Insuffisant
        };

        unites.forEach((unite, uniteIndex) => {
            const {
                designation,
                credit: creditUnite,
                code,
                cours
            } = unite;
            
            let moyenneUnite = 0;
            let totalCreditsUnite = 0;

            // En-tête de l'unité d'enseignement
            tableRows.push([
                {
                    colSpan: 8,
                    text: `${designation} (${code}) - ${creditUnite} crédits`,
                    style: 'studentLabel',
                    fillColor: '#f8fafc',
                },
                {}, {}, {}, {}, {}, {}, {}
            ]);

            // Traiter chaque cours de l'unité
            cours.forEach((coursItem, coursIndex) => {
                const {
                    titre,
                    credit,
                    notes
                } = coursItem;
                
                // Trouver la meilleure note
                if (notes && notes.length > 0) {
                    const bestNote = notes.reduce((a, b) => (a.moyenne || 0) > (b.moyenne || 0) ? a : b);
                    
                    rowNumber++;
                    totalCreditsUnite += credit;
                    moyenneUnite += (bestNote.moyenne || 0) * credit;
                    
                    const moyenne = bestNote.moyenne || 0;
                    
                    tableRows.push([
                        { text: rowNumber.toString(), alignment: 'center', style: 'studentLabel' },
                        { text: titre, style: 'studentLabel' },
                        { text: bestNote.cmi ? bestNote.cmi.toFixed(1) : '-', alignment: 'center', style: 'studentLabel' },
                        { text: bestNote.examen ? bestNote.examen.toFixed(1) : '-', alignment: 'center', style: 'studentLabel' },
                        { text: bestNote.rattrapage ? bestNote.rattrapage.toFixed(1) : '-', alignment: 'center', style: 'studentLabel' },
                        { text: credit.toString(), alignment: 'center', style: 'studentLabel' },
                        { text: moyenne.toFixed(2), alignment: 'center', style: 'studentLabel' },
                        { text: this.calculateMention(moyenne), alignment: 'center', style: 'studentLabel' }
                    ]);
                }
            });

            // Calculer la moyenne de l'unité
            if (totalCreditsUnite > 0) {
                moyenneUnite = moyenneUnite / totalCreditsUnite;
            }

            // Ligne de moyenne de l'unité
            tableRows.push([
                {
                    colSpan: 5,
                    text: `Moyenne ${designation}`,
                    alignment: 'right',
                    style: 'studentLabel',
                    fillColor: '#f1f5f9',
                    margin: [0, 4, 8, 4]
                },
                {}, {}, {}, {}, {
                    text: `${unite.credit}`,
                    alignment: 'center',
                    style: 'studentLabel',
                    fillColor: '#f1f5f9',
                    // margin: [0, 4, 0, 4]
                },
                {
                    text: moyenneUnite.toFixed(2),
                    alignment: 'center',
                    style: 'studentLabel',
                    fillColor: '#f1f5f9',
                    margin: [0, 4, 0, 4]
                },
                {
                    text: moyenneUnite >= 10 ? 'V' : 'NV',
                    alignment: 'center',
                    style: 'studentLabel',
                    color: moyenneUnite >= 10 ? '#059669' : '#dc2626',
                    margin: [0, 4, 0, 4]
                }
            ]);

            // Espacement entre les unités
            // if (uniteIndex < unites.length - 1) {
            //     tableRows.push([
            //         { colSpan: 8, text: '' },
            //         {}, {}, {}, {}, {}, {}, {}
            //     ]);
            // }
        });

        // Retourner le tableau propre et moderne
        return [
            {
                table: {
                    widths: [25, '*', 35, 35, 35, 35, 45, 55],
                    body: [
                        // En-tête principal
                        [
                            {
                                colSpan: 8,
                                text: 'DÉTAIL DES RÉSULTATS PAR UNITÉ D\'ENSEIGNEMENT',
                                style: 'tableMainHeader',
                                fillColor: '#1e40af',
                            },
                            {}, {}, {}, {}, {}, {}, {}
                        ],
                        // En-têtes des colonnes
                        [
                            { text: 'N°', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'MATIÈRE', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'CMI', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'EXAM', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'RAT', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'CRÉD.', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'TOTAL', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] },
                            { text: 'MENTION', style: 'studentLabel', fillColor: '#f8fafc', margin: [2, 4, 2, 4] }
                        ],
                        ...tableRows
                    ]
                }
            }
        ];
    }

    calculateMention(moyenne: number){
        if(moyenne >= 18){
            return 'A';
        }else if(moyenne >= 16){
            return 'B';
        }else if(moyenne >= 14){
            return 'C';
        }else if(moyenne >= 12){
            return 'D';
        }else if(moyenne >= 10){
            return 'E';
        }else{
            return 'F';
        }
    }

    generatePageSynthese(){
        // Calculer les totaux généraux
        const totalCredits = this.metriques.reduce((sum, m) => sum + m.credit, 0);
        const moyenneGenerale = this.metriques.length > 0 
            ? this.metriques.reduce((sum, m) => sum + (m.moyenne * m.credit), 0) / totalCredits 
            : 0;
        const creditsValides = this.metriques.filter(m => m.status === 'VALIDÉ').reduce((sum, m) => sum + m.credit, 0);
        const creditsNonValides = totalCredits - creditsValides;

        return [
            // Titre de la synthèse
            {
                text: 'SYNTHÈSE ACADÉMIQUE',
                style: 'pageTitle',
                margin: [0, 0, 0, 30]
            },

            // Informations générales
            {
                table: {
                    widths: ['30%', '70%'],
                    body: [
                        [
                            { text: 'INFORMATIONS GÉNÉRALES', style: 'tableMainHeader', colSpan: 2, fillColor: '#1e40af', margin: [0, 10, 0, 10] },
                            {}
                        ],
                        [
                            { text: 'Étudiant :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: `${this.etudiant?.prenom || ''} ${this.etudiant?.nom || ''} ${this.etudiant?.post_nom || ''}`, style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Matricule :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.etudiant?.matricule || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Classe :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.classe?.designation || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ],
                        [
                            { text: 'Section :', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 8] },
                            { text: this.section?.description?.designation || 'N/A', style: 'studentInfo', margin: [10, 8, 0, 8] }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                },
                margin: [0, 0, 0, 25]
            },

            // Tableau des résultats par semestre
            {
                table: {
                    widths: [30, '*', 60, 60, 80],
                    body: [
                        [
                            { text: 'RÉSULTATS PAR SEMESTRE', style: 'tableMainHeader', colSpan: 5, fillColor: '#1e40af', margin: [0, 10, 0, 10] },
                            {}, {}, {}, {}
                        ],
                        [
                            { text: 'N°', style: 'studentLabel', fillColor: '#f8fafc', margin: [4, 4, 4, 4] },
                            { text: 'SEMESTRE', style: 'studentLabel', fillColor: '#f8fafc', margin: [4, 4, 4, 4] },
                            { text: 'CRÉDITS', style: 'studentLabel', fillColor: '#f8fafc', margin: [4, 4, 4, 4] },
                            { text: 'MOYENNE', style: 'studentLabel', fillColor: '#f8fafc', margin: [4, 4, 4, 4] },
                            { text: 'STATUT', style: 'studentLabel', fillColor: '#f8fafc', margin: [4, 4, 4, 4] }
                        ],
                        ...this.metriques.map((metrique, index) => [
                            { text: (index + 1).toString(), style: 'studentInfo', alignment: 'center' },
                            { text: metrique.semestre, style: 'studentInfo' },
                            { text: metrique.credit.toString(), style: 'studentInfo', alignment: 'center' },
                            { text: metrique.moyenne.toFixed(2), style: 'studentInfo', alignment: 'center' },
                            { text: metrique.status, style: 'studentInfo', alignment: 'center' }
                        ])
                    ]
                },
                layout: {
                    hLineWidth: (i: number) => i <= 2 ? 1 : 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: (i: number) => i <= 2 ? '#1e40af' : '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                },
                margin: [0, 0, 0, 25]
            },

            // Résumé général
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'BILAN GÉNÉRAL', style: 'tableMainHeader', colSpan: 2, fillColor: '#1e40af', margin: [0, 10, 0, 10] },
                            {}
                        ],
                        [
                            { text: 'Total crédits', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] },
                            { text: 'Crédits validés', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] }
                        ],
                        [
                            { text: totalCredits.toString(), style: 'studentInfo', margin: [10, 3, 0, 8] },
                            { text: creditsValides.toString(), style: 'studentInfo', margin: [10, 3, 0, 8] }
                        ],
                        [
                            { text: 'Crédits non validés', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] },
                            { text: 'Moyenne générale', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] }
                        ],
                        [
                            { text: creditsNonValides.toString(), style: 'studentInfo', margin: [10, 3, 0, 8] },
                            { text: `${moyenneGenerale.toFixed(2)}/20`, style: 'studentInfo', margin: [10, 3, 0, 8] }
                        ],
                        [
                            { text: 'Mention obtenue', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] },
                            { text: 'Décision finale', style: 'studentLabel', fillColor: '#f8fafc', margin: [10, 8, 0, 3] }
                        ],
                        [
                            { text: this.calculateMention(moyenneGenerale), style: 'studentInfo', margin: [10, 3, 0, 8] },
                            { text: moyenneGenerale >= 10 ? 'ADMIS(E)' : 'AJOURNÉ(E)', style: 'studentInfo', margin: [10, 3, 0, 8] }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                },
                margin: [0, 0, 0, 40]
            },

            // Signature et date
            {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 200,
                        stack: [
                            {
                                text: `Fait à Kinshasa, le ${new Date().toLocaleDateString('fr-FR')}`,
                                style: 'normal',
                                alignment: 'center',
                                margin: [0, 0, 0, 15]
                            },
                            {
                                text: 'Le Directeur des Études',
                                style: 'sectionTitle',
                                margin: [0, 0, 0, 30]
                            },
                            {
                                text: '________________________',
                                style: 'normal',
                                alignment: 'center',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: 'Signature et cachet',
                                style: 'small',
                                alignment: 'center'
                            }
                        ]
                    }
                ]
            }
        ]
    }

    generatePage(content: any[]){
        return content;
    }
    // Méthode statique pour créer et générer un bulletin facilement
    static async createAndGenerate(
        resultat: Resultat, 
        etudiant: Etudiant, 
        classe: Classe, 
        semestres: SemestreResultat[], 
        section?: Section
    ): Promise<void> {
        const bulletin = new BulletinDocument(resultat, etudiant, classe, semestres, section);
        await bulletin.generateBulletin();
    }
}

export default BulletinDocument;

// Fonction utilitaire pour générer un bulletin PDF avec logo
export const generateBulletinWithLogo = async (
    resultat: Resultat, 
    etudiant: Etudiant, 
    classe: Classe, 
    semestres: SemestreResultat[], 
    section?: Section
): Promise<void> => {
    try {
        await BulletinDocument.createAndGenerate(resultat, etudiant, classe, semestres, section);
    } catch (error) {
        console.error('Erreur lors de la génération du bulletin avec logo:', error);
        throw new Error('Impossible de générer le bulletin PDF');
    }
};
