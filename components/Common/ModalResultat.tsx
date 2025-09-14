import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PDFGeneratorPdfMake } from "../../utils/PDFGeneratorPdfMake";

interface EtudiantResultat {
  matricule: string;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  nationalite: string;
  lieu_naissance: string;
  date_naissance: string | Date;
  photo?: string;
  documents?: string[];
  sectionId?: string;
  _id?: string;
}

interface Section {
  _id: string;
  description: {
    sigle: string;
    designation: string;
    devise: string;
    objectif: string;
    images: string[];
    motChef: {
      photo: string;
      description: string;
    };
  };
  contact: {
    addresse: string;
    telephone: string;
    email: string;
    www: string;
  };
}

interface ModalResultatProps {
  isOpen: boolean;
  onClose: () => void;
  etudiant: EtudiantResultat;
  section?: Section;
}

export const ModalResultat = ({ isOpen, onClose, etudiant, section }: ModalResultatProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfGenerator = new PDFGeneratorPdfMake();
      await pdfGenerator.generateInscriptionPDF(etudiant, section);
      
      alert('🎉 PDF généré et téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* En-tête */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">🎉 Inscription Réussie !</h2>
                  <p className="text-blue-100 mt-2">Votre inscription a été enregistrée avec succès</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Matricule en vedette */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Numéro de matricule
                    </p>
                    <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                      {etudiant.matricule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations de l'étudiant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                    👤 Informations personnelles
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {etudiant.nom} {etudiant.post_nom} {etudiant.prenom}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sexe</label>
                      <p className="text-gray-900 dark:text-white">
                        {etudiant.sexe === 'M' ? '👨 Masculin' : '👩 Féminin'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nationalité</label>
                      <p className="text-gray-900 dark:text-white">🌍 {etudiant.nationalite}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                    🏫 Section & Naissance
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Section</label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {section?.description?.designation || 'Non spécifiée'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lieu de naissance</label>
                      <p className="text-gray-900 dark:text-white">📍 {etudiant.lieu_naissance}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de naissance</label>
                      <p className="text-gray-900 dark:text-white">
                        📅 {new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {etudiant.documents && etudiant.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 mb-4">
                    📄 Documents fournis
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {etudiant.documents.map((_, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        ✅ Document {index + 1}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-dark hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Génération...
                    </>
                  ) : (
                    <>
                      📄 Télécharger la fiche PDF
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Conseil :</strong> Conservez précieusement votre numéro de matricule <strong>{etudiant.matricule}</strong>. 
                  Vous en aurez besoin pour toutes vos démarches administratives.
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  📋 Téléchargez votre fiche d'inscription officielle en PDF pour vos dossiers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};