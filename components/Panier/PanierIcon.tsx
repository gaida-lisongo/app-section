"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePanierStore } from "@/store/panierStore";

const PanierIcon: React.FC = () => {
  const { getTotalItems, togglePanier, isOpen } = usePanierStore();
  const totalItems = getTotalItems();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={togglePanier}
      className={`relative rounded-full p-3 transition-all duration-300 ${
        isOpen
          ? 'bg-primary text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
      aria-label="Panier d'achats"
    >
      {/* Icône panier */}
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
        />
      </svg>

      {/* Badge avec nombre d'articles */}
      {totalItems > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.div>
      )}

      {/* Animation de pulsation quand un item est ajouté */}
      {totalItems > 0 && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary opacity-25"
        />
      )}
    </motion.button>
  );
};

export default PanierIcon;
