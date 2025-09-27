"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Cycle, Classe } from "@/app/services/CycleService";
import CycleService from "@/app/services/CycleService";
import CommandeService, { Resultat } from "@/app/services/CommandeService";
import TransactionService from "@/app/services/TransactionService";
import { useSectionStore } from "@/store";
import { ChevronRight, CreditCard, Phone, GraduationCap, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Etudiant } from "@/types/etudiant";

interface PaymentData {
  matricule: string;
  classeId: string;
  telephone: string;
  selectedClasse?: Classe;
}

interface PaymentResult {
  success: boolean;
  message: string;
  data: {
    etudiant: Etudiant;
    resultat: Resultat;
  };
}

const PaymentForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { section } = useSectionStore();
  
  // États pour les étapes
  const [currentStep, setCurrentStep] = useState(1);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Données du formulaire
  const [paymentData, setPaymentData] = useState<PaymentData>({
    matricule: "",
    classeId: "",
    telephone: "",
  });
  
  // Résultat du paiement
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');

  // Récupérer le matricule depuis l'URL
  useEffect(() => {
    const matricule = searchParams.get('matricule');
    if (matricule) {
      setPaymentData(prev => ({ ...prev, matricule }));
    }
  }, [searchParams]);

  // Charger les cycles
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        setLoading(true);
        const cyclesData = await CycleService.getCyclesBySection();
        setCycles(cyclesData);
      } catch (err) {
        setError("Erreur lors du chargement des cycles");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, []);

  // Gérer la sélection de classe
  const handleClasseSelect = (classe: Classe) => {
    localStorage.setItem('classe-resultat', JSON.stringify(classe));
    setPaymentData(prev => ({
      ...prev,
      classeId: classe._id || "",
      selectedClasse: classe
    }));
  };

  // Passer à l'étape suivante
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!paymentData.classeId) {
        setError("Veuillez sélectionner une classe");
        return;
      }
      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2) {
      handlePayment();
    }
  };

  // Gérer le paiement
  const handlePayment = async () => {
    if (!paymentData.telephone.trim()) {
      setError("Veuillez saisir votre numéro de téléphone");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await CommandeService.createPaymentResultat({
        matricule: paymentData.matricule,
        classeId: paymentData.classeId,
        telephone: paymentData.telephone
      });

      console.log("==========RESULTAT RESPONSE==========", response)

      if (response.success) {
        setPaymentResult({
          success: !!response.success,
          message: response.message,
          data: response.data
        });
        setCurrentStep(3);
      } else {
        setError(response.message || "Erreur lors de la création du paiement");
      }
    } catch (err) {
      setError("Erreur lors de la création du paiement");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier le statut du paiement
  const checkPaymentStatus = async () => {
    console.log("==========CHECK PAYMENT STATUS==========", paymentResult)
    
    if (!paymentResult?.data.resultat.reference) return;

    try {
      setPaymentStatus('checking');
      const response = await TransactionService.checkPayment(paymentResult.data.resultat.reference);
      console.log("==========CHECK PAYMENT RESPONSE==========", response)
      const { data } = response;

      console.log("==========CHECK PAYMENT DATA==========", data)
      if (data.success) {
        setPaymentStatus('success');
        localStorage.setItem('check-resultat', JSON.stringify(paymentResult.data.resultat));
        localStorage.setItem('etudiant-resultat', JSON.stringify(paymentResult.data.etudiant));

        // Rediriger vers la page des résultats après 2 secondes
        setTimeout(() => {
          router.push(`/resultat?matricule=${paymentData.matricule}&orderNumber=${paymentResult.data.resultat.reference}`);
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setError("Le paiement n'a pas encore été confirmé. Veuillez réessayer dans quelques instants.");
      }
    } catch (err) {
      setPaymentStatus('failed');
      setError("Erreur lors de la vérification du paiement");
      console.error("Erreur:", err);
    }
  };

  // Rendu de l'étape 1 : Sélection de classe
  const renderStep1 = () => (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Sélectionnez votre classe
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Matricule: <span className="font-semibold">{paymentData.matricule}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des classes...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {cycles.map((cycle) => (
            <div key={cycle._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                {cycle.designation}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {cycle.classes?.map((classe) => (
                  <button
                    key={classe._id}
                    onClick={() => handleClasseSelect(classe)}
                    className={`
                      p-4 text-left border rounded-lg transition-all duration-200
                      ${paymentData.classeId === classe._id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5" />
                      <span className="font-medium">{classe.designation}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {classe.semestres?.length || 0} semestre(s)
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendu de l'étape 2 : Informations de paiement
  const renderStep2 = () => (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Informations de paiement
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Coût de l'accès aux résultats: 3000 FC</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Récapitulatif
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Matricule:</span>
              <span className="font-medium">{paymentData.matricule}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Classe:</span>
              <span className="font-medium">{paymentData.selectedClasse?.designation}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 dark:text-gray-300">Montant:</span>
              <span className="font-bold text-primary">3000 FC</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Numéro de téléphone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={paymentData.telephone}
                onChange={(e) => setPaymentData(prev => ({ ...prev, telephone: e.target.value }))}
                placeholder="Ex: +243 123 456 789"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-black focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rendu de l'étape 3 : Confirmation et vérification
  const renderStep3 = () => (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Confirmation du paiement
        </h2>
      </div>

      {paymentResult && (
        <div className="space-y-6">
          <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 mb-4">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Paiement initié avec succès</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Étudiant:</span>
                <span className="font-medium">{paymentResult.data.etudiant.nom}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{paymentResult.data.etudiant.matricule}</span>
              </div>
              <div className="flex justify-between">
                <span>Référence:</span>
                <span className="font-medium">{paymentResult.data.resultat.reference}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant:</span>
                <span className="font-medium">{paymentResult.data.resultat.montant} {paymentResult.data.resultat.currency}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Effectuez le paiement via votre opérateur mobile, puis cliquez sur le bouton ci-dessous pour vérifier le statut.
            </p>
            
            <button
              onClick={checkPaymentStatus}
              disabled={paymentStatus === 'checking'}
              className={`
                inline-flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-all duration-200
                ${paymentStatus === 'success'
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : paymentStatus === 'checking'
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
                }
              `}
            >
              {paymentStatus === 'checking' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {paymentStatus === 'success' && <CheckCircle className="h-5 w-5" />}
              <span>
                {paymentStatus === 'checking' ? "Vérification..." :
                 paymentStatus === 'success' ? "Paiement confirmé" :
                 "Vérifier le paiement"}
              </span>
            </button>

            {paymentStatus === 'success' && (
              <p className="mt-4 text-green-600 dark:text-green-400">
                Redirection vers vos résultats...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
        {/* Indicateur d'étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium
                  ${currentStep >= step
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <ChevronRight className={`
                    mx-2 h-5 w-5
                    ${currentStep > step ? "text-primary" : "text-gray-400"}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className={currentStep >= 1 ? "text-primary" : "text-gray-500"}>
              Sélection classe
            </span>
            <span className={currentStep >= 2 ? "text-primary" : "text-gray-500"}>
              Paiement
            </span>
            <span className={currentStep >= 3 ? "text-primary" : "text-gray-500"}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Contenu des étapes */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Messages d'erreur */}
        {error && (
          <div className="mt-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Boutons de navigation */}
        {currentStep < 3 && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Précédent
            </button>
            
            <button
              onClick={handleNextStep}
              disabled={loading || (currentStep === 1 && !paymentData.classeId)}
              className="inline-flex items-center space-x-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{currentStep === 2 ? "Créer le paiement" : "Suivant"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
