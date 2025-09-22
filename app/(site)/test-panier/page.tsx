"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePanierStore } from "@/store/panierStore";
import { formatPriceFC } from "@/utils/priceFormatter";

// Produits de test
const produitsTest = [
  {
    _id: "test1",
    designation: "Cours de Mathématiques Avancées",
    montant: 15000,
    image: "/images/products/math.jpg",
    benefice: ["Amélioration des compétences analytiques", "Préparation aux examens"],
    caracteristiques: ["Niveau avancé", "120 heures", "Certificat inclus"],
    avantages: ["Support 24/7", "Exercices pratiques"],
    categorie: ["Mathématiques", "Sciences"],
    sectionId: "section1",
    anneeId: "2024"
  },
  {
    _id: "test2",
    designation: "Formation en Informatique",
    montant: 25000,
    image: "/images/products/info.jpg",
    benefice: ["Compétences en programmation", "Certification professionnelle"],
    caracteristiques: ["Débutant à avancé", "200 heures", "Projets pratiques"],
    avantages: ["Mentorat individuel", "Accès à vie"],
    categorie: ["Informatique", "Technologie"],
    sectionId: "section2",
    anneeId: "2024"
  },
  {
    _id: "test3",
    designation: "Cours de Français",
    montant: 8000,
    image: "/images/products/francais.jpg",
    benefice: ["Amélioration de l'expression", "Préparation DELF/DALF"],
    caracteristiques: ["Tous niveaux", "80 heures", "Conversation"],
    avantages: ["Professeurs natifs", "Groupes réduits"],
    categorie: ["Langues", "Communication"],
    sectionId: "section3",
    anneeId: "2024"
  }
];

const TestPanierPage = () => {
  const { ajouterProduit, items, getTotalItems, getTotalPrice } = usePanierStore();

  const handleAjouterProduit = (produit: any) => {
    ajouterProduit(produit, 1);
  };

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white md:text-5xl">
            Test du Panier
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Page de test pour vérifier le fonctionnement du système de panier
          </p>
        </motion.div>

        {/* Statistiques du panier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-blacksection"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                État du panier
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} - Total: {formatPriceFC(getTotalPrice())}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2">
              <span className="text-lg font-bold text-primary">{getTotalItems()}</span>
            </div>
          </div>
        </motion.div>

        {/* Produits de test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Produits de test
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produitsTest.map((produit, index) => (
              <motion.div
                key={produit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="rounded-xl bg-white p-6 shadow-lg dark:bg-blacksection"
              >
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  {produit.designation}
                </h3>
                <p className="mb-4 text-2xl font-bold text-primary">
                  {formatPriceFC(produit.montant)}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Catégories: {produit.categorie.join(", ")}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAjouterProduit(produit)}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg"
                >
                  Ajouter au panier
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contenu du panier */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-xl bg-white p-6 shadow-lg dark:bg-blacksection"
          >
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              Contenu du panier
            </h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={`test-panier-item-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.produit.designation}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantité: {item.quantite}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatPriceFC(item.produit.montant * item.quantite)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20"
        >
          <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
            Instructions de test
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Cliquez sur "Ajouter au panier" pour ajouter des produits</li>
            <li>• Vérifiez que le badge du panier dans le header se met à jour</li>
            <li>• Cliquez sur l'icône panier pour ouvrir le drawer</li>
            <li>• Testez les fonctionnalités de modification de quantité</li>
            <li>• Essayez le processus de checkout avec votre matricule</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default TestPanierPage;
