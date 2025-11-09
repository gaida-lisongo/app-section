"use client";
import CommandeService, { Commande } from "@/app/services/CommandeService";
import { Produit } from "@/app/services/ProduitService";
import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { Etudiant } from "@/types/etudiant";

const ResolutionPayment = ({ produit, onSuccess }: { produit : Produit, onSuccess : (payment : any) => void}) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [commande, setCommande] = useState<Commande | null>(null);
    const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [emailError, setEmailError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [alert, setAlert] = useState<string>(
                            `<strong className="font-semibold">Important:</strong> Après avoir cliqué sur "Procéder au paiement", 
                            vous serez redirigé vers la plateforme de paiement sécurisée. 
                            Une fois le paiement effectué, revenez ici pour vérifier et continuer.`)

    useEffect(() => {
        const etudiantData = localStorage.getItem('studentFullData');

        const initCommande = async (etudiantParsed: any) => {
            setLoading(true);
            try {
                const response = await CommandeService.createCommande({
                    productIds: [produit?._id as string],
                    matricule: etudiantParsed?.etudiant?.matricule,
                    currency: "CDF",
                    reference: `${etudiantParsed?.etudiant?.matricule}-${produit?._id}`,
                });
                console.log(response);
                if (response.status === 201) {
                    setCommande(response.data);
                } else {
                    setError("Erreur lors de la création de la commande");
                }
            } catch (err) {
                console.error(err);
                setError("Erreur de connexion. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        if (etudiantData) {
            const parsed = JSON.parse(etudiantData);
            setEtudiant(parsed.etudiant);
            initCommande(parsed);
        }
    }, [produit]);

    const validateEmail = (value: string) => {
        if (!value) {
            setEmailError("L'email est requis");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError("Email invalide");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validateTelephone = (value: string) => {
        if (!value) {
            setTelephoneError("Le téléphone est requis");
            return false;
        }
        const phoneRegex = /^(\+243|243|0)?[0-9]{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            setTelephoneError("Numéro invalide (ex: +243812345678 ou 243812345678 ou 0812345678)");
            return false;
        }
        setTelephoneError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isEmailValid = validateEmail(email);
        const isTelephoneValid = validateTelephone(telephone);

        if (!isEmailValid || !isTelephoneValid) {
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await CommandeService.createPaymentResolution(
                commande?._id as string, 
                {
                    matricule: etudiant?.matricule as string,
                    nom: etudiant?.nom as string,
                    email,
                    telephone: telephone.replace(/\s/g, '')
                }
            );

            const {
                data,
                success,
                message
            } = response;

            setAlert(`Veuillez valider le paiement et passer à l'étape suivante..`);
            
            if (success) {
                onSuccess(data);
            } else {
                setError("Erreur lors de la création du paiement");
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Initialisation du paiement...</p>
            </div>
        );
    }

    if (error && !commande) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-red-900 dark:text-red-200">Erreur</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Carte produit - Mobile first */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 rounded-xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-1">
                            {produit.designation}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Travail à soumettre
                        </p>
                    </div>
                    <div className="ml-3">
                        <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                </div>
                
                <div className="flex items-baseline justify-between pt-3 border-t border-primary/20">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Montant</span>
                    <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                            {produit.montant?.toLocaleString()}
                        </span>
                        <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 ml-1">
                            CDF
                        </span>
                    </div>
                </div>
            </div>

            {/* Informations étudiant */}
            {etudiant && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h5 className="font-medium text-blue-900 dark:text-blue-200 text-sm sm:text-base">
                            Étudiant
                        </h5>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        {etudiant.nom} {etudiant?.post_nom} {etudiant.prenom}
                    </p>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Matricule: {etudiant.matricule}
                    </p>
                </div>
            )}

            {/* Formulaire - Mobile first */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Champ Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) validateEmail(e.target.value);
                            }}
                            onBlur={(e) => validateEmail(e.target.value)}
                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-base sm:text-sm border rounded-lg 
                                focus:ring-2 focus:ring-primary/50 focus:border-primary
                                dark:bg-blacksection dark:text-white
                                ${emailError 
                                    ? 'border-red-500 dark:border-red-500' 
                                    : 'border-gray-300 dark:border-strokedark'
                                }
                                transition-colors`}
                            placeholder="exemple@email.com"
                            disabled={submitting}
                        />
                    </div>
                    {emailError && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {emailError}
                        </p>
                    )}
                </div>

                {/* Champ Téléphone */}
                <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Numéro de téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                            <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            id="telephone"
                            value={telephone}
                            onChange={(e) => {
                                setTelephone(e.target.value);
                                if (telephoneError) validateTelephone(e.target.value);
                            }}
                            onBlur={(e) => validateTelephone(e.target.value)}
                            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-base sm:text-sm border rounded-lg 
                                focus:ring-2 focus:ring-primary/50 focus:border-primary
                                dark:bg-blacksection dark:text-white
                                ${telephoneError 
                                    ? 'border-red-500 dark:border-red-500' 
                                    : 'border-gray-300 dark:border-strokedark'
                                }
                                transition-colors`}
                            placeholder="+243 812 345 678"
                            disabled={submitting}
                        />
                    </div>
                    {telephoneError && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {telephoneError}
                        </p>
                    )}
                </div>

                {/* Message d'erreur global */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* Bouton de soumission - Mobile optimized */}
                <button
                    type="submit"
                    disabled={submitting || !email || !telephone}
                    className="w-full py-3.5 sm:py-3 px-4 bg-primary text-white font-medium rounded-lg
                        hover:bg-primary/90 active:bg-primary/80
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        flex items-center justify-center space-x-2
                        text-base sm:text-sm
                        shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Traitement en cours...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            <span>Procéder au paiement</span>
                        </>
                    )}
                </button>
            </form>

            {/* Note importante */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {alert}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolutionPayment;
