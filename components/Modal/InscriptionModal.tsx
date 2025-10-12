'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, GraduationCap } from 'lucide-react';
import { Annee } from '@/types/section';

interface InscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { matricule: string; selectedAnnee: Annee }) => void;
    annees: Annee[];
    classeTitle?: string;
}

const InscriptionModal: React.FC<InscriptionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    annees,
    classeTitle
}) => {
    const [matricule, setMatricule] = useState('');
    const [selectedAnneeId, setSelectedAnneeId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!matricule.trim() || !selectedAnneeId) {
            return;
        }

        const selectedAnnee = annees.find(annee => annee._id === selectedAnneeId);
        if (!selectedAnnee) return;

        setLoading(true);
        
        try {
            await onSubmit({
                matricule: matricule.trim(),
                selectedAnnee
            });
            
            // Reset form
            setMatricule('');
            setSelectedAnneeId('');
            onClose();
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setMatricule('');
        setSelectedAnneeId('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md mx-4 bg-white dark:bg-blacksection rounded-xl shadow-2xl border border-stroke dark:border-strokedark"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-black dark:text-white">
                                        Inscription à la classe
                                    </h3>
                                    {classeTitle && (
                                        <p className="text-sm text-body-color dark:text-bodydark">
                                            {classeTitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-body-color dark:text-bodydark" />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Matricule Field */}
                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Matricule étudiant <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-body-color dark:text-bodydark" />
                                    </div>
                                    <input
                                        type="text"
                                        value={matricule}
                                        onChange={(e) => setMatricule(e.target.value)}
                                        placeholder="Entrez votre matricule"
                                        className="w-full pl-10 pr-4 py-3 border border-stroke dark:border-strokedark rounded-lg bg-transparent text-black dark:text-white placeholder:text-body-color dark:placeholder:text-bodydark focus:border-primary focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Année Selection */}
                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Année académique <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-body-color dark:text-bodydark" />
                                    </div>
                                    <select
                                        value={selectedAnneeId}
                                        onChange={(e) => setSelectedAnneeId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-blacksection text-black dark:text-white focus:border-primary focus:outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Sélectionnez une année</option>
                                        {annees.map((annee) => (
                                            <option key={annee._id} value={annee._id}>
                                                Année {annee.debut} - {annee.fin}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Info Message */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Information :</strong> Votre inscription sera traitée après vérification de vos informations.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 border border-stroke dark:border-strokedark rounded-lg text-body-color dark:text-bodydark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !matricule.trim() || !selectedAnneeId}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Inscription...' : 'S\'inscrire'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InscriptionModal;
