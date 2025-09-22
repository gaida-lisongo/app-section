"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import ProduitService, { Produit } from "@/app/services/ProduitService";
import SectionLoader from "@/components/Common/SectionLoader";
import { formatPriceFC } from "@/utils/priceFormatter";
import { usePanierStore } from "@/store/panierStore";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const { ajouterProduit } = usePanierStore();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        
        // Décoder le slug: anneeId-sectionId
        const [anneeId, sectionId] = slug.split('-');
        
        if (!anneeId || !sectionId) {
          throw new Error('Format de slug invalide. Attendu: anneeId-sectionId');
        }
        
        const data = await ProduitService.getProduitByAnneeAndSection(anneeId, sectionId);
        console.log("Detail produit:", data);
        setProduits(data);
        
        // Sélectionner le premier produit par défaut
        if (data.length > 0) {
          setSelectedProduit(data[0]);
        }
      } catch (err) {
        setError('Produits non trouvés pour cette année et section');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduits();
    }
  }, [slug]);

  const handleAcheter = () => {
    if (!selectedProduit) return;
    
    console.log("Achat du produit:", {
      id: selectedProduit._id,
      designation: selectedProduit.designation,
      montant: selectedProduit.montant,
      quantite: quantity,
      total: selectedProduit.montant * quantity,
      section: typeof selectedProduit.sectionId === 'object' ? selectedProduit.sectionId.description.designation : selectedProduit.sectionId,
      annee: typeof selectedProduit.anneeId === 'object' ? `${selectedProduit.anneeId.debut}-${selectedProduit.anneeId.fin}` : selectedProduit.anneeId
    });
  };


  const getImageSrc = () => {
    if (imageError || !selectedProduit?.image) {
      return '/images/products/default-product.jpg';
    }
    return selectedProduit.image.startsWith('http') ? selectedProduit.image : `/images/products/${selectedProduit.image}`;
  };

  if (loading) {
    return <SectionLoader title="Chargement des produits..." />;
  }

  if (error || !selectedProduit) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 rounded-full bg-red-100 p-6 dark:bg-red-900">
          <svg className="h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Produit non trouvé
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Les produits demandés n'existent pas ou ont été supprimés.
        </p>
      </div>
    );
  }

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {/* Sélecteur de produits si plusieurs disponibles */}
        {produits.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              Produits disponibles ({produits.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {produits.map((produit, index) => (
                <button
                  key={`produit-selector-${index}`}
                  onClick={() => setSelectedProduit(produit)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedProduit?._id === produit._id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {produit.designation}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image du produit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
              <Image
                src={getImageSrc()}
                alt={selectedProduit.designation}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              
              {/* Badge catégorie */}
              {selectedProduit.categorie && selectedProduit.categorie.length > 0 && (
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                    {selectedProduit.categorie[0]}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Détails du produit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* En-tête */}
            <div>
              <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
                {selectedProduit.designation}
              </h1>
              
              <div className="mb-4 flex items-center gap-4">
                {/* <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                  <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {typeof selectedProduit.sectionId === 'object' ? selectedProduit.sectionId.description.designation : selectedProduit.sectionId}
                  </span>
                </div> */}
                
                {/* <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                  <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {typeof selectedProduit.anneeId === 'object' ? `${selectedProduit.anneeId.debut}-${selectedProduit.anneeId.fin}` : selectedProduit.anneeId}
                  </span>
                </div> */}
              </div>

              <div className="text-4xl font-bold text-primary">
                {formatPriceFC(selectedProduit.montant)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prix TTC</p>
            </div>

            {/* Bénéfices */}
            {selectedProduit.benefice && selectedProduit.benefice.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Bénéfices
                </h3>
                <div className="space-y-2">
                  {selectedProduit.benefice.map((benefice, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{benefice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caractéristiques */}
            {selectedProduit.caracteristiques && selectedProduit.caracteristiques.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Caractéristiques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduit.caracteristiques.map((carac, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {carac}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Avantages */}
            {selectedProduit.avantages && selectedProduit.avantages.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                  Avantages
                </h3>
                <ul className="space-y-2">
                  {selectedProduit.avantages.map((avantage, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="mt-1 h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{avantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section d'achat */}
            <div className="rounded-xl border border-stroke bg-gray-50 p-6 dark:border-strokedark dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantité:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Total:
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPriceFC(selectedProduit.montant * quantity)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => ajouterProduit(selectedProduit!, quantity)}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                  </svg>
                  Ajouter au panier ({quantity})
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;