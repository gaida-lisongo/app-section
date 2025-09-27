import { BulletinData, SemestreTableData } from '@/types/resultat';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configuration des polices
(pdfMake as any).vfs = pdfFonts.vfs;

export const generateBulletinPDF = async (bulletinData: BulletinData): Promise<void> => {
  try {
    // Définition du document PDF
    const docDefinition = {
      pageSize: 'A4' as const,
      pageMargins: [40, 60, 40, 60] as [number, number, number, number],
      
      // Styles
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center' as const,
          color: '#1e40af',
          margin: [0, 0, 0, 20] as [number, number, number, number]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          fillColor: '#1e40af'
        },
        tableCell: {
          fontSize: 9,
          margin: [2, 2, 2, 2] as [number, number, number, number]
        },
        small: {
          fontSize: 8,
          color: '#666666'
        },
        title: {
          fontSize: 22,
          bold: true,
          alignment: 'center' as const,
          color: '#1e40af',
          margin: [0, 0, 0, 30] as [number, number, number, number]
        }
      },
      
      // Contenu du document
      content: [
        // Page de garde
        ...generatePageDeGarde(bulletinData),
        
        // Saut de page
        { text: '', pageBreak: 'after' },
        
        // Pages par semestre
        ...bulletinData.semestres.flatMap((semestreData, index) => [
          ...generatePageSemestre(semestreData, bulletinData.etudiant, index + 1),
          ...(index < bulletinData.semestres.length - 1 ? [{ text: '', pageBreak: 'after' }] : [])
        ]),
        
        // Saut de page pour la synthèse
        { text: '', pageBreak: 'after' },
        
        // Page de synthèse
        ...generatePageSynthese(bulletinData)
      ],
      
      // En-tête et pied de page
      header: {
        margin: [40, 20, 40, 0] as [number, number, number, number],
        table: {
          widths: ['*', '*'],
          body: [[
            { text: 'UNIVERSITÉ TECHNOLOGIQUE', style: 'small', alignment: 'left' },
            { text: new Date().toLocaleDateString('fr-FR'), style: 'small', alignment: 'right' }
          ]]
        },
        layout: 'noBorders'
      },
      
      footer: (currentPage: number, pageCount: number) => {
        return {
          margin: [40, 0, 40, 20] as [number, number, number, number],
          table: {
            widths: ['*', '*'],
            body: [[
              { text: 'Document généré automatiquement', style: 'small', alignment: 'left' },
              { text: `Page ${currentPage} sur ${pageCount}`, style: 'small', alignment: 'right' }
            ]]
          },
          layout: 'noBorders'
        };
      }
    };
    
    // Génération et téléchargement du PDF
    const filename = `Bulletin_${bulletinData.etudiant.matricule}_${new Date().getFullYear()}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Impossible de générer le bulletin PDF');
  }
};

const generatePageDeGarde = (bulletinData: BulletinData): any[] => {
  const stats = bulletinData.statistiquesGlobales;
  
  return [
    // Titre principal
    {
      text: 'UNIVERSITÉ TECHNOLOGIQUE',
      style: 'title',
      margin: [0, 0, 0, 10]
    },
    {
      text: 'BULLETIN DE NOTES OFFICIEL',
      style: 'header',
      margin: [0, 0, 0, 30]
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
    
    // Informations étudiant
    {
      text: 'INFORMATIONS ÉTUDIANT',
      style: 'subheader',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    
    {
      table: {
        widths: ['30%', '70%'],
        body: [
          [{ text: 'Nom complet:', bold: true }, `${bulletinData.etudiant.prenom} ${bulletinData.etudiant.nom} ${bulletinData.etudiant.post_nom}`],
          [{ text: 'Matricule:', bold: true }, bulletinData.etudiant.matricule],
          [{ text: 'Date de génération:', bold: true }, bulletinData.dateGeneration]
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
    
    // Résumé académique
    {
      text: 'RÉSUMÉ ACADÉMIQUE',
      style: 'subheader',
      alignment: 'center',
      margin: [0, 20, 0, 20]
    },
    
    {
      columns: [
        {
          width: '25%',
          stack: [
            { text: (stats.moyenneGenerale || 0).toFixed(2), fontSize: 24, bold: true, color: '#1e40af', alignment: 'center' },
            { text: 'Moyenne Générale', fontSize: 10, alignment: 'center', color: '#666666' }
          ]
        },
        {
          width: '25%',
          stack: [
            { text: `${stats.pourcentageReussite?.toFixed(1) || 0}%`, fontSize: 24, bold: true, color: '#059669', alignment: 'center' },
            { text: 'Taux de Réussite', fontSize: 10, alignment: 'center', color: '#666666' }
          ]
        },
        {
          width: '25%',
          stack: [
            { text: stats.nombreCoursValides || 0, fontSize: 24, bold: true, color: '#7c3aed', alignment: 'center' },
            { text: 'Cours Validés', fontSize: 10, alignment: 'center', color: '#666666' }
          ]
        },
        {
          width: '25%',
          stack: [
            { text: `${stats.creditsValides || 0}/${stats.totalCredits || 0}`, fontSize: 24, bold: true, color: '#ea580c', alignment: 'center' },
            { text: 'Crédits', fontSize: 10, alignment: 'center', color: '#666666' }
          ]
        }
      ],
      margin: [0, 0, 0, 40]
    },
    
    // Note légale
    {
      text: 'Ce document est généré automatiquement et constitue un relevé officiel de notes.',
      style: 'small',
      alignment: 'center',
      margin: [0, 40, 0, 10]
    },
    {
      text: `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      style: 'small',
      alignment: 'center'
    }
  ];
};

const generatePageSemestre = (
  semestreData: SemestreTableData,
  etudiant: any,
  pageNumber: number
): any[] => {
  // Préparer les données du tableau
  const tableBody = [
    // En-têtes
    [
      { text: 'Cours', style: 'tableHeader' },
      { text: 'UE', style: 'tableHeader' },
      { text: 'CMI (/10)', style: 'tableHeader' },
      { text: 'Examen (/10)', style: 'tableHeader' },
      { text: 'Rattrapage (/20)', style: 'tableHeader' },
      { text: 'Moyenne (/20)', style: 'tableHeader' },
      { text: 'Crédit', style: 'tableHeader' },
      { text: 'Statut', style: 'tableHeader' }
    ],
    // Données
    ...semestreData.notes.map((note, index) => {
      const getStatusColor = (status: string) => {
        if (status === 'VALIDÉ') return '#059669';
        if (status === 'ÉCHEC') return '#dc2626';
        return '#d97706';
      };
      
      const getMoyenneColor = (moyenne: number) => {
        if (moyenne >= 16) return '#059669';
        if (moyenne >= 14) return '#0284c7';
        if (moyenne >= 12) return '#d97706';
        if (moyenne >= 10) return '#ea580c';
        return '#dc2626';
      };
      
      return [
        { text: note.cours.length > 30 ? note.cours.substring(0, 27) + '...' : note.cours, style: 'tableCell' },
        { text: note.unite.length > 25 ? note.unite.substring(0, 22) + '...' : note.unite, style: 'tableCell' },
        { text: note.cmi !== null ? note.cmi.toFixed(1) : '-', style: 'tableCell', alignment: 'center' },
        { text: note.examen !== null ? note.examen.toFixed(1) : '-', style: 'tableCell', alignment: 'center' },
        { text: note.rattrapage !== null ? note.rattrapage.toFixed(1) : '-', style: 'tableCell', alignment: 'center' },
        { text: note.moyenne.toFixed(2), style: 'tableCell', alignment: 'center', color: getMoyenneColor(note.moyenne), bold: true },
        { text: note.credit.toString(), style: 'tableCell', alignment: 'center' },
        { text: note.status, style: 'tableCell', alignment: 'center', color: getStatusColor(note.status), bold: true }
      ];
    })
  ];
  
  return [
    // Titre du semestre
    {
      text: semestreData.semestre.designation,
      style: 'subheader',
      color: '#1e40af',
      margin: [0, 0, 0, 5]
    },
    {
      text: `${etudiant.prenom} ${etudiant.nom} - ${etudiant.matricule}`,
      style: 'small',
      margin: [0, 0, 0, 20]
    },
    
    // Tableau des notes
    {
      table: {
        headerRows: 1,
        widths: ['25%', '20%', '8%', '8%', '10%', '10%', '7%', '12%'],
        body: tableBody
      },
      layout: {
        hLineWidth: (i: number) => i === 0 || i === 1 ? 2 : 1,
        vLineWidth: () => 1,
        hLineColor: (i: number) => i === 0 || i === 1 ? '#1e40af' : '#e5e7eb',
        vLineColor: () => '#e5e7eb',
        fillColor: (rowIndex: number) => {
          if (rowIndex === 0) return '#1e40af';
          return rowIndex % 2 === 0 ? '#f8fafc' : null;
        }
      },
      margin: [0, 0, 0, 20]
    },
    
    // Statistiques du semestre
    {
      text: 'Statistiques du semestre',
      style: 'subheader',
      margin: [0, 20, 0, 10]
    },
    {
      columns: [
        {
          width: '50%',
          stack: [
            { text: `Moyenne: ${(semestreData.statistiques.moyenneGenerale || 0).toFixed(2)}/20`, margin: [0, 0, 0, 5] },
            { text: `Nombre de cours: ${semestreData.notes.length}`, margin: [0, 0, 0, 5] }
          ]
        },
        {
          width: '50%',
          stack: [
            { text: `Crédits: ${semestreData.statistiques.creditsValides || 0}/${semestreData.statistiques.totalCredits || 0}`, margin: [0, 0, 0, 5] },
            { text: `Réussite: ${(semestreData.statistiques.pourcentageReussite || 0).toFixed(1)}%`, margin: [0, 0, 0, 5] }
          ]
        }
      ]
    }
  ];
};

const generatePageSynthese = (bulletinData: BulletinData): any[] => {
  const stats = bulletinData.statistiquesGlobales;
  const niveau = getNiveauAcademique(stats.moyenneGenerale || 0);
  
  return [
    // Titre
    {
      text: 'SYNTHÈSE ACADÉMIQUE',
      style: 'title',
      margin: [0, 0, 0, 30]
    },
    
    // Résumé par semestre
    {
      text: 'Résumé par semestre',
      style: 'subheader',
      margin: [0, 0, 0, 15]
    },
    
    ...bulletinData.semestres.map((semestreData, index) => ({
      table: {
        widths: ['5%', '35%', '15%', '15%', '15%', '15%'],
        body: [[
          { text: `${index + 1}.`, bold: true },
          { text: semestreData.semestre.designation, bold: true },
          { text: `${(semestreData.statistiques.moyenneGenerale || 0).toFixed(2)}/20`, alignment: 'center' },
          { text: `${semestreData.statistiques.creditsValides || 0}/${semestreData.statistiques.totalCredits || 0}`, alignment: 'center' },
          { text: `${(semestreData.statistiques.pourcentageReussite || 0).toFixed(1)}%`, alignment: 'center' },
          { text: `${semestreData.notes.length} cours`, alignment: 'center' }
        ]]
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => '#e5e7eb',
        vLineColor: () => '#e5e7eb'
      },
      margin: [0, 0, 0, 5]
    })),
    
    // Bilan global
    {
      text: 'Bilan global',
      style: 'subheader',
      margin: [0, 30, 0, 15]
    },
    
    {
      table: {
        widths: ['50%', '50%'],
        body: [
          [{ text: 'Moyenne générale:', bold: true }, `${(stats.moyenneGenerale || 0).toFixed(2)}/20`],
          [{ text: 'Niveau académique:', bold: true }, niveau],
          [{ text: 'Total des cours:', bold: true }, (stats.nombreCours || 0).toString()],
          [{ text: 'Cours validés:', bold: true }, (stats.nombreCoursValides || 0).toString()],
          [{ text: 'Cours échoués:', bold: true }, (stats.nombreCoursEchoues || 0).toString()],
          [{ text: 'Taux de réussite global:', bold: true }, `${(stats.pourcentageReussite || 0).toFixed(1)}%`],
          [{ text: 'Crédits validés:', bold: true }, `${stats.creditsValides || 0}/${stats.totalCredits || 0}`]
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
    
    // Signatures
    {
      text: `Fait à Kinshasa, le ${bulletinData.dateGeneration}`,
      margin: [0, 40, 0, 30]
    },
    
    {
      columns: [
        {
          width: '50%',
          stack: [
            { text: 'Le Secrétaire Académique', margin: [0, 0, 0, 40] },
            { text: '________________________', alignment: 'center' },
            { text: 'Signature et cachet', alignment: 'center', style: 'small' }
          ]
        },
        {
          width: '50%',
          stack: [
            { text: 'Le Directeur des Études', margin: [0, 0, 0, 40] },
            { text: '________________________', alignment: 'center' },
            { text: 'Signature et cachet', alignment: 'center', style: 'small' }
          ]
        }
      ]
    }
  ];
};

const getNiveauAcademique = (moyenne: number): string => {
  if (moyenne >= 16) return 'Excellent';
  if (moyenne >= 14) return 'Très Bien';
  if (moyenne >= 12) return 'Bien';
  if (moyenne >= 10) return 'Passable';
  return 'Insuffisant';
};
