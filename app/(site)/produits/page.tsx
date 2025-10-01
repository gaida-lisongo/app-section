"use client";
import config from "@/app/services/config";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProduitService, { Produit } from "@/app/services/ProduitService";
import ProductCard from "@/components/Produits/ProductCard";
import SectionLoader from "@/components/Common/SectionLoader";

const ProduitsPage = () => {
  const [allProduits, setAllProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le moteur de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        const data = await ProduitService.getProduits();
        const filterData = data.filter(item => item.sectionId == config._id);

        setAllProduits(filterData);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  // Extraire toutes les catégories uniques
  const categories = ['all', ...new Set(allProduits.flatMap(p => p.categorie || []))];

  // Fonction de recherche
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    
    try {
      // Filtrer les produits par terme de recherche et catégorie
      let results = allProduits.filter(produit =>
        produit.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.benefice.some(b => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
        produit.caracteristiques.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        produit.avantages.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      // Filtrer par catégorie si sélectionnée
      if (selectedCategorie !== 'all') {
        results = results.filter(p => p.categorie?.includes(selectedCategorie));
      }

      setFilteredProduits(results);
      setShowResults(true);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    } finally {
      setSearching(false);
    }
  };

  // Réinitialiser la recherche
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategorie('all');
    setFilteredProduits([]);
    setShowResults(false);
  };

  const handleAcheter = (produit: Produit) => {
    // Ici vous pouvez ajouter la logique d'achat
    console.log("Redirection vers le processus d'achat pour:", produit.designation);
  };

  const generateSlug = (produit: Produit) => {
    // Créer le slug au format anneeId-sectionId
    const anneeId = typeof produit.anneeId === 'object' ? produit.anneeId._id : produit.anneeId;
    const sectionId = typeof produit.sectionId === 'object' ? produit.sectionId._id : produit.sectionId;
    return `${anneeId}-${sectionId}`;
  };

  if (loading) {
    return <SectionLoader title="Chargement des produits..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 rounded-full bg-red-100 p-6 dark:bg-red-900">
          <svg className="h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Erreur de chargement
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {/* Header du moteur de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white md:text-6xl">
            Recherche de Produits
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Trouvez le produit parfait pour vos besoins éducatifs et professionnels
          </p>
        </motion.div>

        {/* Moteur de recherche principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-blacksection">
            {/* Barre de recherche */}
            <div className="mb-6">
              <label className="mb-3 block text-lg font-semibold text-gray-700 dark:text-gray-300">
                Que recherchez-vous ?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Entrez le nom du produit, ses caractéristiques..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4 text-lg transition-all duration-300 focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sélecteur de catégorie */}
            <div className="mb-8">
              <label className="mb-3 block text-lg font-semibold text-gray-700 dark:text-gray-300">
                Catégorie (optionnel)
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((categorie) => (
                  <button
                    key={categorie}
                    onClick={() => setSelectedCategorie(categorie)}
                    className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                      selectedCategorie === categorie
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {categorie === 'all' ? 'Toutes catégories' : categorie}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={!searchTerm.trim() || searching}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {searching ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Recherche...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Rechercher
                  </span>
                )}
              </motion.button>

              {showResults && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="rounded-xl border-2 border-gray-300 px-6 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                >
                  Réinitialiser
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Résultats de recherche */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* En-tête des résultats */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-blacksection">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Résultats de recherche
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredProduits.length} produit{filteredProduits.length > 1 ? 's' : ''} trouvé{filteredProduits.length > 1 ? 's' : ''} pour "{searchTerm}"
                    {selectedCategorie !== 'all' && ` dans la catégorie "${selectedCategorie}"`}
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-4 py-2">
                  <span className="text-lg font-bold text-primary">{filteredProduits.length}</span>
                </div>
              </div>
            </div>

            {/* Grille de produits */}
            {filteredProduits.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProduits.map((produit, index) => (
                  <ProductCard
                    key={`product-card-${index}`}
                    produit={produit}
                    index={index}
                    onAcheter={handleAcheter}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Aucun résultat trouvé
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Essayez avec d'autres mots-clés ou changez la catégorie sélectionnée.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Suggestions si pas de recherche */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto max-w-2xl rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/20 p-4">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Prêt à trouver votre produit ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Utilisez la barre de recherche ci-dessus pour découvrir nos {allProduits.length} produits disponibles dans {categories.length - 1} catégories différentes.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProduitsPage;