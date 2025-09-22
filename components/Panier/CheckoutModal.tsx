"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePanierStore, CheckoutData } from "@/store/panierStore";
import { formatPriceFC } from "@/utils/priceFormatter";
import CommandeService from "@/app/services/CommandeService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    getTotalPrice, 
    getTotalItems, 
    setCheckoutData, 
    viderPanier 
  } = usePanierStore();

  const [formData, setFormData] = useState<CheckoutData>({
    matricule: '',
    nom: '',
    email: '',
    telephone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutData> = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (formData.matricule.length < 5) {
      newErrors.matricule = 'Le matricule doit contenir au moins 5 caractères';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.telephone && !/^[+]?[\d\s-()]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Créer une commande pour chaque produit (selon la nouvelle structure API)
      const commandesPromises = items.map(async (item) => {
        const commandeData = {
          productId: item.produit._id!,
          statu: 'PENDING' as const,
          reference: CommandeService.generateReference('CMD'),
          anneeId: typeof item.produit.anneeId === 'object' ? item.produit.anneeId._id! : item.produit.anneeId
        };

        // Valider les données
        const validation = CommandeService.validateCommandeData(commandeData);
        if (!validation.isValid) {
          throw new Error('Erreurs de validation:\n' + validation.errors.join('\n'));
        }

        return CommandeService.createCommande(commandeData);
      });

      // Exécuter toutes les commandes
      const results = await Promise.all(commandesPromises);
      
      // Vérifier si toutes les commandes ont réussi
      const failedCommandes = results.filter(result => result.status !== 200 && result.status !== 201);
      
      if (failedCommandes.length > 0) {
        throw new Error('Certaines commandes ont échoué');
      }

      // Sauvegarder les données de checkout
      setCheckoutData(formData);

      console.log('Commandes créées avec succès:', results);

      // Vider le panier après succès
      viderPanier();
      
      // Fermer le modal
      onClose();

      // Afficher un message de succès
      const references = results.map(r => r.data.data?.reference).filter(Boolean);
      alert(`Commandes créées avec succès !\nRéférences: ${references.join(', ')}\nVous recevrez une confirmation par email.`);

    } catch (error) {
      console.error('Erreur lors de la création des commandes:', error);
      alert('Erreur lors de la création des commandes. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform"
          >
            <div className="mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-blacksection">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Finaliser la commande
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Résumé de la commande */}
                <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Résumé de la commande
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={`checkout-item-${index}`} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.produit.designation} × {item.quantite}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPriceFC(item.produit.montant * item.quantite)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-primary">{formatPriceFC(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Matricule (requis) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Matricule étudiant *
                    </label>
                    <input
                      type="text"
                      value={formData.matricule}
                      onChange={(e) => handleInputChange('matricule', e.target.value)}
                      placeholder="Ex: ETU2024001"
                      className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                        errors.matricule
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                      } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                    />
                    {errors.matricule && (
                      <p className="mt-1 text-sm text-red-500">{errors.matricule}</p>
                    )}
                  </div>

                  {/* Nom (optionnel) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Votre nom complet"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Email (optionnel) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                      } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Téléphone (optionnel) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      placeholder="+243 XXX XXX XXX"
                      className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                        errors.telephone
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                      } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                    />
                    {errors.telephone && (
                      <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Annuler
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Traitement...
                        </span>
                      ) : (
                        `Confirmer la commande (${formatPriceFC(getTotalPrice())})`
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
