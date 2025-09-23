"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import StudentTab from "@/components/FeaturesTab/StudentTab";

interface StudentData {
  nom: string;
  matricule: string;
  email: string;
  section?: string;
  annee?: string;
}

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données de l'étudiant depuis le localStorage ou une API
    const loadStudentData = () => {
      try {
        const storedData = localStorage.getItem('studentData');
        if (storedData) {
          setStudentData(JSON.parse(storedData));
        } else {
          // Données par défaut si aucune donnée n'est trouvée
          setStudentData({
            nom: "Étudiant",
            matricule: "ETU001",
            email: "etudiant@example.com"
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const quickActions = [
    {
      title: "Mes Cours",
      description: "Accéder à mes enseignements",
      href: "/studies",
      icon: "📚",
      color: "bg-blue-500"
    },
    {
      title: "Documents",
      description: "Mes documents académiques",
      href: "/documents/releve",
      icon: "📄",
      color: "bg-green-500"
    },
    {
      title: "Sujets de Recherche",
      description: "Mes travaux de recherche",
      href: "/documents/sujet",
      icon: "🔬",
      color: "bg-purple-500"
    },
    {
      title: "Stages",
      description: "Mes stages académiques",
      href: "/documents/stage",
      icon: "🏢",
      color: "bg-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StudentTab />
      {/* Header de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenue, {studentData?.nom} !
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Matricule: {studentData?.matricule} | Email: {studentData?.email}
            </p>
            {studentData?.section && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Section: {studentData.section} - Année: {studentData.annee}
              </p>
            )}
          </div>
          <div className="text-6xl">👨‍🎓</div>
        </div>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Link href={action.href}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Statistiques ou informations récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Aperçu Académique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">12</div>
            <p className="text-gray-600 dark:text-gray-300">Cours Suivis</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">8</div>
            <p className="text-gray-600 dark:text-gray-300">Cours Validés</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">4</div>
            <p className="text-gray-600 dark:text-gray-300">En Cours</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}