"use client"

import { CheckCircle, Download, Loader2, Upload, FileCheck } from "lucide-react";

const ResolutonSubmit = ({
    uploadedFile,
    setUploadedFile,
    uploadedFileUrl,
    setUploadedFileUrl,
    isSubmittingResolution,
    uploadSuccess
}: {
    uploadedFile: File | null,
    setUploadedFile: (file: File | null) => void,
    uploadedFileUrl: string,
    setUploadedFileUrl: (url: string) => void,
    isSubmittingResolution: boolean,
    uploadSuccess?: boolean
}) => {
    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Message de succès - Mobile first */}
            {uploadSuccess && uploadedFileUrl && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 sm:p-5">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-green-500 dark:bg-green-600">
                            <FileCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg text-green-900 dark:text-green-200 mb-1">
                                Résolution envoyée avec succès !
                            </h3>
                            <p className="text-sm sm:text-base text-green-700 dark:text-green-300">
                                Votre fichier a été uploadé et votre résolution a été soumise. 
                                Vous pouvez maintenant fermer cette fenêtre.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formats acceptés */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-200 text-sm sm:text-base mb-2 flex items-center">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Formats acceptés
                </h4>
                <div className="flex flex-wrap gap-2">
                    {['.zip', '.rar', '.docx', '.doc', '.xlsx', '.pdf'].map((format) => (
                        <span 
                            key={format}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                            {format}
                        </span>
                    ))}
                </div>
            </div>

            {/* Zone d'upload - Mobile first */}
            <div className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                isSubmittingResolution 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : uploadedFile
                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-strokedark hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}>
                {isSubmittingResolution ? (
                    // État de chargement avec loader circulaire
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-spin" />
                        </div>
                        <div>
                            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Upload en cours...
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                Veuillez patienter pendant l'envoi de votre fichier
                            </p>
                        </div>
                    </div>
                ) : uploadedFile ? (
                    // Fichier sélectionné
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="p-3 sm:p-4 rounded-full bg-green-500 dark:bg-green-600">
                                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {uploadedFile.name}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setUploadedFile(null);
                                setUploadedFileUrl('');
                            }}
                            className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Changer de fichier
                        </button>
                    </div>
                ) : (
                    // Zone de sélection
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="p-3 sm:p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                                <Download className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    const fileInput = document.createElement('input');
                                    fileInput.type = 'file';
                                    fileInput.accept = '.zip,.rar,.docx,.doc,.xlsx,.pdf';
                                    fileInput.onchange = (e: Event) => {
                                        const target = e.target as HTMLInputElement;
                                        const file = target.files?.[0];
                                        if (file) {
                                            setUploadedFile(file);
                                        }
                                    };
                                    fileInput.click();
                                }}
                                className="text-base sm:text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                Cliquez pour sélectionner un fichier
                            </button>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                                ou glissez-déposez votre fichier ici
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            {!uploadSuccess && !isSubmittingResolution && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                        <strong className="font-semibold">Note:</strong> Assurez-vous que votre fichier contient 
                        votre résolution complète avant de le soumettre. Taille maximale recommandée: 10 MB.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ResolutonSubmit
