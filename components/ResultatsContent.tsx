'use client';

import React, { useEffect, useState } from 'react';
import { 
  User, 
  BookOpen, 
  BarChart3, 
  Award, 
  TrendingUp,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { NoteTableRow, ResultatResponse, SemestreTableData } from '@/types/resultat';
import NotesDataTable from './NotesDataTable';
import StatistiquesPanel from './StatistiquesPanel';
import { generateValidatedBulletinPDF } from '@/utils/bulletinDocumentGenerator';
import { useSectionStore } from '@/store';
import EtudiantService, { Recours } from '@/app/services/EtudiantService';
import TransactionService from '@/app/services/TransactionService';
import BlobManager from '@/app/services/BlobManager';

interface ResultatsContentProps {
  resultats: ResultatResponse;
  tableData: SemestreTableData[];
  activeSection: string;
  onChangeSection : (section: string) => void;
}

const ResultatsContent: React.FC<ResultatsContentProps> = ({
  resultats,
  tableData,
  activeSection,
  onChangeSection
}) => {
  const { section, fetchSection } = useSectionStore();
  console.log("ResultatsContent: ", tableData);
  const [showRecours, setShowRecours] = useState(false);
  
  // États pour le système de recours
  const [recoursStep, setRecoursStep] = useState(1);
  const [recoursData, setRecoursData] = useState<Partial<Recours>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteTableRow | null>(null);
  const [telephone, setTelephone] = useState('');
  const [objetRecours, setObjetRecours] = useState('');
  const [contenuRecours, setContenuRecours] = useState('');
  const [preuveFile, setPreuveFile] = useState<File | null>(null);
  const [preuveUrl, setPreuveUrl] = useState('');

  useEffect(() => {
    fetchSection();
  }, []);
  const handleGeneratePDF = async () => {
    try {
      // Utiliser des objets simplifiés avec les données disponibles
      const etudiantAdapte = {
        ...resultats.data.etudiant,
        sexe: 'Non spécifié',
        nationalite: 'Non spécifiée',
        lieu_naissance: 'Non spécifié',
        date_naissance: 'Non spécifiée',
        adresse: 'Non spécifiée',
        telephone: 'Non spécifié',
        email: 'Non spécifié'
      } as any;

      const resultatDefaut = {
        _id: 'default',
        montant: 0,
        devise: 'CDF',
        reference: 'N/A',
        status: 'OK'
      } as any;

      const classeDataString = localStorage.getItem('classe-resultat');
      const classeData = classeDataString ? JSON.parse(classeDataString) : null;
      const classeDefaut = classeData || {
        _id: 'default',
        designation: 'Classe non spécifiée',
        description: 'Description non disponible'
      } as any;

      console.log("Section: ", section);

      const sectionDefaut = section || {
        _id: 'default',
        description: {
          designation: 'Section non spécifiée',
          images: []
        }
      } as any;

      // const classeData = localStorage.getItem

      generateValidatedBulletinPDF({
        resultat: resultatDefaut,
        etudiant: etudiantAdapte,
        classe: classeDefaut,
        semestres: resultats.data.semestres || [],
        section: sectionDefaut
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du bulletin PDF. Veuillez réessayer.');
    }
  };

  const renderProfilSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {resultats.data.etudiant.prenom} {resultats.data.etudiant.nom} {resultats.data.etudiant.post_nom}
            </h2>
            <p className="text-lg text-gray-600">Matricule: {resultats.data.etudiant.matricule}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date de consultation</p>
                <p className="font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Semestres évalués</p>
                <p className="font-medium">{resultats.data.semestres.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Statut académique</p>
                <p className="font-medium">Actif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSemestresSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Notes par Semestre</h2>
        <span className="text-sm text-gray-600">{tableData.length} semestre(s)</span>
      </div>
      
      {tableData.map((semestreData, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{semestreData.semestre.designation}</h3>
                <p className="text-gray-600">{semestreData.semestre.description}</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowRecours(!showRecours)}
                  className="text-blue-600 hover:underline"
                >
                 {showRecours ? 'Masquer les recours' : 'Voir les recours'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {semestreData.notes && semestreData.notes.length > 0 ? (
              <NotesDataTable 
                data={semestreData}
                showRecours={showRecours}
                onShowRecours={setShowRecours}
                renderRecours={renderRecours}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune note disponible pour ce semestre</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStatistiquesSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analyse Statistique</h2>
      <StatistiquesPanel 
        semestresData={tableData}
        statistiquesGlobales={resultats.data.statistiques}
      />
    </div>
  );

  // Fonctions pour gérer le recours
  const handleStartRecours = (note: NoteTableRow) => {
    setSelectedNote(note);
    setRecoursStep(1);
    setRecoursData({});
    setTelephone('');
    setObjetRecours('');
    setContenuRecours('');
    setPreuveFile(null);
    setPreuveUrl('');
  };

  const handleStep1Submit = async () => {
    if (!telephone || !objetRecours || !selectedNote) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const etudiantString = localStorage.getItem('etudiant-resultat');
      const etudiant = etudiantString ? JSON.parse(etudiantString) : null;
      
      if (!etudiant) {
        alert('Informations étudiant non trouvées');
        return;
      }

      const response = await TransactionService.createRecours({
        etudiantId: etudiant.id || etudiant._id,
        noteId: selectedNote._id || `${selectedNote.cours}-${selectedNote.unite}`,
        object: objetRecours,
        telephone: telephone
      });

      if (response.success) {
        setRecoursData(response.data);
        setRecoursStep(2);
      } else {
        alert(response.message || 'Erreur lors de la création du recours');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du recours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await BlobManager.createBlob(file, {
        type: 'recours-preuve',
        recoursId: recoursData._id
      });
      
      if (response.url) {
        setPreuveUrl(response.url);
        setPreuveFile(file);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléchargement du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!contenuRecours) {
      alert('Veuillez saisir le contenu du recours');
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier le paiement avec la référence du recours
      const paymentResponse = await TransactionService.checkPayment(recoursData.reference || '');
      console.log("Payment response:", paymentResponse);
      if (paymentResponse.data.data.status == '0') {
        setRecoursStep(3);
      } else {
        alert('Paiement non confirmé. Veuillez effectuer le paiement avant de continuer.');
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      alert('Erreur lors de la vérification du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    setIsLoading(true);
    try {
      const updateData: Partial<Recours> = {
        contenu: contenuRecours.split('\n'),
        preuve: preuveUrl,
        status: 'PENDING'
      };

      const response = await TransactionService.updateRecours(recoursData._id!, updateData);
      
      if (response.success) {
        alert('Recours soumis avec succès ! Vous recevrez une réponse dans les plus brefs délais.');
        setShowRecours(false);
        setRecoursStep(1);
      } else {
        alert(response.message || 'Erreur lors de la soumission du recours');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission du recours');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecours = (note: NoteTableRow) => {
    console.log("Note", note);
    if (!selectedNote) {
      handleStartRecours(note);
    }

    const objetOptions = ["Manque de cote", "Erreur de Transmission", "Erreur de Calcul"];

    return (
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recours sur Note</h2>
            <p className="text-gray-600">
              Cours: {selectedNote?.cours} - {selectedNote?.unite}
            </p>
          </div>
          <button
            onClick={() => setShowRecours(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === recoursStep ? 'bg-blue-600 text-white' :
                step < recoursStep ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < recoursStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Informations de base */}
        {recoursStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Étape 1: Informations de base</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+243 XXX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objet du recours *
                </label>
                <select
                  value={objetRecours}
                  onChange={(e) => setObjetRecours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez un objet</option>
                  {objetOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleStep1Submit}
                disabled={isLoading || !telephone || !objetRecours}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Création...' : 'Suivant'}
              </button>
            </div>
          </div>
        )}

        {/* Étape 2: Preuve et contenu */}
        {recoursStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Étape 2: Preuve et contenu</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Référence du recours:</strong> {recoursData.reference}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Utilisez cette référence pour effectuer le paiement des frais de recours.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document de preuve (optionnel)
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {preuveFile && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier téléchargé: {preuveFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu du recours *
              </label>
              <textarea
                value={contenuRecours}
                onChange={(e) => setContenuRecours(e.target.value)}
                placeholder="Décrivez en détail les raisons de votre recours..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setRecoursStep(1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={handleStep2Submit}
                disabled={isLoading || !contenuRecours}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Vérification...' : 'Vérifier le paiement'}
              </button>
            </div>
          </div>
        )}

        {/* Étape 3: Confirmation */}
        {recoursStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Étape 3: Confirmation</h3>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Paiement confirmé ! Vous pouvez maintenant finaliser votre recours.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Résumé du recours:</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p><strong>Objet:</strong> {objetRecours}</p>
                  <p><strong>Téléphone:</strong> {telephone}</p>
                  <p><strong>Référence:</strong> {recoursData.reference}</p>
                  {preuveFile && <p><strong>Preuve:</strong> {preuveFile.name}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Contenu:</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{contenuRecours}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setRecoursStep(2)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={handleStep3Submit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Soumission...' : 'Confirmer le recours'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEvolutionSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Évolution Académique</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Progression par Semestre</h3>
        </div>
        
        <div className="space-y-4">
          {tableData.map((semestre, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{semestre.semestre.designation}</h4>
                <p className="text-sm text-gray-600">
                  {semestre.notes ? semestre.notes.length : 0} cours
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {semestre.statistiques.moyenneGenerale}/20
                </div>
                <div className="text-sm text-gray-600">
                  {semestre.statistiques.pourcentageReussite}% réussite
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSyntheseSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Synthèse Académique</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(resultats.data.statistiques.moyenneGenerale || 0).toFixed(2)}
          </div>
          <p className="text-gray-600">Moyenne Générale</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {(resultats.data.statistiques.pourcentageReussite || 0).toFixed(1)}%
          </div>
          <p className="text-gray-600">Taux de Réussite</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {resultats.data.statistiques.nombreCoursValides || 0}
          </div>
          <p className="text-gray-600">Cours Validés</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {resultats.data.statistiques.creditsValides || 0}
          </div>
          <p className="text-gray-600">Crédits Validés</p>
        </div>
      </div>
    </div>
  );

  const renderExportSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Télécharger le Bulletin</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Bulletin Officiel PDF</h3>
        <p className="text-gray-600 mb-6">
          Téléchargez votre bulletin de notes officiel au format PDF
        </p>
        
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Télécharger le PDF
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profil':
        return renderProfilSection();
      case 'semestres':
        return renderSemestresSection();
      case 'statistiques':
        return renderStatistiquesSection();
      case 'evolution':
        return renderEvolutionSection();
      case 'synthese':
        return renderSyntheseSection();
      case 'export':
        return renderExportSection();
      default:
        return renderProfilSection();
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default ResultatsContent;
