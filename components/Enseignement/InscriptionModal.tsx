"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SemestreWithUnites } from "@/app/services/SemestreService";

interface InscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    semestre: SemestreWithUnites | null;
    classeName: string;
}

const InscriptionModal: React.FC<InscriptionModalProps> = ({
    isOpen,
    onClose,
    semestre,
    classeName
}) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        niveauEtude: '',
        motivation: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simuler l'envoi des données
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Inscription soumise:', {
                ...formData,
                semestreId: semestre?._id,
                semestre: semestre?.designation,
                classe: classeName
            });
            
            setSubmitSuccess(true);
            
            // Fermer le modal après 2 secondes
            setTimeout(() => {
                setSubmitSuccess(false);
                onClose();
                setFormData({
                    nom: '',
                    prenom: '',
                    email: '',
                    telephone: '',
                    niveauEtude: '',
                    motivation: ''
                });
            }, 2000);
            
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!semestre) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-blacksection">
                            {submitSuccess ? (
                                // Success State
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                        <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-2xl font-bold text-green-600 dark:text-green-400">
                                        Inscription réussie !
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Votre demande d'inscription au semestre "{semestre.designation}" a été envoyée avec succès.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
                                        <button
                                            onClick={onClose}
                                            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <div>
                                            <h2 className="text-2xl font-bold">Inscription au semestre</h2>
                                            <p className="text-white/80">
                                                {semestre.designation} - {classeName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto p-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Nom */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Nom *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Votre nom"
                                                />
                                            </div>

                                            {/* Prénom */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Prénom *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="prenom"
                                                    value={formData.prenom}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="votre@email.com"
                                                />
                                            </div>

                                            {/* Téléphone */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Téléphone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="telephone"
                                                    value={formData.telephone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="+33 1 23 45 67 89"
                                                />
                                            </div>

                                            {/* Niveau d'étude */}
                                            <div className="md:col-span-2">
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Niveau d'étude actuel *
                                                </label>
                                                <select
                                                    name="niveauEtude"
                                                    value={formData.niveauEtude}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                >
                                                    <option value="">Sélectionnez votre niveau</option>
                                                    <option value="college">Collège</option>
                                                    <option value="lycee">Lycée</option>
                                                    <option value="bac">Baccalauréat</option>
                                                    <option value="superieur">Études supérieures</option>
                                                    <option value="autre">Autre</option>
                                                </select>
                                            </div>

                                            {/* Motivation */}
                                            <div className="md:col-span-2">
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Motivation (optionnel)
                                                </label>
                                                <textarea
                                                    name="motivation"
                                                    value={formData.motivation}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Pourquoi souhaitez-vous vous inscrire à ce semestre ?"
                                                />
                                            </div>
                                        </div>
                                    </form>

                                    {/* Footer */}
                                    <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                * Champs obligatoires
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                            Inscription...
                                                        </>
                                                    ) : (
                                                        'Confirmer l\'inscription'
                                                    )}
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
        </AnimatePresence>
    );
};

export default InscriptionModal;
