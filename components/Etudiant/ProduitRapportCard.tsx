'use client';

import React, { useState, useRef } from 'react';
import { ProduitWithStatus } from '@/types/etudiant';
import { Upload, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import BlobManager from '@/app/services/BlobManager';
import EtudiantService from '@/app/services/EtudiantService';

interface ProduitRapportCardProps {
  produit: ProduitWithStatus;
  etudiantId: string;
  hasExistingRapport: boolean;
  onRapportSubmitted: () => void;
}

const ProduitRapportCard: React.FC<ProduitRapportCardProps> = ({
  produit,
  etudiantId,
  hasExistingRapport,
  onRapportSubmitted
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'NO': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OK': return 'Validé';
      case 'PENDING': return 'En attente';
      case 'NO': return 'Non validé';
      default: return 'Inconnu';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF uniquement.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 10MB.');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!uploadedFile) {
      alert('Veuillez sélectionner un fichier PDF.');
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadResult = await BlobManager.createBlob(uploadedFile, {
        type: produit.categorie[0],
        productId: produit._id,
        etudiantId: etudiantId,
        originalName: uploadedFile.name
      });

      if (!uploadResult.url) {
        throw new Error('Erreur lors de l\'upload');
      }

      const rapportResult = await EtudiantService.createRapport({
        document: uploadResult.url,
        type: produit.categorie[0],
        productId: produit._id,
        etudiantId: etudiantId
      });

      if (rapportResult.success) {
        alert('Rapport soumis avec succès !');
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onRapportSubmitted();
      } else {
        throw new Error(rapportResult.message || 'Erreur lors de la création du rapport');
      }

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission du rapport');
    } finally {
      setIsUploading(false);
    }
  };

  console.log("Status rapport : ", hasExistingRapport)
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{produit.designation}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getStatusColor(produit.status)}`}>
              {getStatusText(produit.status)}
            </span>
            {hasExistingRapport && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Rapport soumis
              </span>
            )}
          </div>
        </div>
        {produit.image && (
          <img 
            src={produit.image} 
            alt={produit.designation}
            className="w-12 h-12 rounded object-cover"
          />
        )}
      </div>

      {/* Type de produit */}
      {
        produit.categorie && produit.categorie.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Type de produit :</h4>
            <span className="text-sm text-gray-600">{produit.categorie[0].toUpperCase()}</span>
          </div>
        )
      }
      

      {/* Caractéristiques */}
      {produit.caracteristiques && produit.caracteristiques.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Caractéristiques :</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {produit.caracteristiques.slice(0, 3).map((carac, index) => (
              <li key={index}>• {carac}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Montant */}
      {produit.montant && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-700">Montant : </span>
          <span className="font-bold text-blue-600">{produit.montant.toLocaleString()} FC</span>
        </div>
      )}

      {/* Section de soumission */}
      {!hasExistingRapport ? (
        <div className="border-t pt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploadedFile && (
            <div className="mb-2 p-2 bg-blue-50 rounded text-sm">
              <FileText className="w-4 h-4 inline mr-1" />
              {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 inline mr-1" />
              {uploadedFile ? 'Changer' : 'Sélectionner PDF'}
            </button>

            {uploadedFile && (
              <button
                onClick={handleUploadAndSubmit}
                disabled={isUploading}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 inline mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Soumettre
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">PDF uniquement, max 10MB</p>
        </div>
      ) : (
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Rapport déjà soumis</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitRapportCard;
