"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Signup from "./Signup";
import Signin from "./Signin";
import { useUserAuthStore } from "@/store/userStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Fonction utilitaire pour vérifier l'authentification
const checkAuthToken = (): boolean => {
  try {
    // Vérifier si un token existe dans localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      console.log("Aucun token trouvé");
      return false;
    }

    // Vérification basique du format JWT
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log("Format de token invalide");
      // Supprimer le token invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      return false;
    }

    // Décoder le payload pour vérifier l'expiration
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.log("Token expiré");
        // Supprimer le token expiré
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        return false;
      }

      console.log("Token valide, utilisateur authentifié");
      return true;
    } catch (decodeError) {
      console.log("Erreur lors du décodage du token:", decodeError);
      // Supprimer le token invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification d'authentification:", error);
    return false;
  }
};

// Composant AuthGuard agissant comme middleware
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useUserAuthStore();
  useEffect(() => {

    if (!isAuthenticated) {
      console.log("Utilisateur non authentifié, redirection vers l'inscription");
    } else {
      console.log("Utilisateur authentifié, redirection vers le dashboard");
      router.push('/dashboard');
    }
  }, [router]);

  // Si non authentifié, ne rien rendre (redirection en cours)
  if (!isAuthenticated) {
    return <Signin />;
  }

  // Si authentifié, rendre le contenu
  return <>{children}</>;
}
