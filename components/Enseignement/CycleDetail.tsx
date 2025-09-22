"use client"
import { Cycle, Classe } from "@/app/services/CycleService";
import Image from "next/image";
import { useEffect, useState } from "react";
import SharePost from "@/components/Blog/SharePost";
import CycleFooter from "./CycleFooter";
import ProgramCard from "./ProgramCard";
import ProgramDetailModal from "./ProgramDetailModal";
import { useSectionStore } from "@/store";

const CycleDetail = ({ cycle } : { cycle: Cycle }) => {
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { section } = useSectionStore();

  useEffect(() => {
    console.log(cycle);
  }, [cycle]);

  const handleViewDetails = (classe: Classe) => {
    setSelectedClasse(classe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClasse(null);
  };
  return (
    <div>
        <ul className="mb-9 flex flex-wrap gap-5 2xl:gap-7.5">
        <li>
            <span className="text-black dark:text-white">Classes: </span>{" "}
            {cycle.classes?.length}
        </li>
        <li>
            <span className="text-black dark:text-white">
            Semestres: 
            </span>{cycle?.classes?.reduce((total, classe) => total + classe.semestres.length, 0) || 0}
        </li>
        <li>
            <span className="text-black dark:text-white">
            Système:
            </span>
            {cycle.systeme}
        </li>
        </ul>

        <div className="blog-details">
            <p>
                {cycle.description}
            </p>

            <div className="mb-8">
                <h3 className="mb-6 text-2xl font-bold text-black dark:text-white">
                    Programmes d'études
                </h3>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                    Découvrez les différents programmes proposés dans ce cycle d'études. 
                    Chaque programme est structuré pour offrir une formation complète et progressive.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cycle.classes?.map((classe, index) => (
                        <ProgramCard
                            key={classe._id || index}
                            classe={classe}
                            index={index}
                            onViewDetails={handleViewDetails}
                            sectionLogo={section?.description.images[0] ?? '/images/brand/inbtp.jpg'}
                        />
                    ))}
                </div>

                {(!cycle.classes || cycle.classes.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            Aucun programme disponible
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                            Les programmes d'études pour ce cycle seront bientôt disponibles.
                        </p>
                    </div>
                )}
            </div>
        </div>
        {cycle._id && <CycleFooter titre={cycle.designation} id={cycle._id} />}
        
        {/* Modal pour les détails du programme */}
        <ProgramDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            classe={selectedClasse}
            sectionLogo={section?.description.images[0] ?? '/images/brand/inbtp.jpg'}
        />
    </div>
  );
};  

export default CycleDetail;
