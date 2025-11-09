"use client";

import { CheckCircle2, Clock, CreditCard, Calendar, AlertCircle } from "lucide-react";

const ResolutionChecking = ({
    status,
    amount,
    amountCustomer,
    currency,
    createdAt,
    onClick
}: {
    status: string,
    amount: number,
    amountCustomer: number,
    currency: string,
    createdAt: string,
    onClick: () => void
}) => {
    const isSuccess = status === '0';
    
    // Formater la date depuis le format "DD-MM-YYYY HH:mm:ss"
    const formatDate = (dateString: string) => {
        try {
            // Format: "09-11-2025 14:45:50"
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');
            
            const date = new Date(
                parseInt(year),
                parseInt(month) - 1, // Les mois commencent à 0
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );
            
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Statut de la transaction - Conditionnel vert/jaune */}
            <div className={`rounded-xl p-4 sm:p-5 border-2 ${
                isSuccess 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-700'
                    : 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-700'
            }`}>
                <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`flex-shrink-0 p-2 sm:p-2.5 rounded-full ${
                        isSuccess 
                            ? 'bg-green-500 dark:bg-green-600'
                            : 'bg-yellow-500 dark:bg-yellow-600'
                    }`}>
                        {isSuccess ? (
                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        ) : (
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base sm:text-lg mb-1 ${
                            isSuccess 
                                ? 'text-green-900 dark:text-green-200'
                                : 'text-yellow-900 dark:text-yellow-200'
                        }`}>
                            {isSuccess ? 'Paiement confirmé !' : 'Paiement en attente'}
                        </h3>
                        <p className={`text-sm sm:text-base ${
                            isSuccess 
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-yellow-700 dark:text-yellow-300'
                        }`}>
                            {isSuccess 
                                ? 'Votre paiement a été validé avec succès. Vous pouvez maintenant passer à l\'étape suivante.'
                                : 'Votre paiement est en cours de traitement. Veuillez patienter quelques instants puis vérifier à nouveau.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Détails de la transaction - Mobile first avec style conditionnel */}
            <div className={`rounded-xl overflow-hidden border-2 ${
                isSuccess 
                    ? 'bg-white dark:bg-blacksection border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-blacksection border-yellow-200 dark:border-yellow-800'
            }`}>
                <div className={`px-4 py-3 border-b ${
                    isSuccess
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}>
                    <h4 className={`font-semibold text-sm sm:text-base flex items-center ${
                        isSuccess
                            ? 'text-green-900 dark:text-green-200'
                            : 'text-yellow-900 dark:text-yellow-200'
                    }`}>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Détails de la transaction
                    </h4>
                </div>
                
                <div className="p-4 sm:p-5 space-y-4">
                    {/* Montant */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                            Montant
                        </span>
                        <div className="text-right">
                            <div className={`text-lg sm:text-xl font-bold ${
                                isSuccess
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                                {amount ? amount.toLocaleString() : '0'} <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">{currency || 'CDF'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Montant client */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                            Montant payé
                        </span>
                        <div className="text-right">
                            <div className={`text-lg sm:text-xl font-bold ${
                                isSuccess
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                                {amountCustomer ? amountCustomer.toLocaleString() : '0'} <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">{currency || 'CDF'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start justify-between py-2">
                        <div className="flex items-center space-x-2">
                            <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                                isSuccess ? 'text-green-500' : 'text-yellow-500'
                            }`} />
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                                Date
                            </span>
                        </div>
                        <div className="text-right ml-2">
                            <div className={`text-sm sm:text-base font-medium ${
                                isSuccess
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                                {createdAt ? formatDate(createdAt) : 'Non disponible'}
                            </div>
                        </div>
                    </div>

                    {/* Statut badge */}
                    <div className="flex items-center justify-between py-2 pt-4 border-t border-gray-200 dark:border-strokedark">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                            Statut
                        </span>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                            isSuccess
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                            {isSuccess ? (
                                <>
                                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                                    Confirmé
                                </>
                            ) : (
                                <>
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                                    En attente
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Instructions conditionnelles */}
            {!isSuccess && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm sm:text-base mb-2">
                                Que faire maintenant ?
                            </h5>
                            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                                <li>Assurez-vous d'avoir complété le paiement sur votre téléphone</li>
                                <li>Attendez quelques secondes (le traitement peut prendre 10-30 secondes)</li>
                                <li>Cliquez sur le bouton "Vérifier à nouveau" ci-dessous</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton de vérification - Mobile optimized */}
            {!isSuccess && (
                <button
                    onClick={onClick}
                    className="w-full py-3.5 sm:py-3 px-4 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold rounded-lg
                        transition-all duration-200
                        flex items-center justify-center space-x-2
                        text-base sm:text-sm
                        shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30"
                >
                    <Clock className="w-5 h-5" />
                    <span>Vérifier à nouveau</span>
                </button>
            )}

            {/* Message de succès */}
            {isSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm sm:text-base text-green-800 dark:text-green-300">
                                <strong className="font-semibold">Parfait !</strong> Votre paiement est validé. 
                                Cliquez sur "Continuer" pour passer à l'étape de soumission de votre résolution.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResolutionChecking;
