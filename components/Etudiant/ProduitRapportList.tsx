'use client';

import React, { useState, useEffect } from 'react';
import { ProduitWithStatus } from '@/types/etudiant';
import ProduitRapportCard from './ProduitRapportCard';
import EtudiantService from '@/app/services/EtudiantService';
import SectionLoader from '../Common/SectionLoader';
import { Produit } from '@/app/services/ProduitService';

interface ProduitRapportListProps {
  produits: ProduitWithStatus[];
  etudiantId: string;
}

interface RapportData {
  produitId: Produit;
  document: string;
  type: string;
  createdAt: string;
}

const ProduitRapportList: React.FC<ProduitRapportListProps> = ({
  produits,
  etudiantId
}) => {
  const [rapportsExistants, setRapportsExistants] = useState<RapportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRapports = async () => {
      if (!etudiantId) return;

      try {
        const response = await EtudiantService.fetchRapport(etudiantId);

        if (response.success && response.data) {
          const rapports = Array.isArray(response.data) ? response.data : [response.data];
          
          setRapportsExistants(rapports);
        } else {
          setRapportsExistants([]);
        }
      } catch (error) {
        setRapportsExistants([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRapports();
  }, [etudiantId]);

  const hasExistingRapport = (productId: string): boolean => {
    return rapportsExistants.some(rapport => rapport.produitId?._id === productId);
  };

  const handleRapportSubmitted = async () => {
    try {
      const response = await EtudiantService.fetchRapport(etudiantId);
      if (response.success && response.data) {
        const rapports = Array.isArray(response.data) ? response.data : [response.data];
        setRapportsExistants(rapports);
      }
    } catch (error) {
      console.error('Erreur rechargement rapports:', error);
    }
  };

  if (isLoading) {
    return <SectionLoader
      title="Chargement des rapports..."
      subtitle="Récupération des informations..."
     />;
  }

  // Filtrer les doublons par ID
  const uniqueProduits = produits.filter((produit, index, self) => 
    index === self.findIndex(p => p._id === produit._id)
  );

  if (uniqueProduits.length === 0) {
    return <div className="text-center py-8">Aucun produit disponible.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueProduits.map((produit) => (
        <ProduitRapportCard
          key={produit._id}
          produit={produit}
          etudiantId={etudiantId}
          hasExistingRapport={hasExistingRapport(produit._id)}
          onRapportSubmitted={handleRapportSubmitted}
        />
      ))}
    </div>
  );
};

export default ProduitRapportList;
