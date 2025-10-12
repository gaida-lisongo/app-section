"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, User, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { Etudiant } from '@/types/etudiant';

interface InscriptionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    etudiant: Etudiant;
    classeTitle: string;
    parcours?: any;
}

const InscriptionSuccessModal = ({
    isOpen,
    onClose,
    etudiant,
    classeTitle,
    parcours
}: InscriptionSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>

                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Inscription réussie !
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Félicitations, votre inscription a été confirmée avec succès.
                        </p>
                    </div>

                    {/* Student Info */}
                    <div className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Étudiant</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {etudiant.nom} {etudiant.prenom}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Matricule</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {etudiant.matricule}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Classe</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {classeTitle}
                                </p>
                            </div>
                        </div>

                        {parcours && (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Parcours</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {parcours.designation || 'Parcours confirmé'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Next Steps */}
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                            Prochaines étapes :
                        </h3>
                        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                            <li>• Consultez votre espace étudiant pour voir vos cours</li>
                            <li>• Vérifiez votre emploi du temps</li>
                            <li>• Contactez votre coordinateur pédagogique si nécessaire</li>
                        </ul>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                        Parfait, merci !
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InscriptionSuccessModal;
