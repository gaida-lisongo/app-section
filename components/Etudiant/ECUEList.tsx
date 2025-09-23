"use client";

import React, { useState, useMemo } from 'react';
import { Semestre, Cours, FicheCotation } from '@/types/etudiant';
import { 
  BookOpen, 
  Search,
  Filter,
  CheckCircle, 
  AlertCircle,
  XCircle,
  Eye,
  Calendar,
  GraduationCap,
  ChevronDown,
  Clock,
  Users,
  Target
} from 'lucide-react';
import ECDetail from './ECDetail';

interface CoursInscrit {
  cours: Cours;
  semestre: string;
  semestreId: string;
  unite: string;
  uniteId: string;
  ficheCotation: FicheCotation;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ECUEListProps {
  semestres: Semestre[];
}

const ECUEList: React.FC<ECUEListProps> = ({ semestres } : ECUEListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState<string>('all');
  const [selectedUnite, setSelectedUnite] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCours, setSelectedCours] = useState<CoursInscrit | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Extraire tous les cours auxquels l'étudiant est inscrit (avec fiche de cotation)
  const coursInscrits = useMemo(() => {
    const cours: CoursInscrit[] = [];
    
    semestres.forEach(semestre => {
      semestre.unites.forEach(unite => {
        unite.cours.forEach(coursItem => {
          if (coursItem.fiche_cotation) {
            cours.push({
              cours: coursItem,
              semestre: semestre.designation,
              semestreId: semestre._id,
              unite: unite.descripteur.designation,
              uniteId: unite._id,
              ficheCotation: coursItem.fiche_cotation,
              status: coursItem.fiche_cotation.status
            });
          }
        });
      });
    });
    
    return cours;
  }, [semestres]);

  // Extraire les options de filtrage (sans doublons)
  const semestresOptions = useMemo(() => {
    const uniqueSemestres = Array.from(
      new Map(coursInscrits.map(c => [c.semestreId, { id: c.semestreId, designation: c.semestre }])).values()
    );
    return uniqueSemestres;
  }, [coursInscrits]);

  const unitesOptions = useMemo(() => {
    const uniqueUnites = Array.from(
      new Map(coursInscrits.map(c => [c.uniteId, { id: c.uniteId, designation: c.unite }])).values()
    );
    return uniqueUnites;
  }, [coursInscrits]);

  // Filtrer les cours selon les critères
  const filteredCours = useMemo(() => {
    return coursInscrits.filter(coursInscrit => {
      const matchesSearch = searchTerm === '' || 
        coursInscrit.cours.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coursInscrit.cours.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coursInscrit.semestre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coursInscrit.unite.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSemestre = selectedSemestre === 'all' || coursInscrit.semestreId === selectedSemestre;
      const matchesUnite = selectedUnite === 'all' || coursInscrit.uniteId === selectedUnite;
      const matchesStatus = selectedStatus === 'all' || coursInscrit.status === selectedStatus;

      return matchesSearch && matchesSemestre && matchesUnite && matchesStatus;
    });
  }, [coursInscrits, searchTerm, selectedSemestre, selectedUnite, selectedStatus]);

  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />En attente</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejeté</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSemestre('all');
    setSelectedUnite('all');
    setSelectedStatus('all');
  };

  const handleViewCours = (coursInscrit: CoursInscrit) => {
    setSelectedCours(coursInscrit);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedCours(null);
  };

  console.log("Data semestres student :", semestres);
  console.log("Cours inscrits :", coursInscrits);
  console.log("Cours filtrés :", filteredCours);

  // Si on affiche le détail d'un cours
  if (showDetail && selectedCours) {
    return (
      <ECDetail
        cours={selectedCours.cours}
        semestre={selectedCours.semestre}
        unite={selectedCours.unite}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold dark:text-white">{coursInscrits.length}</div>
                <div className="text-sm text-gray-500">Total ECUE</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold dark:text-white">
                  {coursInscrits.filter(c => c.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Approuvés</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold dark:text-white">
                  {coursInscrits.filter(c => c.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold dark:text-white">
                  {coursInscrits.reduce((total, c) => total + c.cours.credit, 0)}
                </div>
                <div className="text-sm text-gray-500">Crédits totaux</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
        <div className="p-6 border-b border-gray-200 dark:border-strokedark">
          <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <Filter className="w-5 h-5" />
            Filtres et Recherche
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Recherchez et filtrez vos ECUE par semestre, unité d'enseignement ou statut
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-blacksection dark:border-strokedark dark:text-white"
              />
            </div>

            {/* Filtre par semestre */}
            <div className="relative">
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white dark:bg-blacksection dark:border-strokedark dark:text-white"
              >
                <option value="all">Tous les semestres</option>
                {semestresOptions.map(semestre => (
                  <option key={semestre.id} value={semestre.id}>
                    {semestre.designation}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filtre par unité */}
            <div className="relative">
              <select
                value={selectedUnite}
                onChange={(e) => setSelectedUnite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white dark:bg-blacksection dark:border-strokedark dark:text-white"
              >
                <option value="all">Toutes les unités</option>
                {unitesOptions.map(unite => (
                  <option key={unite.id} value={unite.id}>
                    {unite.designation}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filtre par statut */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white dark:bg-blacksection dark:border-strokedark dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="APPROVED">Approuvé</option>
                <option value="PENDING">En attente</option>
                <option value="REJECTED">Rejeté</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Bouton reset */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800 dark:text-white"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-blacksection dark:border-strokedark">
        <div className="p-6 border-b border-gray-200 dark:border-strokedark">
          <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <BookOpen className="w-5 h-5" />
            Liste des ECUE ({filteredCours.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Éléments Constitutifs d'Unités d'Enseignement auxquels vous êtes inscrit
          </p>
        </div>
        <div className="p-6">
          {filteredCours.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {coursInscrits.length === 0 
                  ? "Aucun cours inscrit trouvé" 
                  : "Aucun cours ne correspond aux critères"
                }
              </h3>
              <p className="text-sm">
                {coursInscrits.length === 0 
                  ? "Les cours apparaîtront ici une fois que vous aurez des fiches de cotation"
                  : "Essayez de modifier vos critères de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCours.map((coursInscrit, index) => (
                <div 
                  key={`${coursInscrit.cours._id}-${index}`} 
                  className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewCours(coursInscrit)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {coursInscrit.cours.titre}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {coursInscrit.cours.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{coursInscrit.semestre}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>{coursInscrit.unite}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{coursInscrit.cours.credit} crédits</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 ml-6">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{coursInscrit.cours.seances?.length || 0}</div>
                          <div className="text-xs text-gray-500">Séances</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{coursInscrit.cours.travaux?.length || 0}</div>
                          <div className="text-xs text-gray-500">Travaux</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">{coursInscrit.cours.ressources?.length || 0}</div>
                          <div className="text-xs text-gray-500">Ressources</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-strokedark">
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(coursInscrit.status)}
                        {coursInscrit.ficheCotation.reference && (
                          <span className="text-xs text-gray-500">
                            Réf: {coursInscrit.ficheCotation.reference}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCours(coursInscrit);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ECUEList;
