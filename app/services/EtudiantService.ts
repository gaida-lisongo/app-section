import config from './config'
import { LoginCredentials, LoginResponse, AuthResponse, Etudiant } from "@/types/etudiant";
import { ResultatResponse } from "@/types/resultat";

export interface Recours {
    _id?: string;
    noteId: string;
    etudiantId: string;
    object: string;
    reference?: string;
    contenu?: string[];
    status?: "NO" | "PENDING" | "OK";
    preuve?: string;    
}

class EtudiantService {
    private baseUrl = config.base_url + "/etudiant";
  
    private getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || "";
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      return headers;
    }

    async subscribeClasse({
        matricule,
        classeId,
        anneeId,
        faculteId,
        etabId
    }: {
        matricule: string;
        classeId: string;
        anneeId: string;
        faculteId: string;
        etabId: string
    }): Promise<{success: boolean; message: string; data?: {etudiant: Etudiant; parcours: any}}> {
        try {
            const response = await fetch(`${this.baseUrl}/parcours`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    matricule,
                    classeId,
                    anneeId,
                    faculteId,
                    etabId
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Mettre à jour les données locales si la modification réussit
            if (result.success && result.data) {
                localStorage.setItem('studentData', JSON.stringify(result.data));
            }

            return result;
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            throw error;
        }
    }

    async loginEtudiant(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Si la connexion réussit, sauvegarder le token et les données
            if (result.success && result.data) {
                localStorage.setItem('authToken', result.data.token);
                localStorage.setItem('studentData', JSON.stringify(result.data.etudiant));
                localStorage.setItem('studentFullData', JSON.stringify(result.data));
            }

            return result;
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            throw error;
        }
    }

    async updateEtudiant(etudiantId: string, updateData: Partial<Etudiant>): Promise<{success: boolean; message: string; data: Etudiant}> {
        try {
            const response = await fetch(`${this.baseUrl}/${etudiantId}`, {
                method: "PUT",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Mettre à jour les données locales si la modification réussit
            if (result.success && result.data) {
                localStorage.setItem('studentData', JSON.stringify(result.data));
            }

            return result;
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            throw error;
        }
    }

    async getEtudiantProfile(etudiantId: string): Promise<{success: boolean; message: string; data: AuthResponse}> {
        try {
            const response = await fetch(`${this.baseUrl}/${etudiantId}/profile`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
            throw error;
        }
    }

    // Méthodes utilitaires pour gérer les données locales
    getStoredStudentData(): Etudiant | null {
        try {
            const data = localStorage.getItem('studentData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Erreur lors de la récupération des données locales:", error);
            return null;
        }
    }

    getStoredFullData(): AuthResponse | null {
        try {
            const data = localStorage.getItem('studentFullData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Erreur lors de la récupération des données complètes:", error);
            return null;
        }
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('studentData');
        localStorage.removeItem('studentFullData');
    }

    async createRapport ({
        document,
        type,
        productId,
        etudiantId
    }: {
        document: string,
        type: string,
        productId: string,
        etudiantId: string
    }): Promise<{success: boolean; message: string; data: any}> {
        try {
            const response = await fetch(`${this.baseUrl}/rapport`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    document,
                    type,
                    produitId: productId,
                    etudiantId
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la création de la résolution:", error);
            throw error;
        }
    }

    async fetchRapport(etudiantId: string): Promise<{success: boolean; message: string; data: any}> {
        try {
            const response = await fetch(`${this.baseUrl}/rapport/${etudiantId}`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des rapports:", error);
            throw error;
        }
    }

    async checkMatricule(matricule: string): Promise<ResultatResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/checking-2/${matricule}`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la vérification du matricule:", error);
            throw error;
        }
    }

    async checkProduct(productId: string, matricule: string): Promise<{success: boolean; message: string; data: any}> {
        try {
            const response = await fetch(`${this.baseUrl}/checkProduct/${matricule}/${productId}`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la vérification du matricule:", error);
            throw error;
        }
    }
}

export default new EtudiantService();