"use client";
import { useState, useEffect } from "react";
import { Cycle } from "@/app/services/CycleService";
import CycleService from "@/app/services/CycleService";
import CycleDetail from "./CycleDetail";
import Image from "next/image";

const CycleTabs = ({ cycles }: {cycles: Cycle[]}) => {
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        setLoading(true);
        // Sélectionner le premier cycle par défaut s'il y en a
        if (cycles.length > 0) {
          setSelectedCycle(cycles[0]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des cycles");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, [cycles]);

  const handleCycleSelect = (cycle: Cycle) => {
    setSelectedCycle(cycle);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des cycles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Aucun cycle disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10 w-full overflow-hidden ">
        <div className="relative aspect-97/60 w-full sm:aspect-97/44">
            <Image
            src={"/images/brand/inbtp.jpg"}
            alt="Batiment INBTP"
            fill
            className="rounded-md object-cover object-center"
            />
        </div>
      </div>  
      {/* Onglets des cycles */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {cycles.map((cycle) => (
            <button
              key={cycle._id}
              onClick={() => handleCycleSelect(cycle)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  selectedCycle?._id === cycle._id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }
              `}
            >
              {cycle.designation}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu du cycle sélectionné */}
      {selectedCycle && (
        <div className="transition-opacity duration-300">
          <CycleDetail cycle={selectedCycle} />
        </div>
      )}
    </div>
  );
};

export default CycleTabs;