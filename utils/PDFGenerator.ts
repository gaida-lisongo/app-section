import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Etudiant {
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

export class PDFGenerator {
  private pdfDoc: PDFDocument | null = null;
  
  constructor() {
    // Initialization happens in generateInscriptionPDF
  }

  async generateInscriptionPDF(etudiant: Etudiant, section?: Section): Promise<Uint8Array> {
    try {
      // Charger le template avec filigrane
      const templateBytes = await this.loadTemplate();
      this.pdfDoc = await PDFDocument.load(templateBytes);
      
      // Utiliser la première page du template
      const pages = this.pdfDoc.getPages();
      const page = pages[0];
      
      // Créer la fiche d'inscription style invoice moderne
      await this.createModernInvoice(page, etudiant, section);
      
      return await this.pdfDoc.save();
    } catch (error) {
      console.warn('Template non chargé, création simple:', error);
      return await this.createSimpleInvoice(etudiant, section);
    }
  }

  private async loadTemplate(): Promise<Uint8Array> {
    const response = await fetch('/templates/template_he.pdf');
    if (!response.ok) {
      throw new Error(`Template non trouvé: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  private async createModernInvoice(page: any, etudiant: Etudiant, section: Section | undefined) {
    const font = await this.pdfDoc!.embedFont(StandardFonts.Helvetica);
    const boldFont = await this.pdfDoc!.embedFont(StandardFonts.HelveticaBold);
    
    const { width, height } = page.getSize();
    const margin = 25;
    
    // === EN-TÊTE MODERNE STYLE INVOICE ===
    
    // Logo/Institution (gauche)
    page.drawText('I.N.B.T.P', {
      x: margin,
      y: height - 30,
      size: 20,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69), // Bleu institutionnel
    });
    
    page.drawText('Institut National de Bâtiment et Travaux Publics', {
      x: margin,
      y: height - 45,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Numéro de fiche (droite) - Style invoice
    page.drawText('FICHE N°', {
      x: width - margin - 80,
      y: height - 30,
      size: 12,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    page.drawText(etudiant.matricule, {
      x: width - margin - 80,
      y: height - 45,
      size: 16,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    page.drawText(new Date().toLocaleDateString('fr-FR'), {
      x: width - margin - 80,
      y: height - 60,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Ligne de séparation moderne
    page.drawLine({
      start: { x: margin, y: height - 80 },
      end: { x: width - margin, y: height - 80 },
      thickness: 2,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    // === SECTION FACTURATION (TO) ===
    let yPos = height - 110;
    
    page.drawText('INSCRIT À:', {
      x: margin,
      y: yPos,
      size: 11,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    yPos -= 20;
    page.drawText(`${etudiant.nom} ${etudiant.post_nom} ${etudiant.prenom}`, {
      x: margin,
      y: yPos,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPos -= 15;
    page.drawText(`${etudiant.sexe === 'M' ? 'Masculin' : 'Féminin'} • ${etudiant.nationalite}`, {
      x: margin,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    yPos -= 12;
    page.drawText(`Né(e) le ${new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')} à ${etudiant.lieu_naissance}`, {
      x: margin,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // === TABLEAU STYLE INVOICE PROPRE ===
    yPos = height - 200;
    
    // En-têtes du tableau (sans fond)
    const tableHeaders = ['DÉTAIL', 'INFORMATION'];
    const colWidths = [90, 120];
    
    // Texte des en-têtes propres
    page.drawText(tableHeaders[0], {
      x: margin,
      y: yPos,
      size: 11,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    page.drawText(tableHeaders[1], {
      x: margin + colWidths[0],
      y: yPos,
      size: 11,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    // Ligne de séparation sous les en-têtes
    page.drawLine({
      start: { x: margin, y: yPos - 5 },
      end: { x: margin + colWidths[0] + colWidths[1], y: yPos - 5 },
      thickness: 1,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    // Lignes du tableau
    const tableRows = [
      ['Matricule', etudiant.matricule],
      ['Section', section?.description.designation || 'Non définie'],
      ['Année académique', '2024-2025'],
      ['Documents fournis', `${etudiant.documents?.length || 0} fichier(s)`],
      ['Photo fournie', etudiant.photo ? 'Oui ✓' : 'Non'],
      ['Statut', 'Inscrit'],
    ];
    
    yPos -= 20;
    
    tableRows.forEach((row, index) => {
      // Texte propre sans fond
      page.drawText(row[0], {
        x: margin,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      page.drawText(row[1], {
        x: margin + colWidths[0],
        y: yPos,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      yPos -= 18; // Plus d'espacement entre les lignes
    });
    
    // === SECTION VALIDATION PROPRE ===
    yPos = height - 380;
    
    page.drawText('VALIDATION DE L\'INSCRIPTION', {
      x: margin,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    // Ligne de séparation
    page.drawLine({
      start: { x: margin, y: yPos - 5 },
      end: { x: width - margin, y: yPos - 5 },
      thickness: 1,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    yPos -= 30;
    
    // Zone signatures - propre et espacée
    page.drawText('Signature de l\'étudiant:', {
      x: margin,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    page.drawText('Cachet & Signature Administration:', {
      x: width - margin - 150,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Lignes pour signatures
    yPos -= 30;
    page.drawLine({
      start: { x: margin, y: yPos },
      end: { x: margin + 120, y: yPos },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    
    page.drawLine({
      start: { x: width - margin - 120, y: yPos },
      end: { x: width - margin, y: yPos },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    
    yPos -= 15;
    page.drawText('Date: _______________', {
      x: margin,
      y: yPos,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // === PIED DE PAGE MODERNE ===
    const footerY = 50;
    
    page.drawLine({
      start: { x: margin, y: footerY + 20 },
      end: { x: width - margin, y: footerY + 20 },
      thickness: 1,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    page.drawText('I.N.B.T.P - Kinshasa, République Démocratique du Congo', {
      x: margin,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    page.drawText(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, {
      x: width - margin - 80,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  private async createSimpleInvoice(etudiant: Etudiant, section?: Section): Promise<Uint8Array> {
    // Fallback simple si template non disponible
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const { width, height } = page.getSize();
    
    page.drawText('FICHE D\'INSCRIPTION - I.N.B.T.P', {
      x: 50,
      y: height - 50,
      size: 16,
      font: font,
    });
    
    page.drawText(`Matricule: ${etudiant.matricule}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: font,
    });
    
    page.drawText(`Nom: ${etudiant.nom} ${etudiant.post_nom} ${etudiant.prenom}`, {
      x: 50,
      y: height - 130,
      size: 12,
      font: font,
    });
    
    return await pdfDoc.save();
  }

  private async overlayContent(etudiant: Etudiant, section?: Section) {
    if (!this.pdfDoc) return;
    
    // Obtenir les pages du template
    const pages = this.pdfDoc.getPages();
    let firstPage = pages[0];
    
    // S'assurer qu'on a 2 pages
    let secondPage;
    if (pages.length < 2) {
      secondPage = this.pdfDoc.addPage();
      const { width, height } = firstPage.getSize();
      secondPage.setSize(width, height);
    } else {
      secondPage = pages[1];
    }
    
    // Charger les polices
    const font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await this.pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Page 1 - Informations principales
    await this.overlayPage1(firstPage, font, boldFont, etudiant, section);
    
    // Page 2 - Documents
    await this.overlayPage2(secondPage, font, boldFont, etudiant, section);
  }

  private async overlayPage1(page: any, font: any, boldFont: any, etudiant: Etudiant, section?: Section) {
    const { width, height } = page.getSize();
    const margin = 20;
    let y = height - 80; // Commencer du haut
    
    // Matricule en évidence
    page.drawText(`Matricule: ${etudiant.matricule}`, {
      x: margin,
      y: y,
      size: 14,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69), // Bleu
    });
    
    y -= 25;
    
    // Informations personnelles
    page.drawText(`Nom: ${etudiant.nom} ${etudiant.post_nom} ${etudiant.prenom}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    y -= 15;
    
    page.drawText(`Sexe: ${etudiant.sexe === 'M' ? 'Masculin' : 'Féminin'}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 15;
    
    page.drawText(`Nationalité: ${etudiant.nationalite}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 15;
    
    page.drawText(`Lieu de naissance: ${etudiant.lieu_naissance}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 15;
    
    page.drawText(`Date de naissance: ${new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 15;
    
    if (section) {
      page.drawText(`Section: ${section.description.designation}`, {
        x: margin,
        y: y,
        size: 12,
        font: font,
      });
      y -= 15;
    }
    
    // Date d'inscription
    y -= 20;
    page.drawText(`Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}`, {
      x: margin,
      y: y,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  private async overlayPage2(page: any, font: any, boldFont: any, etudiant: Etudiant, section?: Section) {
    const { width, height } = page.getSize();
    const margin = 20;
    let y = height - 60;
    
    // Titre documents
    page.drawText('DOCUMENTS FOURNIS', {
      x: margin,
      y: y,
      size: 16,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    y -= 30;
    
    if (etudiant.documents && etudiant.documents.length > 0) {
      etudiant.documents.forEach((doc, index) => {
        const docName = typeof doc === 'string' ? `Document ${index + 1}` : doc.name;
        
        page.drawText(`${index + 1}. ${docName}`, {
          x: margin,
          y: y,
          size: 12,
          font: font,
        });
        y -= 15;
        
        if (typeof doc !== 'string' && doc.size) {
          page.drawText(`   Taille: ${this.formatFileSize(doc.size)}`, {
            x: margin + 10,
            y: y,
            size: 10,
            font: font,
            color: rgb(0.6, 0.6, 0.6),
          });
          y -= 12;
        }
      });
    } else {
      page.drawText('Aucun document fourni', {
        x: margin,
        y: y,
        size: 12,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }
    
    y -= 40;
    
    // Photo
    page.drawText('PHOTO D\'IDENTITÉ', {
      x: margin,
      y: y,
      size: 14,
      font: boldFont,
      color: rgb(0.12, 0.25, 0.69),
    });
    
    y -= 20;
    
    if (etudiant.photo) {
      page.drawText('Photo fournie ✓', {
        x: margin,
        y: y,
        size: 12,
        font: font,
        color: rgb(0, 0.6, 0),
      });
    } else {
      page.drawText('Aucune photo fournie', {
        x: margin,
        y: y,
        size: 12,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }
  }

  private async createSimpleContent(etudiant: Etudiant, section?: Section): Promise<Uint8Array> {
    // Fallback: créer un PDF simple si le template ne charge pas
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const { width, height } = page.getSize();
    
    page.drawText('FICHE D\'INSCRIPTION - INBTP', {
      x: 50,
      y: height - 50,
      size: 16,
      font: font,
    });
    
    page.drawText(`Matricule: ${etudiant.matricule}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: font,
    });
    
    page.drawText(`Nom: ${etudiant.nom} ${etudiant.post_nom} ${etudiant.prenom}`, {
      x: 50,
      y: height - 130,
      size: 12,
      font: font,
    });
    
    return await pdfDoc.save();
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async save(filename: string = 'inscription.pdf'): Promise<void> {
    if (!this.pdfDoc) {
      throw new Error('Aucun PDF généré');
    }
    
    const pdfBytes = await this.pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  output(): string {
    return 'data:application/pdf;base64,'; // Placeholder
  }
}