import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configuration des polices
(pdfMake as any).vfs = pdfFonts.vfs;

// Configuration des polices avec Google Fonts URLs
// Utiliser une assertion de type pour contourner la propriété en lecture seule
// (pdfMake as any).fonts = {
//   Roboto: {
//     normal: '../utils/fonts/Roboto-Regular.ttf',
//     bold: '../utils/fonts/Roboto-Bold.ttf',
//     italics: '../utils/fonts/Roboto-Italic.ttf',
//     bolditalics: '../utils/fonts/Roboto-BoldItalic.ttf'
//   },
//   // Utiliser Helvetica comme police de fallback (disponible par défaut)
//   Helvetica: {
//     normal: 'Helvetica',
//     bold: 'Helvetica-Bold',
//     italics: 'Helvetica-Oblique',
//     bolditalics: 'Helvetica-BoldOblique'
//   }
// };

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
      // defaultStyle: {
      //   font: 'Roboto'
      // },
      
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
              stack: etudiant?.photo ? {
                image: 'profile'
              } : [
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

      images: {
        profile: `${etudiant?.photo && ''}`
      },
      
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

  async generateInvoicePdf(paymentData: any, items: any[], studentInfo: any): Promise<void> {
    console.log("Génération de la facture pour le paiement:", paymentData);
    
    const currentDate = new Date();
    const qrCodeUrl = `http://localhost:4001/payment/${paymentData.reference}`;
    
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      // defaultStyle: {
      //   font: 'Roboto'
      // },
      
      content: [
        // En-tête avec logo et informations de l'institution
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'FACTURE DE PAIEMENT', style: 'invoiceTitle' },
                { text: 'Institut National de Bâtiment et Travaux Publics', style: 'institutionName' },
                { text: 'I.N.B.T.P - Kinshasa/Ngaliema', style: 'institutionSubtitle' },
                { text: 'République Démocratique du Congo', style: 'country' }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: 'FACTURE N°', style: 'invoiceNumberLabel', alignment: 'right' },
                { text: studentInfo.reference, style: 'invoiceNumber', alignment: 'right' },
                { text: currentDate.toLocaleDateString('fr-FR'), style: 'invoiceDate', alignment: 'right' },
                { text: `Statut: ${paymentData.status}`, style: 'paymentStatus', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Ligne de séparation principale
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 3,
              lineColor: '#1F40A5'
            }
          ],
          margin: [0, 0, 0, 25]
        },
        
        // Informations client et QR code
        {
          columns: [
            {
              width: '65%',
              stack: [
                { text: 'INFORMATIONS CLIENT', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['30%', '*'],
                    body: [
                      [
                        { text: 'Matricule:', style: 'labelStyle' },
                        { text: paymentData.matricule, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Nom:', style: 'labelStyle' },
                        { text: studentInfo?.nom || 'N/A', style: 'valueStyle' }
                      ],
                      [
                        { text: 'Téléphone:', style: 'labelStyle' },
                        { text: paymentData.telephone, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Devise:', style: 'labelStyle' },
                        { text: paymentData.currency, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Email:', style: 'labelStyle' },
                        { text: studentInfo?.email || 'N/A', style: 'valueStyle' }
                      ]
                    ]
                  },
                  layout: 'noBorders',
                  margin: [0, 10, 0, 0]
                }
              ]
            },
            {
              width: '35%',
              stack: [
                { text: 'VÉRIFICATION', style: 'sectionTitle', alignment: 'center' },
                {
                  qr: qrCodeUrl,
                  fit: 120,
                  alignment: 'center',
                  margin: [0, 10, 0, 10]
                },
                { 
                  text: 'Scannez pour vérifier le paiement', 
                  style: 'qrDescription', 
                  alignment: 'center' 
                }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Détails des produits
        { text: 'DÉTAIL DES PRODUITS', style: 'sectionTitle', margin: [0, 0, 0, 15] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '15%', '20%', '20%'],
            body: [
              [
                { text: 'PRODUIT', style: 'tableHeader' },
                { text: 'QTÉ', style: 'tableHeader', alignment: 'center' },
                { text: 'PRIX UNIT.', style: 'tableHeader', alignment: 'right' },
                { text: 'TOTAL', style: 'tableHeader', alignment: 'right' }
              ],
              ...items.map(item => [
                { text: item.produit.designation, style: 'tableCell' },
                { text: item.quantite.toString(), style: 'tableCell', alignment: 'center' },
                { text: `${item.produit.montant.toFixed(2)} ${paymentData.currency}`, style: 'tableCell', alignment: 'right' },
                { text: `${(item.produit.montant * item.quantite).toFixed(2)} ${paymentData.currency}`, style: 'tableCell', alignment: 'right' }
              ])
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return (i === 0 || i === 1) ? '#1F40A5' : '#E5E7EB';
            },
            paddingLeft: function (i: number, node: any) { return 8; },
            paddingRight: function (i: number, node: any) { return 8; },
            paddingTop: function (i: number, node: any) { return 8; },
            paddingBottom: function (i: number, node: any) { return 8; }
          },
          margin: [0, 0, 0, 20]
        },
        
        // Résumé financier
        {
          columns: [
            { width: '60%', text: '' },
            {
              width: '40%',
              table: {
                widths: ['*', '*'],
                body: [
                  [
                    { text: 'Sous-total:', style: 'summaryLabel' },
                    { text: `${parseInt(paymentData.montant).toFixed(2)} ${paymentData.currency}`, style: 'summaryValue', alignment: 'right' }
                  ],
                  [
                    { text: 'Frais de traitement:', style: 'summaryLabel' },
                    { text: '0 CDF', style: 'summaryValue', alignment: 'right' }
                  ],
                  [
                    { text: 'TOTAL À PAYER:', style: 'totalLabel' },
                    { text: `${parseInt(paymentData.montant).toFixed(2)} ${paymentData.currency}`, style: 'totalValue', alignment: 'right' }
                  ]
                ]
              },
              layout: {
                hLineWidth: function (i: number, node: any) {
                  return (i === node.table.body.length - 1) ? 2 : 0;
                },
                vLineWidth: function (i: number, node: any) { return 0; },
                hLineColor: function (i: number, node: any) { return '#1F40A5'; },
                paddingLeft: function (i: number, node: any) { return 8; },
                paddingRight: function (i: number, node: any) { return 8; },
                paddingTop: function (i: number, node: any) { return 8; },
                paddingBottom: function (i: number, node: any) { return 8; }
              }
            }
          ],
          margin: [0, 0, 0, 40]
        },
        
        // Informations de paiement et conditions
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'INFORMATIONS DE PAIEMENT', style: 'footerTitle' },
                { text: `Référence: ${paymentData.reference}`, style: 'footerText' },
                { text: `ID Transaction: ${paymentData._id}`, style: 'footerText' },
                { text: `Date: ${currentDate.toLocaleDateString('fr-FR')} à ${currentDate.toLocaleTimeString('fr-FR')}`, style: 'footerText' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'CONDITIONS', style: 'footerTitle' },
                { text: '• Cette facture est générée automatiquement', style: 'footerText' },
                { text: '• Conservez ce document comme preuve de paiement', style: 'footerText' },
                { text: '• Pour toute réclamation, présentez cette facture', style: 'footerText' }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Pied de page avec ligne de séparation
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: '#E5E7EB'
            }
          ],
          margin: [0, 0, 0, 15]
        },
        {
          text: 'Merci pour votre confiance - I.N.B.T.P Kinshasa',
          style: 'thankYou',
          alignment: 'center'
        }
      ],
      
      styles: {
        invoiceTitle: {
          fontSize: 24,
          bold: true,
          color: '#1F40A5',
          margin: [0, 0, 0, 5]
        },
        institutionName: {
          fontSize: 14,
          bold: true,
          color: '#374151'
        },
        institutionSubtitle: {
          fontSize: 12,
          color: '#6B7280'
        },
        country: {
          fontSize: 10,
          color: '#9CA3AF'
        },
        invoiceNumberLabel: {
          fontSize: 12,
          color: '#6B7280'
        },
        invoiceNumber: {
          fontSize: 12,
          bold: true,
          color: '#1F40A5'
        },
        invoiceDate: {
          fontSize: 11,
          color: '#6B7280'
        },
        paymentStatus: {
          fontSize: 12,
          bold: true,
          color: '#059669',
          margin: [0, 5, 0, 0]
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: '#1F40A5',
          margin: [0, 0, 0, 5]
        },
        labelStyle: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        valueStyle: {
          fontSize: 11,
          color: '#6B7280'
        },
        qrDescription: {
          fontSize: 9,
          color: '#6B7280',
          italics: true
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: '#FFFFFF',
          fillColor: '#1F40A5'
        },
        tableCell: {
          fontSize: 11,
          color: '#374151'
        },
        summaryLabel: {
          fontSize: 11,
          color: '#6B7280'
        },
        summaryValue: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        totalLabel: {
          fontSize: 13,
          bold: true,
          color: '#1F40A5'
        },
        totalValue: {
          fontSize: 13,
          bold: true,
          color: '#1F40A5'
        },
        footerTitle: {
          fontSize: 11,
          bold: true,
          color: '#374151',
          margin: [0, 0, 0, 5]
        },
        footerText: {
          fontSize: 9,
          color: '#6B7280',
          margin: [0, 2, 0, 0]
        },
        thankYou: {
          fontSize: 12,
          italics: true,
          color: '#6B7280'
        }
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`Facture_${paymentData.reference}.pdf`);
  }

  async generateCourseInscriptionPDF(invoiceData: any, qrCodeUrl: string): Promise<void> {
    console.log("Génération de la facture d'inscription au cours:", invoiceData);
    
    const currentDate = new Date();
    const paymentStatusColor = invoiceData.payment.status === '1' ? '#059669' : 
                              invoiceData.payment.status === '2' ? '#F59E0B' : '#EF4444';
    const paymentStatusText = invoiceData.payment.status === '1' ? 'Payé' : 
                             invoiceData.payment.status === '2' ? 'En attente' : 'Échoué';
    
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      // defaultStyle: {
      //   font: 'Roboto'
      // },
      
      content: [
        // En-tête avec logo et informations de l'institution
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: invoiceData.institution.name, style: 'institutionName' },
                { text: `${invoiceData.institution.shortName} - ${invoiceData.institution.location}`, style: 'institutionSubtitle' },
                { text: invoiceData.institution.country, style: 'country' },
                { text: invoiceData.institution.ministry, style: 'ministry' }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: 'N°/Ref', style: 'invoiceNumberLabel', alignment: 'right' },
                { text: invoiceData.invoiceNumber, style: 'invoiceNumber', alignment: 'right' },
                { text: `${invoiceData.date} à ${invoiceData.time}`, style: 'invoiceDate', alignment: 'right' },
                { text: `Statut: ${paymentStatusText}`, style: 'paymentStatus', alignment: 'right', color: paymentStatusColor }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Ligne de séparation principale
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 3,
              lineColor: '#1F40A5'
            }
          ],
          margin: [0, 0, 0, 25]
        },
        
        // Informations de l'enseignant et QR code
        {
          columns: [
            {
              width: '50%',
              stack: [
                // Informations de l'étudiant
                {
                  text: 'INFORMATIONS DE L\'ÉTUDIANT',
                  style: 'sectionTitle',
                  margin: [0, 0, 0, 15]
                },
                {
                  table: {
                    widths: ['25%', '*'],
                    body: [
                      [
                        { text: 'Matricule:', style: 'labelStyle' },
                        { text: invoiceData.student.matricule, style: 'valueStyleBold' }
                      ],
                      [
                        { text: 'Nom complet:', style: 'labelStyle' },
                        { text: invoiceData.student.nom, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Téléphone:', style: 'labelStyle' },
                        { text: invoiceData.student.telephone, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Email:', style: 'labelStyle' },
                        { text: invoiceData.student.email, style: 'valueStyle' }
                      ]
                    ]
                  },
                  layout: 'noBorders',
                  margin: [0, 0, 0, 30]
                },
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'ENSEIGNANT RESPONSABLE', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['30%', '*'],
                    body: [
                      [
                        { text: 'Nom:', style: 'labelStyle' },
                        { text: invoiceData.teacher.name, style: 'valueStyleBold' }
                      ],
                      [
                        { text: 'Grade:', style: 'labelStyle' },
                        { text: invoiceData.teacher.grade, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Titre:', style: 'labelStyle' },
                        { text: invoiceData.teacher.title, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Matricule:', style: 'labelStyle' },
                        { text: invoiceData.teacher.matricule, style: 'valueStyle' }
                      ],
                      [
                        { text: 'Statut:', style: 'labelStyle' },
                        { text: invoiceData.teacher.status, style: 'valueStyle' }
                      ]
                    ]
                  },
                  layout: 'noBorders',
                  margin: [0, 10, 0, 0]
                },
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        
        // Détails du paiement
        { text: 'DÉTAILS DU PAIEMENT', style: 'sectionTitle', margin: [0, 0, 0, 15] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '20%', '25%'],
            body: [
              [
                { text: 'DESCRIPTION', style: 'tableHeader' },
                { text: 'MONTANT', style: 'tableHeader', alignment: 'center' },
                { text: 'DEVISE', style: 'tableHeader', alignment: 'center' }
              ],
              [
                { text: `${invoiceData.course.title} (${invoiceData.annee.debut} - ${invoiceData.annee.fin})`, style: 'tableCell' },
                { text: invoiceData.payment.amount, style: 'tableCell', alignment: 'center' },
                { text: invoiceData.payment.currency, style: 'tableCell', alignment: 'center' }
              ]
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return (i === 0 || i === 1) ? '#1F40A5' : '#E5E7EB';
            },
            paddingLeft: function (i: number, node: any) { return 8; },
            paddingRight: function (i: number, node: any) { return 8; },
            paddingTop: function (i: number, node: any) { return 8; },
            paddingBottom: function (i: number, node: any) { return 8; }
          },
          margin: [0, 0, 0, 20]
        },
        
        // Résumé financier
        {
          columns: [
            { width: '60%', stack: [
              { text: 'VÉRIFICATION PAIEMENT', style: 'sectionTitle', alignment: 'left' },
              {
                qr: qrCodeUrl,
                fit: 120,
                alignment: 'left',
                margin: [0, 10, 0, 10]
              },
              { 
                text: 'Scannez pour vérifier le paiement', 
                style: 'qrDescription', 
                alignment: 'left' 
              }
            ] },
            {
              width: '40%',
              table: {
                widths: ['*', '*'],
                body: [
                  [
                    { text: 'Montant étudiant:', style: 'summaryLabel' },
                    { text: `${invoiceData.payment.amount} ${invoiceData.payment.currency}`, style: 'summaryValue', alignment: 'right' }
                  ],
                  [
                    { text: 'Frais de service:', style: 'summaryLabel' },
                    { text: `${(parseFloat(invoiceData.payment.amountCustomer) - parseFloat(invoiceData.payment.amount)).toFixed(2)} ${invoiceData.payment.currency}`, style: 'summaryValue', alignment: 'right' }
                  ],
                  [
                    { text: 'TOTAL PAYÉ:', style: 'totalLabel' },
                    { text: `${invoiceData.payment.amountCustomer} ${invoiceData.payment.currency}`, style: 'totalValue', alignment: 'right' }
                  ]
                ]
              },
              layout: {
                hLineWidth: function (i: number, node: any) {
                  return (i === node.table.body.length - 1) ? 2 : 0;
                },
                vLineWidth: function (i: number, node: any) { return 0; },
                hLineColor: function (i: number, node: any) { return '#1F40A5'; },
                paddingLeft: function (i: number, node: any) { return 8; },
                paddingRight: function (i: number, node: any) { return 8; },
                paddingTop: function (i: number, node: any) { return 8; },
                paddingBottom: function (i: number, node: any) { return 8; }
              }
            }
          ],
          margin: [0, 0, 0, 40]
        },
        
        // Informations de paiement et conditions
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'INFORMATIONS DE TRANSACTION', style: 'footerTitle' },
                { text: `Référence: ${invoiceData.payment.reference}`, style: 'footerText' },
                { text: `Numéro de commande: ${invoiceData.payment.orderNumber}`, style: 'footerText' },
                { text: `Canal: ${invoiceData.payment.channel.toUpperCase()}`, style: 'footerText' },
                { text: `Date de création: ${invoiceData.payment.createdAt}`, style: 'footerText' },
                invoiceData.payment.message ? { text: `Message: ${invoiceData.payment.message}`, style: 'footerText' } : {}
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'CONDITIONS D\'INSCRIPTION', style: 'footerTitle' },
                { text: '• Cette facture confirme votre inscription au cours', style: 'footerText' },
                { text: '• Conservez ce document comme preuve d\'inscription', style: 'footerText' },
                { text: '• Présentez cette facture lors des cours', style: 'footerText' },
                { text: '• Le paiement est non remboursable', style: 'footerText' }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Pied de page avec ligne de séparation
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: '#E5E7EB'
            }
          ],
          margin: [0, 0, 0, 15]
        },
        {
          text: 'Merci pour votre inscription - Bonne formation !',
          style: 'thankYou',
          alignment: 'center'
        }
      ],
      
      styles: {
        invoiceTitle: {
          fontSize: 22,
          bold: true,
          color: '#1F40A5',
          margin: [0, 0, 0, 5]
        },
        institutionName: {
          fontSize: 14,
          bold: true,
          color: '#374151'
        },
        institutionSubtitle: {
          fontSize: 12,
          color: '#6B7280'
        },
        country: {
          fontSize: 10,
          color: '#9CA3AF'
        },
        ministry: {
          fontSize: 9,
          color: '#9CA3AF',
          italics: true
        },
        invoiceNumberLabel: {
          fontSize: 12,
          color: '#6B7280'
        },
        invoiceNumber: {
          fontSize: 14,
          bold: true,
          color: '#1F40A5'
        },
        invoiceDate: {
          fontSize: 11,
          color: '#6B7280'
        },
        paymentStatus: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: '#1F40A5',
          margin: [0, 0, 0, 5]
        },
        labelStyle: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        valueStyle: {
          fontSize: 11,
          color: '#6B7280'
        },
        valueStyleBold: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        qrDescription: {
          fontSize: 9,
          color: '#6B7280',
          italics: true
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: '#FFFFFF',
          fillColor: '#1F40A5'
        },
        tableCell: {
          fontSize: 11,
          color: '#374151'
        },
        summaryLabel: {
          fontSize: 11,
          color: '#6B7280'
        },
        summaryValue: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        totalLabel: {
          fontSize: 13,
          bold: true,
          color: '#1F40A5'
        },
        totalValue: {
          fontSize: 13,
          bold: true,
          color: '#1F40A5'
        },
        footerTitle: {
          fontSize: 11,
          bold: true,
          color: '#374151',
          margin: [0, 0, 0, 5]
        },
        footerText: {
          fontSize: 9,
          color: '#6B7280',
          margin: [0, 2, 0, 0]
        },
        thankYou: {
          fontSize: 12,
          italics: true,
          color: '#6B7280'
        }
      }
    };
    
    // Générer et télécharger le PDF
    pdfMake.createPdf(docDefinition).download(`Inscription_${invoiceData.student.matricule}_${invoiceData.course.title.replace(/\s+/g, '_')}.pdf`);
  }
}