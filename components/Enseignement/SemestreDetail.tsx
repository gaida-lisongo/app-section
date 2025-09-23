"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SemestreWithUnites, UniteDetails } from '@/app/services/SemestreService';
import ProduitService, { ProduitWithDetails } from '@/app/services/ProduitService';
import { useSectionStore, useAnneeStore } from '@/store';
import ProductCard from '@/components/Produits/ProductCard';
import { formatPriceFC } from '@/utils/priceFormatter';
import UniteDataTable from './UniteDataTable';
import UniteDetail from './UniteDetail';

interface SemestreDetailProps {
  semestre: SemestreWithUnites;
  index: number;
  classeName: string;
}

const SemestreDetail: React.FC<SemestreDetailProps> = ({ 
  semestre, 
  index, 
  classeName 
}) => {
  const [produits, setProduits] = useState<ProduitWithDetails[]>([]);
  const [loadingProduits, setLoadingProduits] = useState(false);
  const [expandedUnites, setExpandedUnites] = useState(false);
  const [selectedUnite, setSelectedUnite] = useState<UniteDetails | null>(null);
  const { section } = useSectionStore();
  const { annee } = useAnneeStore();

  useEffect(() => {
    console.log("Semestre info : ", semestre);
    
    const fetchProduits = async () => {
      if (!semestre.insription || semestre.insription.length === 0) {
        setLoadingProduits(false);
        return;
      }

      try {
        setLoadingProduits(true);
        setProduits([]); // Reset products before fetching
        
        // Collect all unique product IDs
        const uniqueProductIds = [...new Set(semestre.insription.map(inscription => inscription.produitId))];
        
        // Fetch all products concurrently
        const productPromises = uniqueProductIds.map(async (productId) => {
          try {
            const produit = await ProduitService.getProduit(productId);
            return produit;
          } catch (error) {
            console.error(`Erreur lors du chargement du produit ${productId}:`, error);
            return null; // Return null for failed requests
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        
        // Filter out null values (failed requests) and set products
        const validProducts = fetchedProducts.filter(produit => produit !== null) as ProduitWithDetails[];
        setProduits(validProducts);
        
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProduits([]);
      } finally {
        setLoadingProduits(false);
      }
    };

    fetchProduits();
  }, [semestre._id]); // Depend on semestre._id instead of empty array

  const totalCredits = semestre.unites?.reduce((total, unite) => {
    return total + (unite?.descripteur?.credit || 0);
  }, 0) || 0;

  const unitesObligatoires = semestre.unites?.filter(
    unite => unite?.descripteur?.type === 'Obigatoire'
  ) || [];

  const unitesOptionnelles = semestre.unites?.filter(
    unite => unite?.descripteur?.type === 'Optionnelle'
  ) || [];

  // Fonctions de navigation
  const handleUniteClick = (unite: UniteDetails) => {
    setSelectedUnite(unite);
  };

  const handleBackToSemestre = () => {
    setSelectedUnite(null);
  };

  // Si une unité est sélectionnée, afficher le détail de l'unité
  if (selectedUnite) {
    return (
      <UniteDetail 
        unite={selectedUnite} 
        onBack={handleBackToSemestre} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-blacksection"
    >
      {/* Header du semestre */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              S{index + 1}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{semestre.designation}</h3>
              <p className="text-white/80">
                {classeName} • {totalCredits} crédits
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/80">Unités d'enseignement</div>
            <div className="text-2xl font-bold">{semestre.unites?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
            Description du semestre
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {semestre.description || "Ce semestre offre une formation complète avec des unités d'enseignement spécialisées pour développer les compétences nécessaires dans le domaine d'études."}
          </p>
        </div>

        {/* Statistiques du semestre */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {unitesObligatoires.length}
            </div>
            <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
              Unités obligatoires
            </div>
          </div>
          
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {unitesOptionnelles.length}
            </div>
            <div className="text-sm text-green-600/80 dark:text-green-400/80">
              Unités optionnelles
            </div>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalCredits}
            </div>
            <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
              Total crédits
            </div>
          </div>
        </div>

        {/* Unités d'enseignement - DataTable */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              Unités d'enseignement
            </h4>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {semestre.unites?.length || 0} unité{(semestre.unites?.length || 0) > 1 ? 's' : ''}
            </span>
          </div>
          
          <UniteDataTable 
            unites={semestre.unites || []} 
            onUniteClick={handleUniteClick}
          />
        </div>

        {/* Produits liés à la section */}
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Inscriptions disponibles, pour ce semestre
          </h4>
          
          {loadingProduits ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des produits...</span>
            </div>
          ) : produits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {produits.map((produit, produitIndex) => (
                <div key={produit._id} className="transform scale-95">
                  <ProductCard 
                    produit={produit} 
                    index={produitIndex}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Aucun produit disponible
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun produit n'est actuellement disponible pour cette section et cette année.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


export default SemestreDetail;
