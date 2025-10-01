/**
 * Exemples d'utilisation du CommandeVerificationService
 * Ce fichier contient des exemples pratiques pour différents cas d'usage
 */

import CommandeVerificationService from './CommandeVerificationService';

// ============================================================================
// EXEMPLE 1: Vérification simple avec redirections automatiques
// ============================================================================
export const exempleVerificationSimple = async (produitId: string, matricule: string) => {
  const result = await CommandeVerificationService.checkCommande({
    produitId,
    matricule,
    redirections: {
      hasCommande: '/questionnaire/123', // Redirection si l'étudiant a commandé
      noCommande: `/produits/${produitId}`, // Redirection si pas de commande
      error: `/produits/${produitId}` // Redirection en cas d'erreur
    }
  });

  return result;
};

// ============================================================================
// EXEMPLE 2: Vérification avec callbacks personnalisés
// ============================================================================
export const exempleAvecCallbacks = async (produitId: string, matricule: string) => {
  const result = await CommandeVerificationService.checkCommande({
    produitId,
    matricule,
    onSuccess: (hasCommande, data) => {
      if (hasCommande) {
        console.log('✅ Étudiant a commandé le produit:', data);
        // Logique personnalisée pour les étudiants qui ont commandé
        // Par exemple: débloquer du contenu, afficher un questionnaire, etc.
      } else {
        console.log('❌ Étudiant n\'a pas commandé le produit');
        // Logique personnalisée pour les étudiants sans commande
        // Par exemple: afficher un message, proposer l'achat, etc.
      }
    },
    onError: (error) => {
      console.error('🚨 Erreur lors de la vérification:', error);
      // Logique de gestion d'erreur personnalisée
      // Par exemple: afficher un toast d'erreur, logger l'erreur, etc.
    }
  });

  return result;
};

// ============================================================================
// EXEMPLE 3: Vérification avec matricule automatique depuis localStorage
// ============================================================================
export const exempleMatriculeAuto = async (produitId: string) => {
  const result = await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId, {
    onSuccess: (hasCommande, data) => {
      if (hasCommande) {
        // L'étudiant a accès au contenu
        window.location.href = `/contenu/${produitId}`;
      } else {
        // Rediriger vers la page d'achat
        window.location.href = `/acheter/${produitId}`;
      }
    },
    onError: (error) => {
      // Gérer l'erreur (pas de données étudiant, erreur réseau, etc.)
      alert('Erreur lors de la vérification. Veuillez vous reconnecter.');
      window.location.href = '/login';
    },
    openInNewTab: false // Ouvrir dans le même onglet
  });

  return result;
};

// ============================================================================
// EXEMPLE 4: Vérification sans redirection (pour usage dans des modals/composants)
// ============================================================================
export const exempleVerificationSansRedirection = async (produitId: string, matricule: string) => {
  const result = await CommandeVerificationService.checkCommandeOnly(produitId, matricule);
  
  if (result.success) {
    if (result.hasCommande) {
      // L'étudiant a commandé - afficher le contenu
      return {
        access: 'granted',
        message: 'Accès autorisé au contenu',
        data: result.data
      };
    } else {
      // L'étudiant n'a pas commandé - afficher un message
      return {
        access: 'denied',
        message: 'Vous devez acheter ce produit pour y accéder',
        data: null
      };
    }
  } else {
    // Erreur lors de la vérification
    return {
      access: 'error',
      message: 'Erreur lors de la vérification de votre accès',
      error: result.error
    };
  }
};

// ============================================================================
// EXEMPLE 5: Vérification pour un système de cours/travaux (comme ECDetail)
// ============================================================================
export const exempleVerificationTravail = async (travail: any, setLoading: (loading: boolean) => void) => {
  const produitId = typeof travail.produitId === 'object' ? travail.produitId._id : travail.produitId;
  
  if (!produitId) {
    console.error("Aucun produitId trouvé pour ce travail");
    return;
  }

  setLoading(true);

  try {
    await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId, {
      onSuccess: (hasCommande, data) => {
        if (hasCommande) {
          // Ouvrir le questionnaire du travail
          window.open(travail.questionnaire, '_blank');
        } else {
          // Ouvrir la page produit pour acheter
          window.open(`/produits/${produitId}`, '_blank');
        }
      },
      onError: (error) => {
        console.error("Erreur lors de la vérification du travail:", error);
        // Fallback vers la page produit
        window.open(`/produits/${produitId}`, '_blank');
      }
    });
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// EXEMPLE 6: Vérification pour un système de ressources pédagogiques
// ============================================================================
export const exempleVerificationRessource = async (ressourceId: string, onAccessGranted: () => void, onAccessDenied: () => void) => {
  const result = await CommandeVerificationService.checkCommandeWithStoredMatricule(ressourceId, {
    onSuccess: (hasCommande, data) => {
      if (hasCommande) {
        onAccessGranted();
      } else {
        onAccessDenied();
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la vérification de la ressource:', error);
      onAccessDenied();
    }
  });

  return result;
};

// ============================================================================
// EXEMPLE 7: Vérification batch pour plusieurs produits
// ============================================================================
export const exempleVerificationMultiple = async (produitIds: string[], matricule: string) => {
  const results = await Promise.allSettled(
    produitIds.map(produitId => 
      CommandeVerificationService.checkCommandeOnly(produitId, matricule)
    )
  );

  const accessMap = new Map<string, boolean>();
  
  results.forEach((result, index) => {
    const produitId = produitIds[index];
    if (result.status === 'fulfilled' && result.value.success) {
      accessMap.set(produitId, result.value.hasCommande);
    } else {
      accessMap.set(produitId, false);
    }
  });

  return accessMap;
};

// ============================================================================
// EXEMPLE 8: Hook React personnalisé pour la vérification
// ============================================================================
import { useState, useEffect } from 'react';

export const useCommandeVerification = (produitId: string, matricule?: string) => {
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [error, setError] = useState<any>(null);

  const checkAccess = async () => {
    if (!produitId) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (matricule) {
        result = await CommandeVerificationService.checkCommandeOnly(produitId, matricule);
      } else {
        result = await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId);
      }

      if (result.success) {
        setHasAccess(result.hasCommande);
      } else {
        setError(result.error);
        setHasAccess(false);
      }
    } catch (err) {
      setError(err);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [produitId, matricule]);

  return {
    loading,
    hasAccess,
    error,
    refetch: checkAccess
  };
};
