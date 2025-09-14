import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configuration des polices
(pdfMake as any).vfs = pdfFonts.vfs;

interface Etudiant {
  _id?: string;
  matricule: string;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  nationalite: string;
  lieu_naissance: string;
  date_naissance: string | Date;
  photo?: File | string;
  documents?: File[] | string[];
}

interface Section {
  _id: string;
  description: {
    sigle: string;
    designation: string;
    devise: string;
    objectif: string;
    images?: string[];
  };
  contact: {
    addresse: string;
    telephone: string;
    email: string;
    www: string;
  };
}

export class PDFGeneratorPdfMake {
  
  async generateInscriptionPDF(etudiant: Etudiant, section?: Section): Promise<void> {
    console.log("Génération du PDF pour l'étudiant:", etudiant);
    const docDefinition : any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      
      content: [
        // En-tête
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'République Démocatique du Congo', style: 'subheader' },
                { text: "Ministère de l'Enseignement Supérieur et Universitaire", style: 'subheader' },
                { text: 'Institut National de Bâtiment et Travaux Publics', style: 'subheader' },
                { text: 'I.N.B.T.P', style: 'header' },
                { text: 'Kinshasa/Ngaliema', style: 'subheader' },
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: 'FICHE N°', style: 'invoiceNumber', alignment: 'right' },
                { text: etudiant.matricule, style: 'invoiceNumberValue', alignment: 'right' },
                { text: new Date().toLocaleDateString('fr-FR'), style: 'date', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Ligne de séparation
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 2,
              lineColor: '#1F40A5'
            }
          ],
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              width: '*',
              stack: [  
                // Informations étudiant
                {
                  text: 'CANDIDAT:',
                  style: 'sectionLabel'
                },
                {
                  text: `${ etudiant.sexe == "F" ? "Mm" : "Mr" } ${etudiant.nom} ${etudiant.post_nom} ${etudiant.prenom}`,
                  style: 'studentName',
                  margin: [0, 5, 0, 5]
                },
                {
                  text: `${etudiant.sexe === 'M' ? 'Masculin' : 'Féminin'} • ${etudiant.nationalite}`,
                  style: 'studentInfo',
                  margin: [0, 0, 0, 5]
                },
                {
                  text: `Né(e) le ${new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')} à ${etudiant.lieu_naissance}`,
                  style: 'studentInfo',
                  margin: [0, 0, 0, 30]
                }
              ]
            },
            // Qr code de etdudiant._id,
            {
              width: "auto",
              stack: [
                { text: `${section?.description.designation || 'Non définie'}`, alignment: 'center', margin: [0, 0, 0, 10] },
                {
                  qr: `https://server.inbtp.net/api/v1/etudiant/${etudiant._id ?? etudiant.matricule}/details`,
                  fit: 100,
                  alignment: 'center'
                },
                { text: 'Verifier le dossier', style: 'sectionLabel', alignment: 'center', margin: [0, 10, 0, 10] }
              ]
            }
            ]
          },
        
        // Tableau des détails
        {
          table: {
            headerRows: 1,
            widths: ['30%', '*'],
            body: [
              [
                { text: 'DÉTAIL', style: 'tableHeader' },
                { text: 'INFORMATION', style: 'tableHeader' }
              ],
              ['Matricule de connexion', { text: etudiant.matricule, style: 'tableValue' }],
              ['Année', { text: `${new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)}`, style: 'tableValue' }],
              ['Documents fournis', { text: `${etudiant.documents?.length || 0} fichier(s)`, style: 'tableValue' }],
              ['Photo fournie', { text: etudiant.photo ? 'Oui' : 'Non', style: 'tableValue' }],
              ['Statut', { text: '_______________________', style: 'tableValue' }]
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return (i === 0 || i === 1) ? 1 : 0;
            },
            vLineWidth: function (i: number, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return '#1F40A5';
            },
            paddingLeft: function (i: number, node: any) { return 0; },
            paddingRight: function (i: number, node: any) { return 10; },
            paddingTop: function (i: number, node: any) { return 8; },
            paddingBottom: function (i: number, node: any) { return 8; }
          },
          margin: [0, 0, 0, 40]
        },
        
        // Section validation
        {
          text: 'VALIDATION DE L\'INSCRIPTION',
          style: 'validationHeader',
          margin: [0, 0, 0, 10]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: '#1F40A5'
            }
          ],
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'Signature de l\'étudiant:', style: 'signatureLabel' },
                { text: '\n\n', margin: [0, 20, 0, 0] },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 120, y2: 0,
                      lineWidth: 1,
                      lineColor: '#CCCCCC'
                    }
                  ]
                },
                { text: 'Date: _______________', style: 'dateSignature', margin: [0, 10, 0, 0] }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'Cachet & Signature Administration:', style: 'signatureLabel', alignment: 'right' },
                { text: '\n\n', margin: [0, 20, 0, 0] },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 120, y1: 0,
                      x2: 240, y2: 0,
                      lineWidth: 1,
                      lineColor: '#CCCCCC'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#1F40A5'
        },
        subheader: {
          fontSize: 10,
          color: '#666666',
          margin: [0, 2, 0, 0],
        },
        invoiceNumber: {
          fontSize: 12,
          bold: true,
          color: '#666666'
        },
        invoiceNumberValue: {
          fontSize: 16,
          bold: true,
          color: '#1F40A5'
        },
        date: {
          fontSize: 10,
          color: '#666666'
        },
        sectionLabel: {
          fontSize: 11,
          bold: true,
          color: '#666666'
        },
        studentName: {
          fontSize: 14,
          bold: true,
          color: '#000000'
        },
        studentInfo: {
          fontSize: 10,
          color: '#666666'
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          color: '#1F40A5'
        },
        tableValue: {
          fontSize: 10,
          bold: true,
          color: '#000000'
        },
        validationHeader: {
          fontSize: 12,
          bold: true,
          color: '#1F40A5'
        },
        signatureLabel: {
          fontSize: 10,
          color: '#666666'
        },
        dateSignature: {
          fontSize: 9,
          color: '#999999'
        }
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`Inscription_${etudiant.matricule}.pdf`);
  }
}