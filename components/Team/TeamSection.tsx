import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamMember {
  _id: string;
  nom: string;
  grade: string;
  fonction: "Chef de Section" | "Chargé de l'Enseignement" | "Chargé de la Recherche";
  photo: string;
}

interface TeamSectionProps {
  team: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  // Fonction pour ordonner l'équipe par hiérarchie avec regex
  const sortTeamByHierarchy = (members: TeamMember[]): TeamMember[] => {
    const hierarchy = [
      { pattern: /chef.*section/i, priority: 1 },
      { pattern: /chargé.*enseignement/i, priority: 2 },
      { pattern: /chargé.*recherche/i, priority: 3 }
    ];

    return members.sort((a, b) => {
      const getPriority = (fonction: string): number => {
        const match = hierarchy.find(h => h.pattern.test(fonction));
        return match ? match.priority : 999;
      };

      const priorityA = getPriority(a.fonction);
      const priorityB = getPriority(b.fonction);
      
      return priorityA - priorityB;
    });
  };

  const sortedTeam = sortTeamByHierarchy(team);

  if (!team || team.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
        {/* Titre de la section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
            Notre {"   "}
            <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg2 dark:before:bg-titlebgdark">
              Équipe
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez les membres de notre équipe dédiée à l'excellence académique et à l'innovation pédagogique
          </p>
        </motion.div>

        {/* Grille des membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTeam.map((member, index) => (
            <motion.div
              key={member._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Effet de fond animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Photo du membre */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full p-1">
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={member.nom}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations du membre */}
                <div className="text-center space-y-4 relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {member.nom}
                  </h3>
                  
                  {member.grade && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic font-medium">
                      {member.grade}
                    </p>
                  )}

                  {/* Fonction mise en valeur */}
                  <div className="w-full">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg shadow-md">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h3v-2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2h3v6H4z"/>
                        </svg>
                        <span className="font-medium text-sm text-center leading-tight">
                          {member.fonction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Effet de coin décoratif */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;