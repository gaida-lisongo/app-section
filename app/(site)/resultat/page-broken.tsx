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

const ResultatPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultats, setResultats] = useState<ResultatResponse | null>(null);
  const [activeSection, setActiveSection] = useState('profil');

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
    console.log("Matricule :", matriculeFromUrl);
    if (matriculeFromUrl) {
      setMatricule(matriculeFromUrl);
      // Lancer automatiquement la recherche
      handleSearchWithMatricule(matriculeFromUrl);
    }
  }, []);

  // Fonction pour transformer les données en format table
  const transformToTableData = (data: ResultatResponse): SemestreTableData[] => {
    return data.data.semestres.map(semestre => {
      const notes: NoteTableRow[] = [];
      let totalCredits = 0;
      let creditsValides = 0;
      let nombreCours = 0;

      semestre.unites.forEach(unite => {
        unite.cours.forEach(cours => {
          cours.notes.forEach(note => {
            const status = note.moyenne >= 10 ? 'VALIDÉ' : 'ÉCHEC';
            
            notes.push({
              cours: cours.titre,
              unite: `${unite.code} - ${unite.designation}`,
              cmi: note.cmi,
{{ ... }}
          </div>
        })

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
