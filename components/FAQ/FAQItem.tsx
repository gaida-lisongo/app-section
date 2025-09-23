import { ProduitWithStatus } from "@/types/etudiant";
import { Section } from "@/types/section";
import { Annee } from "@/app/services/CommandeService";
import Image from "next/image";

const FAQItem = ({ 
  activeFaq, 
  handleFaqToggle, 
  produit 
}: { 
  activeFaq: string, 
  handleFaqToggle: (id: string) => void, 
  produit: ProduitWithStatus 
}) => {
  const { 
    _id,
    designation,
    benefice,
    image,
    montant,
    avantages,
    categorie,
    sectionId,
    anneeId,
    status,
    __v    
   } = produit;

  // Helper functions pour extraire les informations
  const getAnneeInfo = () => {
    if (typeof anneeId === 'object' && anneeId) {
      return `${anneeId.debut}-${anneeId.fin}`;
    }
    return 'Année non définie';
  };

  const getSectionInfo = () => {
    if (typeof sectionId === 'object' && sectionId) {
      return {
        sigle: sectionId.description?.sigle || 'N/A',
        designation: sectionId.description?.designation || 'Section non définie'
      };
    }
    return {
      sigle: 'N/A',
      designation: 'Section non définie'
    };
  };

  const getStatusColor = () => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'NO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'OK':
        return 'Traitée';
      case 'PENDING':
        return 'En attente';
      case 'NO':
        return 'Rejetée';
      default:
        return 'Non défini';
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 h-fit">
      {/* En-tête de la carte */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {image && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={image}
                    alt={designation}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {designation}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {montant.toLocaleString()} FC
                </p>
              </div>
            </div>
          </div>
          
          {/* Badge de statut */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Informations Section et Année */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Section</p>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  {sectionInfo.sigle}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {sectionInfo.designation}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Année académique</p>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  {getAnneeInfo()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Catégories */}
        {categorie && categorie.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categorie.map((cat, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Bouton d'expansion */}
        <button
          onClick={() => handleFaqToggle(_id)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {activeFaq === _id ? 'Masquer les détails' : 'Voir les détails'}
          </span>
          {activeFaq === _id ? (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Contenu étendu */}
      <div className={`border-t border-gray-200 dark:border-gray-700 ${activeFaq === _id ? "block" : "hidden"}`}>
        <div className="p-6">
          {/* Bénéfices */}
          {benefice && benefice.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bénéfices
              </h4>
              <ul className="space-y-2">
                {benefice.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avantages */}
          {avantages && avantages.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Avantages
              </h4>
              <ul className="space-y-2">
                {avantages.map((avantage, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    {avantage}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
