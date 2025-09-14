"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAnneeStore } from "@/store";
import SectionLoader from "../Common/SectionLoader";
import CalendrierModal from "../Common/CalendrierModal";
import { parseHTMLToParagraphs } from "@/utils/parseHTML";

const CTA = () => {
  const {currentAnnee, loading, fetchCurrentAnnee} = useAnneeStore();
  const [showCalendrierModal, setShowCalendrierModal] = useState(false);

  // Message du GG en HTML
  const messageGGHTML = `<p><span>L'enseignement supérieur et universitaire à travers le monde a subi une transformation profonde influencée aussi bien par les complexités internes que par les dynamiques externes.</span></p><p></p><p style="text-align: justify;"><span>La libéralisation économique, l'intégration régionale et la mondialisation ont mis en exergue le concept assurance/qualité en vue de satisfaire à la demande de la communauté et faire face à la concurrence et à la&nbsp; compétitivité internationale.</span></p><p style="text-align: justify;"></p><p><span>La prise en compte de ce concept dans la formation des Ingénieurs a conduit à des réformes des programmes et à s'arrimer sur des standards communs de manière à lancer sur le marché de l'emploi des Cadres techniques bien formés et compétents professionnellement, à même de concevoir et mettre en œuvre des ouvrages durables, répondant aux critères de stabilité, qualité et sécurité, ainsi qu'aux exigences environnementales.</span></p>`;
  
  // Parser le HTML en paragraphes propres
  const messageGGParagraphs = parseHTMLToParagraphs(messageGGHTML);

  useEffect(() => {
    fetchCurrentAnnee();
  }, []);

  console.log("Chargement de l'année académique:", loading, currentAnnee);

  if (loading) {
    return <SectionLoader
      title="Chargement des informations..."
      subtitle="Veuillez patienter un instant."
     />;
  }

  console.log("Données de l'année académique:", currentAnnee);
  if (!currentAnnee) {
    return <SectionLoader
      title="Aucune donnée disponible"
      subtitle="Il n'y a pas d'années académiques disponibles pour le moment."
     />;
  }

  
  return (
    <>
      {/* <!-- ===== CTA Start ===== --> */}
      <section className="overflow-hidden px-4 py-20 md:px-8 lg:py-25 xl:py-30 2xl:px-0">
        {/* <div className="mx-auto max-w-c-1390 rounded-lg bg-linear-to-t from-[#F8F9FF] to-[#DEE7FF] px-7.5 py-12.5 dark:bg-blacksection dark:bg-linear-to-t dark:from-transparent dark:to-transparent dark:stroke-strokedark md:px-12.5 xl:px-17.5 xl:py-0">
          <div className="flex flex-wrap gap-8 md:flex-nowrap md:items-center md:justify-between md:gap-0">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left md:w-[70%] lg:w-1/2"
            >
              <h2 className="mb-4 w-11/12 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle4">
                Année académique : {currentAnnee.debut}- {currentAnnee.fin}
              </h2>
              <p>
                {currentAnnee.motDg.description}
              </p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right lg:w-[45%]"
            >
              <div className="flex items-center justify-end xl:justify-between">
                <Image
                  width={299}
                  height={299}
                  src={currentAnnee.motDg.photo ? currentAnnee.motDg.photo : "/images/saly/saly-1.png"}
                  alt="Saly"
                  className="hidden xl:block"
                />
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Sign up free
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-dark.svg"
                    alt="Arrow"
                    className="dark:hidden"
                  />
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-light.svg"
                    alt="Arrow"
                    className="hidden dark:block"
                  />
                </a>
              </div>
            </motion.div>
          </div>
        </div> */}

        {/* Message du Gouverneur Général */}
        <div className="mx-auto mt-15 max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="animate_top"
          >
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border-l-4 border-primary">
              {/* Icône de citation */}
              <div className="absolute top-4 left-4 text-primary opacity-20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              {/* Titre */}
              <h3 className="text-xl font-bold text-primary dark:text-white mb-6 pl-8">
                Mot du Directeur Général
              </h3>

              {/* Contenu parsé */}
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                {messageGGParagraphs.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-justify">
                    {paragraph}
                  </p>
                ))}
              </blockquote>

              {/* Signature */}
              <footer className="mt-6 text-right">
                
                <button
                  onClick={() => setShowCalendrierModal(true)}
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:opacity-90 dark:bg-white dark:text-black transition-all"
                >
                  {currentAnnee.debut} - {currentAnnee.fin} : Calendrier académique
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-dark.svg"
                    alt="Arrow"
                    className="dark:hidden"
                  />
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-light.svg"
                    alt="Arrow"
                    className="hidden dark:block"
                  />
                </button>
              </footer>
            </div>
          </motion.div>
        </div>
      </section>
      {/* <!-- ===== CTA End ===== --> */}

      {/* Modal Calendrier Académique */}
      <CalendrierModal 
        isOpen={showCalendrierModal}
        onClose={() => setShowCalendrierModal(false)}
      />
    </>
  );
};

export default CTA;
