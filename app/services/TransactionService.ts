import config from "./config.json";
import { Recours } from "./EtudiantService";

export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  phone: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    orderNumber?: string;
    status?: string;
    [key: string]: any;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class TransactionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.base_url;
  }

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

  private async makeRequest(url: string, options: RequestInit = {}): Promise<{status: number, message?: string, data: any}> {
    try {
      const response = await fetch(url, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      return {
        status: response.status,
        data: data
      };
    } catch (error) {
      console.error('Transaction API Error:', error);
      throw new Error(`Erreur de réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Créer un paiement
   */
  async createPayment(paymentData: PaymentRequest): Promise<{status: number, data: PaymentResponse}> {
    const url = `${this.baseUrl}/payment`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPayment(orderNumber: string): Promise<{status: number, data: ApiResponse}> {
    const url = `${this.baseUrl}/payment/${encodeURIComponent(orderNumber)}`;
    return this.makeRequest(url);
  }

  /**
   * Vérifier le statut d'un paiement de résultat
   */
  async checkPaymentStatus(reference: string): Promise<{status: number, data: ApiResponse}> {
    const url = `${this.baseUrl}/payment/status/${encodeURIComponent(reference)}`;
    return this.makeRequest(url);
  }

  async createRecours ({
      etudiantId,
      noteId,
      object,
      telephone
  }: {
      etudiantId: string;
      noteId: string;
      object: string;
      telephone: string;
  }): Promise<{success: boolean; message: string; data: Recours}> {
      try {
        // Recupérer les 9 derniers chiffres du téléphone
        const phone = telephone.slice(-9)
        const response = await fetch(`${this.baseUrl}/payment/recours/${etudiantId}`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                etudiantId,
                noteId,
                object,
                telephone : `243${phone}`
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
          console.error("Erreur lors de la création du recours:", error);
          throw error;
      }
  }

  async updateRecours (id: string, updateData: Partial<Recours>): Promise<{success: boolean; message: string; data: Recours}> {
      try {
          const response = await fetch(`${this.baseUrl}/etudiant/recours/${id}`, {
              method: "PUT",
              headers: this.getAuthHeaders(),
              body: JSON.stringify(updateData),
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
      } catch (error) {
          console.error("Erreur lors de la mise à jour du recours:", error);
          throw error;
      }
  }
}

export default new TransactionService();
