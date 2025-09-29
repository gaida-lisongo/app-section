'use client';

import React, { useState } from 'react';
import { X, Download, FileText, BarChart3, GraduationCap, Calendar } from 'lucide-react';
import { NoteTableRow, ResultatResponse, SemestreTableData } from '@/types/resultat';
import NotesDataTable from '@/components/NotesDataTable';
import StatistiquesPanel from '@/components/StatistiquesPanel';
import { generateBulletinPDF } from '@/utils/bulletinDocumentGenerator';
import { useSectionStore } from '@/store';

interface ResultatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultats: ResultatResponse;
  tableData: SemestreTableData[];
}

const ResultatsModal: React.FC<ResultatsModalProps> = ({
  isOpen,
  onClose,
  resultats,
  tableData
}) => {
  const [activeTab, setActiveTab] = useState('semestres');
  const [selectedSemestre, setSelectedSemestre] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { section } = useSectionStore();

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'semestres',
      label: 'Semestres',
      icon: GraduationCap,
      description: 'Notes par semestre'
    },
    {
      id: 'statistiques',
      label: 'Statistiques',
      icon: BarChart3,
      description: 'Analyse des performances'
    },
    {
      id: 'synthese',
      label: 'Synthèse',
      icon: Calendar,
      description: 'Vue d\'ensemble'
    }
  ];

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (section) {
        // Créer un objet resultat minimal pour la génération PDF
        const resultat = {
          _id: 'temp-id',
          status: 'OK' as const,
          reference: `PDF-${Date.now()}`
        };

        // Créer un objet classe minimal basé sur les données disponibles
        const classe = {
          _id: section._id || 'temp-classe-id',
          designation: section.description?.designation || 'Classe Non Spécifiée',
          description: section.description?.objectif || 'Description non disponible',
          semestres: tableData.map(data => data.semestre._id)
        };

        // Convertir les tableData en SemestreResultat[]
        const semestres = tableData.map(data => data.semestre);

        // Créer un objet Etudiant compatible à partir d'EtudiantInfo
        const etudiant = {
          ...resultats.data.etudiant,
          sexe: 'M' as const, // Valeur par défaut
          nationalite: 'Congolaise',
          lieu_naissance: 'Non spécifié',
          date_naissance: '1990-01-01',
          sectionId: section._id,
          anneeId: '',
          secure: '',
          documents: [],
          photo: '',
          semestres: [],
          __v: 0,
          solde: 0
        };

        await generateBulletinPDF(
          resultat,
          etudiant,
          classe,
          semestres,
          section
        );
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du bulletin PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getSemestreData = (semestreId: string) => {
    return tableData.find(data => data.semestre._id === semestreId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Résultats Académiques
              </h2>
              <div className="text-blue-100">
                <p className="text-lg">
                  {resultats.data.etudiant.prenom} {resultats.data.etudiant.nom} {resultats.data.etudiant.post_nom}
                </p>
                <p className="text-sm opacity-90">
                  Matricule: {resultats.data.etudiant.matricule}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Bulletin PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    <span className="text-xs opacity-75">{tab.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'semestres' && (
            <div className="space-y-6">
              {/* Sélecteur de semestre */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Sélectionnez un semestre
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tableData.map((data) => (
                    <button
                      key={data.semestre._id}
                      onClick={() => setSelectedSemestre(
                        selectedSemestre === data.semestre._id ? null : data.semestre._id
                      )}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedSemestre === data.semestre._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-medium text-gray-800">
                        {data.semestre.designation}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {data?.notes?.length} cours • {data.statistiques.creditsValides}/{data.statistiques.totalCredits} crédits
                      </div>
                      <div className="text-sm text-blue-600 mt-1">
                        Moyenne: {data.statistiques.moyenneGenerale.toFixed(2)}/20
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Table des notes pour le semestre sélectionné */}
              {selectedSemestre && (
                <div>
                  <NotesDataTable 
                    data={getSemestreData(selectedSemestre)!}
                    showRecours={false}
                    onShowRecours={(showRecours: boolean) => console.log(showRecours)}
                    renderRecours={(note: NoteTableRow) => <div>{note._id}</div>}
                  />
                </div>
              )}

              {!selectedSemestre && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un semestre pour voir les détails des notes</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'statistiques' && (
            <StatistiquesPanel 
              statistiquesGlobales={resultats.data.statistiques}
              semestresData={tableData}
            />
          )}

          {activeTab === 'synthese' && (
            <div className="space-y-6">
              {/* Résumé global */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Synthèse Académique
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {resultats.data.statistiques.nombreCours}
                    </div>
                    <div className="text-sm text-gray-600">Cours Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {resultats.data.statistiques.nombreCoursValides}
                    </div>
                    <div className="text-sm text-gray-600">Cours Validés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {resultats.data.statistiques.totalCredits}
                    </div>
                    <div className="text-sm text-gray-600">Crédits Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {resultats.data.statistiques.moyenneGenerale.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Moyenne Générale</div>
                  </div>
                </div>
              </div>

              {/* Liste des semestres avec résumé */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Résumé par Semestre
                </h3>
                {tableData.map((data) => (
                  <div key={data.semestre._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {data.semestre.designation}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {data.semestre.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {data.statistiques.moyenneGenerale.toFixed(2)}/20
                        </div>
                        <div className="text-sm text-gray-500">Moyenne</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Cours:</span>
                        <span className="ml-2 font-medium">{data.notes?.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Crédits:</span>
                        <span className="ml-2 font-medium">
                          {data.statistiques.creditsValides}/{data.statistiques.totalCredits}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Réussite:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {data.statistiques.pourcentageReussite.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultatsModal;
