"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Classe, Cycle } from '@/app/services/CycleService';
import SemestreService, { SemestreWithUnites } from '@/app/services/SemestreService';
import { useSectionStore } from '@/store';
import SectionLoader from '@/components/Common/SectionLoader';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SemestreDetail from '@/components/Enseignement/SemestreDetail';
import { useAnneeStore } from '../../../../store/anneeStore';
import { Annee } from '@/types/section';
import InscriptionModal from '@/components/Modal/InscriptionModal';
import InscriptionSuccessModal from '@/components/Modal/InscriptionSuccessModal';
import EtudiantService from '@/app/services/EtudiantService';
import { Etudiant } from '@/types/etudiant';

const ProgramPage = () => {
    const params = useParams();
    const slug = params.slug as string;
    const { section } = useSectionStore();
    const { annees, fetchAnnees, loading : loadingAnnee } = useAnneeStore();
    const [classe, setClasse] = useState<Classe | null>(null);
    const [cycle, setCycle] = useState<Cycle | null>(null);
    const [semestres, setSemestres] = useState<SemestreWithUnites[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInscriptionModal, setShowInscriptionModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [inscriptionData, setInscriptionData] = useState<{
        etudiant: Etudiant;
        parcours: any;
    } | null>(null);

    useEffect(() => {
        const fetchClasseData = async () => {
            try {
                setLoading(true);
                
                // Récupérer tous les cycles pour trouver la classe
                const CycleService = (await import('@/app/services/CycleService')).default;
                const cycles = await CycleService.getCyclesBySection();
                
                // Trouver la classe correspondant au slug
                let foundClasse: Classe | null = null;
                let foundCycle: Cycle | null = null;
                
                for (const cycle of cycles) {
                    const classe = cycle.classes?.find(c => c._id === slug);
                    if (classe) {
                        foundClasse = classe;
                        foundCycle = cycle;
                        break;
                    }
                }
                
                if (foundClasse && foundCycle) {
                    setClasse(foundClasse);
                    setCycle(foundCycle);
                    
                    // Récupérer les détails des semestres
                    const semestrePromises = foundClasse.semestres.map(semestreId => 
                        SemestreService.getSemestre(semestreId)
                    );
                    const semestreData = await Promise.all(semestrePromises);
                    setSemestres(semestreData.filter(Boolean));
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchClasseData();
        }
    }, [slug]);

    useEffect(() => {
        fetchAnnees();
    }, []);

    // if (loading || loadingAnnee) {
    //     return <SectionLoader title="Chargement du programme..." />;
    // }

    if (!classe || !cycle) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Programme non trouvé
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Le programme demandé n'existe pas ou a été supprimé.
                </p>
            </div>
        );
    }

    const handleInscriptionSubmit = async (data: { matricule: string; selectedAnnee: Annee }) => {
        try {
            const faculteId = process.env.NEXT_PUBLIC_FACULTE_ID;
            const etabId = process.env.NEXT_PUBLIC_ETAB_ID;
            
            // Vérifier que les variables d'environnement sont définies
            if (!faculteId || !etabId) {
                console.error('Variables d\'environnement manquantes: FACULTE_ID ou ETAB_ID');
                return;
            }

            // Vérifier que les IDs requis sont définis
            if (!classe._id || !data.selectedAnnee._id) {
                console.error('IDs manquants: classeId ou anneeId');
                return;
            }

            console.log("Data to subscribe", data);
            console.log("Classe", classe);
            console.log("Cycle", cycle);
            console.log("Faculte", faculteId);
            console.log("Etab", etabId);
            console.log("Annee", data.selectedAnnee);
            console.log("Matricule", data.matricule);

            const payload = {
                matricule: data.matricule,
                classeId: classe._id,
                anneeId: data.selectedAnnee._id,
                faculteId: faculteId,
                etabId: etabId
            }

            const response = await EtudiantService.subscribeClasse(payload);
            console.log("Response", response);

            if (!response.success) {
                console.error('Erreur lors de l\'inscription:', response.message);
                return;
            }

            if (!response.data) {
                console.error('Aucune donnée reçue dans la réponse');
                return;
            }

            const {
                etudiant,
                parcours
            } = response.data;

            console.log("Etudiant", etudiant);
            console.log("Parcours", parcours);

            // Sauvegarder les données d'inscription et afficher la modal de succès
            setInscriptionData({ etudiant, parcours });
            setShowInscriptionModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        }
    };

    return (
        <div className="lg:w-4/5">
            <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
                {/* Header du programme */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 p-3">
                            <Image
                                src={section?.description.images[0] ?? '/images/brand/inbtp.jpg'}
                                alt="Section Logo"
                                width={32}
                                height={32}
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-black dark:text-white">
                                {classe.designation}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Cycle: {cycle.designation} • {classe.semestres.length} semestre{classe.semestres.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowInscriptionModal(true)}
                            className="rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
                        >
                            S'inscrire à cette classe
                        </button>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                        <h2 className="mb-3 text-xl font-semibold text-black dark:text-white">
                            Description du programme
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {classe.description || "Ce programme d'études offre une formation complète et structurée pour préparer les étudiants aux défis professionnels de leur domaine."}
                        </p>
                    </div>
                </div>

                {/* Statistiques du programme */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-stroke bg-white p-6 text-center dark:border-strokedark dark:bg-blacksection">
                        <div className="mb-2 text-2xl font-bold text-primary">
                            {classe.semestres.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Semestre{classe.semestres.length > 1 ? 's' : ''}
                        </div>
                    </div>
                    
                    <div className="rounded-lg border border-stroke bg-white p-6 text-center dark:border-strokedark dark:bg-blacksection">
                        <div className="mb-2 text-2xl font-bold text-secondary">
                            {semestres.reduce((total, sem) => total + (sem.unites?.length || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Unités d'enseignement
                        </div>
                    </div>
                    
                    <div className="rounded-lg border border-stroke bg-white p-6 text-center dark:border-strokedark dark:bg-blacksection">
                        <div className="mb-2 text-2xl font-bold text-green-600">
                            {cycle.systeme}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Système d'études
                        </div>
                    </div>
                </div>

                {/* Liste des semestres */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                        Semestres disponibles
                    </h2>
                    
                    <div className="space-y-8">
                        {semestres.map((semestre, index) => (
                            <SemestreDetail
                                key={semestre._id}
                                semestre={semestre}
                                index={index}
                                classeName={classe.designation}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Modal d'inscription */}
            <InscriptionModal
                isOpen={showInscriptionModal}
                onClose={() => setShowInscriptionModal(false)}
                onSubmit={handleInscriptionSubmit}
                annees={annees}
                classeTitle={classe.designation}
            />

            {/* Modal de confirmation d'inscription */}
            {inscriptionData && (
                <InscriptionSuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        setInscriptionData(null);
                    }}
                    etudiant={inscriptionData.etudiant}
                    classeTitle={classe.designation}
                    parcours={inscriptionData.parcours}
                />
            )}
        </div>
    );
}


export default ProgramPage