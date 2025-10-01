import { Annee } from "@/types/section";
import config from "./config";
export interface Inscription {
  anneeId: string;
  produitId: string;
}

export interface Semestre<TUnite = string> {
  _id?: string;
  designation: string;
  description: string;
  unites: TUnite[]; // IDs des unités d'enseignement ou détails selon le type
  insription: Inscription[]; // Note: le serveur utilise "insription" (sans 'c')
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SemestreFormData {
  designation: string;
  description: string;
  unites: string[];
  insription: Inscription[]; // Note: utiliser "insription" pour correspondre au serveur
}

export interface Cours {
  _id: string;
  titre: string;
  description: string;
  enseignement: string[];
  credit: number;
  contenu: any[];
  repartition: any[];
  plan: any[];
  seances: any[];
  travaux: any[];
  ressources: any[];
  penalites: any[];
  plagiat: any[];
  __v?: number;
}

export interface Responsable {
  titulaireId: string;
  anneeId: string;
  _id: string;
}

export interface UniteDetails {
  _id: string;
  semestreId: string;
  responsable: Responsable[];
  ressources: any[];
  bibliographie: any[];
  videographie: any[];
  cours: Cours[];
  __v?: number;
  descripteur: {
    mention: string;
    designation: string;
    code: string;
    credit: number;
    type: 'Obigatoire' | 'Optionnelle';
    prealables: any[];
    objectif: any[];
    competences: any[];
    approches: any[];
    evaluation: any[];
  };
}

export interface SemestreWithUnites extends Semestre<UniteDetails> {}

export interface Agent {  
  _id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: string;
  nationalite: string;
  lieu_naissance: string;
  date_naissance: string;
  matricule: string;
  secure: string;
  solde: number;
  grade: string;
  titre: string;
  photo?: string;
  __v: number;
}

export interface Charge {
  _id: string;
  anneeId: Annee;
  agentId: Agent;
  coursId: Cours;
  status: string;
}

export interface Fiche {
  _id: string;
  chargeId: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  logs: {agentId: string; justification: string}[];
  reference?: string;
  cmi?: number;
  examen?: number;
  rattrapage?: number;
  author?: string;
}

class SemestreService {
  private baseUrl = config.base_url + "/enseignement";

  private getAuthHeaders(): HeadersInit {
    const token = "";
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Récupérer tous les semestres
  async getSemestres(): Promise<Semestre[]> {
    try {
      const response = await fetch(`${this.baseUrl}/semestre`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des semestres:", error);
      throw error;
    }
  }

  // Récupérer un semestre par ID avec détails des unités
  async getSemestre(id: string): Promise<SemestreWithUnites> {
    try {
      const response = await fetch(`${this.baseUrl}/semestre/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération du semestre:", error);
      throw error;
    }
  }

  async getChargesByCours(id: string): Promise<Charge[]> {
    try {
      const response = await fetch(`${this.baseUrl}/charge/cours/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des charges:", error);
      throw error;
    }
  }

  // Créer un semestre
  async createFiche(data: {
    chargeId: string;
  }): Promise<Fiche> {
    try {
      const response = await fetch(`${this.baseUrl}/fiche`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création du semestre:", error);
      throw error;
    }
  }

  async createPaymentFiche(data: {
    ficheId: string;
    matricule: string;
    nom: string;
    phone: string;
    email: string;
  }): Promise<Fiche> {
    try {
      //Recupre les 9 derniers chiffres du numero de telephone et ajout du prefixe 243
      const phone = data.phone.slice(-9).replace(/\D/g, '');
      const response = await fetch(`${config.base_url}/payment/fiche/${data.ficheId}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          telephone: `243${phone}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { success, data: respData } = await response.json();
      if (!success) {
        throw new Error(respData.message);
      }
      return respData;
    } catch (error) {
      console.error("Erreur lors de la création du semestre:", error);
      throw error;
    }
  }

  async checkPayment(orderNumber: string): Promise<{
    // {
    //   reference: 'Chrismedie Alakoy:lisongobaita@gmail.com',
    //   amount: '1500.0',
    //   amountCustomer: '1545.0',
    //   currency: 'CDF',
    //   createdAt: '23-09-2025 05:42:35',
    //   status: '2',
    //   channel: 'om'
    // }
    reference: string;
    amount: string;
    amountCustomer: string;
    currency: string;
    createdAt: string;
    status: string;
    channel: string;
    message?: string;
  }> {
    try {
      const response = await fetch(`${config.base_url}/payment/${orderNumber}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { success, message, data: {...respData} } = await response.json();
      if (!success) {
        throw new Error(message);
      }
      return {message, ...respData};
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
      throw error;
    }
  }

  // Générer une facture d'inscription au cours
  async generateInscriptionInvoice(data: {
    charge: Charge;
    cours: Cours;
    inscriptionData: {
      matricule: string;
      nom: string;
      telephone: string;
      email: string;
    };
    orderNumber: string;
    paymentData?: any;
  }): Promise<{
    invoiceData: any;
    qrCodeUrl: string;
  }> {
    try {
      // Récupérer les informations de paiement si disponibles
      let paymentInfo : any= null;
      if (data.orderNumber) {
        try {
          paymentInfo = await this.checkPayment(data.orderNumber);
        } catch (error) {
          console.warn("Impossible de récupérer les informations de paiement:", error);
        }
      }

      // Construire l'URL du QR code pour vérifier le paiement
      const qrCodeUrl = `http://192.168.1.66:4001/api/v1/payment/${data.orderNumber}`;

      // Préparer les données de la facture
      const invoiceData = {
        // Informations de base
        invoiceNumber: `INS-${data.charge._id.slice(-8).toUpperCase()}`,
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR'),
        
        // Informations du cours
        course: {
          title: data.cours.titre,
          description: data.cours.description,
          credits: data.cours.credit,
          id: data.cours._id
        },
        
        // Informations de l'enseignant (charge horaire)
        teacher: {
          name: `${data.charge.agentId.nom} ${data.charge.agentId.post_nom} ${data.charge.agentId.prenom}`,
          grade: data.charge.agentId.grade,
          title: data.charge.agentId.titre,
          matricule: data.charge.agentId.matricule,
          photo: data.charge.agentId.photo,
          status: data.charge.status
        },
        
        // Informations de l'étudiant
        student: {
          matricule: data.inscriptionData.matricule,
          nom: data.inscriptionData.nom,
          telephone: data.inscriptionData.telephone,
          email: data.inscriptionData.email
        },
        
        // Informations de paiement
        payment: {
          orderNumber: data.orderNumber,
          reference: paymentInfo?.reference || data.orderNumber,
          amount: paymentInfo?.amount || '0',
          amountCustomer: paymentInfo?.amountCustomer || '0',
          currency: paymentInfo?.currency || 'CDF',
          status: paymentInfo?.status || 'pending',
          channel: paymentInfo?.channel || 'unknown',
          createdAt: paymentInfo?.createdAt || new Date().toLocaleString('fr-FR'),
          message: paymentInfo?.message
        },
        
        // Informations de l'institution
        institution: {
          name: 'Institut National de Bâtiment et Travaux Publics',
          shortName: 'I.N.B.T.P',
          location: 'Kinshasa/Ngaliema',
          country: 'République Démocratique du Congo',
          ministry: "Ministère de l'Enseignement Supérieur et Universitaire"
        }
      };

      return {
        invoiceData,
        qrCodeUrl
      };
    } catch (error) {
      console.error("Erreur lors de la génération des données de facture:", error);
      throw error;
    }
  }

  // Mettre à jour un semestre
  async updateSemestre(id: string, data: Partial<SemestreFormData>): Promise<Semestre> {
    try {
      const response = await fetch(`${this.baseUrl}/semestre/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du semestre:", error);
      throw error;
    }
  }

  // Supprimer un semestre
  async deleteSemestre(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/semestre/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la suppression du semestre:", error);
      throw error;
    }
  }
}

export default new SemestreService();