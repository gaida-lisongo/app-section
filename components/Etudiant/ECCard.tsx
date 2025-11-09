"use client";

import { BookOpen, Calendar, Clock, Eye, GraduationCap } from "lucide-react";
import { JSX } from "react";

const ECCard = ({
    coursInscrit,
    getStatusBadge,
    handleViewCours
}: {
    coursInscrit: any;
    getStatusBadge: (status: 'PENDING' | 'APPROVED' | 'REJECTED') => JSX.Element;
    handleViewCours: (coursInscrit: any) => void;
}) => {
    return (
        <div className="p-4 sm:p-6">
            {/* En-tête avec icône et titre - Mobile First */}
            <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {coursInscrit.cours.titre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                        {coursInscrit.cours.description}
                    </p>
                </div>
            </div>
            
            {/* Informations du cours - Mobile: Stack vertical, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
                <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{coursInscrit.semestre}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{coursInscrit.unite}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{coursInscrit.cours.credit} crédits</span>
                    </div>
                </div>
                
                {/* Statistiques - Mobile: Inline, Desktop: Séparé */}
                <div className="flex items-center gap-4 sm:gap-4 sm:ml-6">
                    <div className="text-center">
                        <div className="text-base sm:text-lg font-semibold text-blue-600">{coursInscrit.cours.seances?.length || 0}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Séances</div>
                    </div>
                    <div className="text-center">
                        <div className="text-base sm:text-lg font-semibold text-green-600">{coursInscrit.cours.travaux?.length || 0}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Travaux</div>
                    </div>
                    <div className="text-center">
                        <div className="text-base sm:text-lg font-semibold text-purple-600">{coursInscrit.cours.ressources?.length || 0}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Ressources</div>
                    </div>
                </div>
            </div>
            
            {/* Footer avec badge et bouton - Mobile: Stack vertical, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-100 dark:border-strokedark">
                <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                    {getStatusBadge(coursInscrit.status)}
                    {coursInscrit?.ficheCotation?.reference && (
                        <span className="text-xs text-gray-500">
                            Réf: {coursInscrit.ficheCotation.reference}
                        </span>
                    )}
                </div>
                
                {/* Bouton - Mobile: Pleine largeur en bleu, Desktop: Inline */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewCours(coursInscrit);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm font-semibold sm:font-medium text-white sm:text-blue-600 bg-blue-600 sm:bg-transparent hover:bg-blue-700 sm:hover:bg-blue-50 sm:hover:text-blue-800 rounded-lg sm:rounded-md transition-colors shadow-sm sm:shadow-none"
                >
                    <Eye className="w-4 h-4 mr-2 sm:mr-1" />
                    Voir détails
                </button>
            </div>
        </div>
    );
};

export default ECCard;
