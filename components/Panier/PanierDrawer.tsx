"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePanierStore } from "@/store/panierStore";
import { formatPriceFC } from "@/utils/priceFormatter";
import CheckoutModal from "./CheckoutModal";

const PanierDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    fermerPanier,
    retirerProduit,
    modifierQuantite,
    viderPanier,
    getTotalPrice,
    getTotalItems,
  } = usePanierStore();

  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (produitId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      retirerProduit(produitId);
    } else {
      modifierQuantite(produitId, newQuantity);
    }
  };

  const proceedToCheckout = () => {
    setShowCheckout(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fermerPanier}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-blacksection"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Panier ({getTotalItems()})
              </h2>
              <button
                onClick={fermerPanier}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="flex h-full flex-col">
              {items.length === 0 ? (
                /* Panier vide */
                <div className="flex flex-1 flex-col items-center justify-center p-8">
                  <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Votre panier est vide
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Ajoutez des produits à votre panier pour commencer vos achats.
                  </p>
                </div>
              ) : (
                <>
                  {/* Liste des produits */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={`drawer-item-${index}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex gap-4">
                            {/* Image produit */}
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={item.produit.image || '/images/products/default-product.jpg'}
                                alt={item.produit.designation}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Détails produit */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {item.produit.designation}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatPriceFC(item.produit.montant)} × {item.quantite}
                              </p>
                              
                              {/* Contrôles quantité */}
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() => handleQuantityChange(item.produit._id!, item.quantite - 1)}
                                  className="rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                
                                <span className="mx-2 min-w-[2rem] text-center font-medium">
                                  {item.quantite}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item.produit._id!, item.quantite + 1)}
                                  className="rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => retirerProduit(item.produit._id!)}
                                  className="ml-auto rounded-full p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Prix total item */}
                            <div className="text-right">
                              <div className="font-bold text-primary">
                                {formatPriceFC(item.produit.montant * item.quantite)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Footer avec total et actions */}
                  <div className="border-t border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-blacksection">
                    {/* Total */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPriceFC(getTotalPrice())}
                      </span>
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={proceedToCheckout}
                        className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
                      >
                        Procéder au checkout
                      </motion.button>

                      <div className="flex gap-3">
                        <button
                          onClick={viderPanier}
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Vider le panier
                        </button>
                        <button
                          onClick={fermerPanier}
                          className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Continuer les achats
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
      
      {/* Modal de checkout */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </AnimatePresence>
  );
};

export default PanierDrawer;
