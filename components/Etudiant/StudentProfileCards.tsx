"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Etudiant } from "@/types/etudiant";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Shield, 
  LogIn, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Wallet
} from "lucide-react";
import { useUserAuthStore } from "@/store/userStore";

interface StudentProfileCardsProps {
  etudiant: Etudiant;
}

export default function StudentProfileCards({ etudiant }: StudentProfileCardsProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const { connect, isAuthenticated, isLoading, error } = useUserAuthStore();
  
  const handleAccessDashboard = async () => {
    setSuccess(false);

    try {
      const response = await connect({
        matricule: etudiant.matricule,
        password: etudiant.secure
      });

      if (response) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        console.error("Échec de la connexion:", error);
        alert(error || "Échec de la connexion");
      }
    } catch (err: any) {
      console.error("Error request:", err);
      alert("Erreur lors de la connexion. Vérifiez vos identifiants.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Section gauche - 2/5 - Bienvenue et Bouton */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 lg:p-10 flex flex-col justify-center">
            {/* Photo de profil */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {etudiant.photo ? (
                  <img
                    src={etudiant.photo}
                    alt={`${etudiant.prenom} ${etudiant.nom}`}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center border-4 border-blue-400 shadow-xl">
                    <User className="w-14 h-14 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 w-7 h-7 rounded-full border-4 border-blue-600 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Message de bienvenue */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenue !
              </h2>
              <p className="text-blue-100 text-base leading-relaxed">
                Accédez à votre espace personnel pour consulter vos cours, notes et documents académiques.
              </p>
            </div>

            {/* Messages d'état */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-xs">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 text-xs">Connexion réussie ! Redirection...</p>
              </motion.div>
            )}

            {/* Bouton d'accès */}
            <button
              onClick={handleAccessDashboard}
              disabled={isLoading || success}
              className="w-full bg-white hover:bg-blue-50 text-blue-700 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Connecté !
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Accéder au Dashboard
                </>
              )}
            </button>
          </div>

          {/* Section droite - 3/5 - Informations de l'étudiant */}
          <div className="lg:w-3/5 p-8 lg:p-10">
            {/* En-tête */}
            <div className="mb-6 pb-6 border-b border-blue-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                {etudiant.prenom} {etudiant.nom}
              </h3>
              <p className="text-lg text-blue-700 font-medium mb-3">{etudiant.post_nom}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
                <CreditCard className="w-4 h-4" />
                {etudiant.matricule}
              </div>
            </div>

            {/* Informations en deux colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <InfoItem
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={etudiant.email || "Non renseigné"}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Date de naissance"
                value={formatDate(etudiant.date_naissance)}
              />
              <InfoItem
                icon={<MapPin className="w-5 h-5" />}
                label="Lieu de naissance"
                value={etudiant.lieu_naissance}
              />
              <InfoItem
                icon={<Shield className="w-5 h-5" />}
                label="Nationalité"
                value={etudiant.nationalite}
              />
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Sexe"
                value={etudiant.sexe === "M" ? "Masculin" : "Féminin"}
              />
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Solde</p>
                    <p className="text-lg text-blue-900 font-bold">
                      {etudiant.solde.toLocaleString("fr-FR")} FC
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fonctionnalités disponibles */}
            <div className="mt-6 pt-6 border-t border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Fonctionnalités disponibles</h4>
              <div className="grid grid-cols-2 gap-3">
                <FeatureItem icon="📚" text="Cours" />
                <FeatureItem icon="📊" text="Notes" />
                <FeatureItem icon="📄" text="Documents" />
                <FeatureItem icon="💳" text="Paiements" />
                <FeatureItem icon="🔬" text="Recherches" />
                <FeatureItem icon="🏢" text="Stages" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Composant pour afficher une information
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className="text-sm text-blue-900 font-semibold truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une fonctionnalité
function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-blue-900 font-medium">{text}</span>
    </div>
  );
}