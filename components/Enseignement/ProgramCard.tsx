"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Classe } from "@/app/services/CycleService";

interface ProgramCardProps {
  classe: Classe;
  index: number;
  onViewDetails?: (classe: Classe) => void;
  sectionLogo?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  classe, 
  index, 
  onViewDetails,
  sectionLogo = "/images/brand/brand-light-01.svg"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(classe);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-blacksection dark:shadow-strokedark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Header with logo and semester count */}
      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 p-2">
            <Image
              src={sectionLogo}
              alt="Section Logo"
              width={125}
              height={125}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">Programme</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {classe.semestres.length} semestre{classe.semestres.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Semester count badge */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {classe.semestres.length}
        </div>
      </div>

      {/* Program title */}
      <h3 className="relative mb-3 text-xl font-bold text-black transition-colors duration-300 group-hover:text-primary dark:text-white">
        {classe.designation}
      </h3>

      {/* Description */}
      <p className="relative mb-6 text-sm text-gray-600 dark:text-gray-300" style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {classe.description || "Description du programme d'études avec les matières principales et les objectifs pédagogiques."}
      </p>

      {/* Action button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleViewDetails}
        className="relative w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg"
      >
        <span className="flex items-center justify-center gap-2">
          Voir les détails
          <motion.svg
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </span>
      </motion.button>

      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default ProgramCard;
