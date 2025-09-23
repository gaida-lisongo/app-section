"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Produit } from "@/app/services/ProduitService";
import { formatPriceFC } from "@/utils/priceFormatter";
import { usePanierStore } from "@/store/panierStore";
import { useAnneeStore, useSectionStore } from "@/store";

interface ProductCardProps {
  produit: Produit;
  index: number;
  onAcheter?: (produit: Produit) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  produit, 
  index, 
  onAcheter 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { section, fetchSection } = useSectionStore();
  const { annee, fetchAnnee } = useAnneeStore();
  const { ajouterProduit, getItemQuantity } = usePanierStore();
  const quantiteEnPanier = getItemQuantity(produit._id!);


  const infoSection = () => {
    const sectionId = typeof produit.sectionId === 'object' ? produit.sectionId._id : produit.sectionId;
    if(section?._id != sectionId) {
      return (
        <div>
          <p>Voir autre section</p>
        </div>
      )
    } 
    
    return (
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
        </svg>
        <span>{section?.description.designation}</span>
      </div>
    )
  };

  const handleAcheter = () => {
    console.log("Achat du produit:", {
      id: produit._id,
      designation: produit.designation,
      montant: produit.montant,
      section: typeof produit.sectionId === 'object' ? produit.sectionId.description.designation : produit.sectionId,
      annee: typeof produit.anneeId === 'object' ? `${produit.anneeId.debut}-${produit.anneeId.fin}` : produit.anneeId
    });
    
    if (onAcheter) {
      onAcheter(produit);
    }
  };

  const handleAjouterAuPanier = () => {
    ajouterProduit(produit, 1);
  };


  const getImageSrc = () => {
    if (imageError || !produit.image) {
      return '/images/features/document-4.jpg';
    }
    return produit.image.startsWith('http') ? produit.image : `/images/products/${produit.image}`;
  };

  const generateSlug = () => {
    // Créer le slug au format anneeId-sectionId
    const anneeId = typeof produit.anneeId === 'object' ? produit.anneeId._id : produit.anneeId;
    const sectionId = typeof produit.sectionId === 'object' ? produit.sectionId._id : produit.sectionId;
    return `${produit._id}`;
  };

  useEffect(() => {
    fetchAnnee(typeof produit.anneeId == "string" ? produit.anneeId : produit.anneeId._id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-blacksection dark:shadow-strokedark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge catégorie */}
      {produit.categorie && produit.categorie.length > 0 && (
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {produit.categorie[0]}
          </span>
        </div>
      )}

      {/* Image du produit */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={getImageSrc()}
          alt={produit.designation}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Badge section/année */}
        <div className="absolute bottom-4 right-4">
          <div className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
            Année : {annee?._id ? `${annee?.debut}-${annee?.fin}`: ""}
          </div>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Titre du produit */}
        <h3 className="mb-3 text-xl font-bold text-black transition-colors duration-300 group-hover:text-primary dark:text-white">
          {produit.designation}
        </h3>

        {/* Section et année */}
        {infoSection()}

        {/* Bénéfices principaux */}
        {produit.benefice && produit.benefice.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Bénéfices clés
            </h4>
            <div className="space-y-1">
              {produit.benefice.slice(0, 3).map((benefice, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{benefice}</span>
                </div>
              ))}
              {produit.benefice.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{produit.benefice.length - 3} autres bénéfices
                </div>
              )}
            </div>
          </div>
        )}

        {/* Caractéristiques */}
        {produit.caracteristiques && produit.caracteristiques.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {produit.caracteristiques.slice(0, 2).map((carac, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {carac}
                </span>
              ))}
              {produit.caracteristiques.length > 2 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800">
                  +{produit.caracteristiques.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Prix et boutons d'action */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatPriceFC(produit.montant)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Prix TTC
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <Link 
              href={`/produits/${generateSlug()}`}
              className="flex-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white"
              >
                Voir détails
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAjouterAuPanier}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 hover:shadow-lg ${
                quantiteEnPanier > 0
                  ? 'bg-green-600 text-white'
                  : 'bg-gradient-to-r from-primary to-secondary text-white'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
              </svg>
              <span>
                {quantiteEnPanier > 0 ? `Dans le panier (${quantiteEnPanier})` : 'Ajouter au panier'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Effets décoratifs */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default ProductCard;
