import EtudiantService from './EtudiantService';

export interface CommandeVerificationOptions {
  produitId: string;
  matricule: string;
  onSuccess?: (hasCommande: boolean, data: any) => void;
  onError?: (error: any) => void;
  redirections?: {
    hasCommande?: string; // URL de redirection si l'étudiant a commandé
    noCommande?: string;  // URL de redirection si l'étudiant n'a pas commandé
    error?: string;       // URL de redirection en cas d'erreur
  };
  openInNewTab?: boolean; // Par défaut true
}

export interface CommandeVerificationResult {
  success: boolean;
  hasCommande: boolean;
  data: any;
  error?: any;
}

class CommandeVerificationService {
  /**
   * Vérifie si un étudiant a commandé un produit et gère les redirections
   */
  static async checkCommande(options: CommandeVerificationOptions): Promise<CommandeVerificationResult> {
    const {
      produitId,
      matricule,
      onSuccess,
      onError,
      redirections,
      openInNewTab = true
    } = options;
    

    try {
      const response = await EtudiantService.checkProduct(produitId, matricule);

      if (response.success) {
        const { data } = response;

        console.log("Commande : ", data);
        
        const hasCommande = !!data;

        // Appeler le callback de succès si fourni
        if (onSuccess) {
          onSuccess(hasCommande, data);
        }

        // Gérer les redirections
        if (redirections) {
          let redirectUrl: string | undefined;

          if (hasCommande && redirections.hasCommande) {
            redirectUrl = redirections.hasCommande;
          } else if (!hasCommande && redirections.noCommande) {
            redirectUrl = redirections.noCommande;
          }

          if (redirectUrl) {
            if (openInNewTab) {
              window.open(redirectUrl, '_blank');
            } else {
              window.location.href = redirectUrl;
            }
          }
        }

        return {
          success: true,
          hasCommande,
          data
        };
      } else {
        // En cas d'échec de la vérification
        const error = new Error('Échec de la vérification de commande');
        
        if (onError) {
          onError(error);
        }

        // Redirection d'erreur
        if (redirections?.error) {
          const redirectUrl = redirections.error;
          if (openInNewTab) {
            window.open(redirectUrl, '_blank');
          } else {
            window.location.href = redirectUrl;
          }
        }

        return {
          success: false,
          hasCommande: false,
          data: null,
          error
        };
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de commande:', error);
      
      if (onError) {
        onError(error);
      }

      // Redirection d'erreur
      if (redirections?.error) {
        const redirectUrl = redirections.error;
        if (openInNewTab) {
          window.open(redirectUrl, '_blank');
        } else {
          window.location.href = redirectUrl;
        }
      }

      return {
        success: false,
        hasCommande: false,
        data: null,
        error
      };
    }
  }

  /**
   * Version simplifiée pour vérifier uniquement sans redirection
   */
  static async checkCommandeOnly(produitId: string, matricule: string): Promise<CommandeVerificationResult> {
    return this.checkCommande({
      produitId,
      matricule
    });
  }

  /**
   * Récupère automatiquement le matricule depuis localStorage et vérifie la commande
   */
  static async checkCommandeWithStoredMatricule(
    produitId: string, 
    options?: Omit<CommandeVerificationOptions, 'produitId' | 'matricule'>
  ): Promise<CommandeVerificationResult> {
    try {
      const studentData = EtudiantService.getStoredStudentData();
      
      if (!studentData || !studentData.matricule) {
        const error = new Error('Aucune donnée étudiant trouvée dans le stockage local');
        
        if (options?.onError) {
          options.onError(error);
        }

        // Redirection d'erreur par défaut vers la page produit
        const defaultErrorUrl = `/produits/${produitId}`;
        const redirectUrl = options?.redirections?.error || defaultErrorUrl;
        
        if (options?.openInNewTab !== false) {
          window.open(redirectUrl, '_blank');
        } else {
          window.location.href = redirectUrl;
        }

        return {
          success: false,
          hasCommande: false,
          data: null,
          error
        };
      }

      return this.checkCommande({
        produitId,
        matricule: studentData.matricule,
        ...options
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données étudiant:', error);
      
      if (options?.onError) {
        options.onError(error);
      }

      return {
        success: false,
        hasCommande: false,
        data: null,
        error
      };
    }
  }
}

export default CommandeVerificationService;
