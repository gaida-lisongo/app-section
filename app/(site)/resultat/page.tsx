'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EtudiantService from '@/app/services/EtudiantService';
import { ResultatResponse, SemestreTableData, NoteTableRow } from '@/types/resultat';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ResultatsSidebar from '../../../components/ResultatsSidebar';
import ResultatsContent from '../../../components/ResultatsContent';
import PaymentProtection from '../../../components/Payment/PaymentProtection';

const ResultatPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultats, setResultats] = useState<ResultatResponse | null>(null);
  const [activeSection, setActiveSection] = useState('profil');
  const [orderNumber, setOrderNumber] = useState('');
  // Fonction pour rechercher avec un matricule spécifique
  const handleSearchWithMatricule = async (matriculeToSearch: string) => {
    if (!matriculeToSearch.trim()) {
      setError('Veuillez saisir un matricule');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await EtudiantService.checkMatricule(matriculeToSearch.trim());
      
      if (response.success) {
        setResultats(response);
      } else {
        setError(response.message || 'Aucun résultat trouvé pour ce matricule');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Erreur lors de la recherche des résultats. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer le matricule depuis l'URL et lancer automatiquement la recherche
  useEffect(() => {
    const matriculeFromUrl = searchParams.get('matricule');
    const orderNumberFromUrl = searchParams.get('orderNumber');
    console.log("Matricule :", matriculeFromUrl);
    console.log("Order Number :", orderNumberFromUrl);
    if (matriculeFromUrl) {
      setMatricule(matriculeFromUrl);
      // Lancer automatiquement la recherche
      handleSearchWithMatricule(matriculeFromUrl);
    }

    if (orderNumberFromUrl) {
      setOrderNumber(orderNumberFromUrl);
    }
  }, []);

  // Fonction pour transformer les données en format table
  const transformToTableData = (data: ResultatResponse): SemestreTableData[] => {
    return data.data.semestres.map(semestre => {
      const notes: NoteTableRow[] = [];
      let totalCredits = 0;
      let creditsValides = 0;
      let totalMoyenne = 0;
      let nombreCours = 0;

      semestre.unites.forEach(unite => {
        unite.cours.forEach(cours => {
          cours.notes.forEach(note => {
            const status = note.moyenne >= 10 ? 'VALIDÉ' : 'ÉCHEC';
            
            notes.push({
              _id: note._id,
              cours: cours.titre,
              unite: `${unite.code} - ${unite.designation}`,
              cmi: note.cmi,
              examen: note.examen,
              rattrapage: note.rattrapage,
              moyenne: note.moyenne,
              credit: cours.credit,
              status,
              annee: note.anneeId
            });

            totalCredits += cours.credit;
            if (status === 'VALIDÉ') {
              creditsValides += cours.credit;
            }
            totalMoyenne += note.moyenne;
            nombreCours++;
          });
        });
      });

      const moyenneGenerale = nombreCours > 0 ? totalMoyenne / nombreCours : 0;
      const pourcentageReussite = totalCredits > 0 ? (creditsValides / totalCredits) * 100 : 0;
      
      return {
        semestre,
        notes,
        statistiques: {
          totalCredits,
          creditsValides,
          moyenneGenerale,
          pourcentageReussite
        }
      };
    });
  };

  const handleSearch = async () => {
    await handleSearchWithMatricule(matricule);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Si on a des résultats, afficher la vue complète avec sidebar
  if (resultats) {
    const tableData = transformToTableData(resultats);
    
    return (
      <PaymentProtection matricule={matricule} orderNumber={orderNumber}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <ResultatsSidebar 
            resultats={resultats}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col">
            {/* Header avec bouton retour */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setResultats(null);
                    setActiveSection('profil');
                    setError(null);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Nouvelle recherche</span>
                </button>
                
                <div className="text-right">
                  <h1 className="text-xl font-bold text-gray-900">
                    Bulletin de {resultats.data.etudiant.prenom} {resultats.data.etudiant.nom}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Matricule: {resultats.data.etudiant.matricule}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contenu */}
            <ResultatsContent 
              resultats={resultats}
              tableData={tableData}
              activeSection={activeSection}
              onChangeSection={setActiveSection}
            />
          </div>
        </div>
      </PaymentProtection>
    );
  }

  // Vue de recherche
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consultation des Résultats
          </h1>
          <p className="text-gray-600">
            Saisissez votre matricule pour consulter vos notes
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Recherche par Matricule</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
                Matricule
              </label>
              <input
                type="text"
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Ex: GEN20258095"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isLoading || !matricule.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Recherche...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}


        {/* Loader */}
        {isLoading && (
          <div className="mt-6">
            <LoadingSpinner message="Recherche en cours..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultatPage;
