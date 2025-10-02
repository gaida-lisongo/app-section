"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TransactionService from '@/app/services/TransactionService';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PaymentProtectionProps {
  children: React.ReactNode;
  matricule?: string;
  orderNumber?: string;
}

const PaymentProtection = ({ children, matricule, orderNumber }: PaymentProtectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mesage, setMesage] = useState<string | null>("Vérification en cours...");

  const matriculeToCheck = searchParams.get('matricule');

  useEffect(() => {
    const verifyPaymentAccess = async () => {
      if (!orderNumber) {
        router.push('/payment');
        return;
      }

      try {
        setIsVerifying(true);
        setError(null);

        // Vérifier le statut du paiement
        const response = await TransactionService.checkPayment(orderNumber);
        console.log("==========CHECKING PAYMENT STATUS==========", response);
        if (response.data.data.status === '0') {
          setHasAccess(true);
          setMesage("Accès autorisé");
        } else {
          setMesage("Accès non autorisé");
          // Rediriger vers la page de paiement si pas d'accès
          setTimeout(() => {
            router.push(`/payment?matricule=${matriculeToCheck}`);
          }, 3000);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
        setError('Erreur lors de la vérification du paiement');
        // En cas d'erreur, rediriger vers la page de paiement
        setTimeout(() => {
          router.push(`/payment?matricule=${matriculeToCheck}`);
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentAccess();
  }, [matriculeToCheck, router]);

  // Affichage pendant la vérification
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Vérification en cours...
          </h2>
          <p className="text-gray-600">
            {mesage}
          </p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Erreur de vérification
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirection vers la page de paiement...
          </p>
        </div>
      </div>
    );
  }

  // Si l'accès est vérifié, afficher le contenu protégé
  if (hasAccess) {
    return <>{children}</>;
  }

  // Fallback - ne devrait pas être atteint
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
        <div className="mb-6">
          <CreditCard className="h-12 w-12 text-yellow-500 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Accès non autorisé
        </h2>
        <p className="text-gray-600 mb-6">
          Vous devez effectuer un paiement pour accéder aux résultats.
        </p>
        <button
          onClick={() => router.push(`/payment?matricule=${matriculeToCheck}`)}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Effectuer le paiement
        </button>
      </div>
    </div>
  );
};

export default PaymentProtection;
