"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUserAuthStore } from "@/store/userStore";

const StudentInfo = () => {
  const { etudiant, logout, getFullName, getTotalCredits, getValidatedCredits, getPendingCredits } = useUserAuthStore();

  return (
    <>
      {/* <!-- ===== Funfact Start ===== --> */}
      <section className="px-4 py-20 md:px-8 lg:py-22.5 2xl:px-0">
        <div className="relative z-1 mx-auto max-w-c-1390 rounded-lg bg-linear-to-t from-[#F8F9FF] to-[#DEE7FF] py-22.5 dark:bg-blacksection dark:bg-linear-to-t dark:from-transparent dark:to-transparent dark:stroke-strokedark xl:py-27.5">
          <Image
            width={200}
            height={200}
            src={etudiant?.photo ? etudiant?.photo : "/images/shape/shape-04.png"}
            alt="Man"
            className="absolute -left-15 -top-25 -z-1 lg:left-0 rounded-full"
          />


          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },

              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top mx-auto mb-12.5 px-4 text-center md:w-4/5 md:px-0 lg:mb-17.5 lg:w-2/3 xl:w-1/2"
          >
            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
              Bienvenue, {getFullName()}
            </h2>
            <p className="mx-auto lg:w-11/12">
              Nationalité: {etudiant?.nationalite || ""} <br /> Lieu de naissance: {etudiant?.lieu_naissance || ""} <br /> Date de naissance: {etudiant?.date_naissance ? new Date(etudiant?.date_naissance).toLocaleDateString() : ""}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-42.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="mb-2.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                {getTotalCredits()}
              </h3>
              <p className="text-lg lg:text-para2">Total Credits</p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.7 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="mb-2.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                {getValidatedCredits()}
              </h3>
              <p className="text-lg lg:text-para2">Crédits validés</p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="mb-2.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                {getPendingCredits()}
              </h3>
              <p className="text-lg lg:text-para2">Crédits en attente</p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="animate_top text-center"
            >
              <h3 className="mb-2.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                {getTotalCredits() - getValidatedCredits() - getPendingCredits()}
              </h3>
              <p className="text-lg lg:text-para2">Crédits non validés</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 right-0 -mr-5">
                          
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:opacity-90 dark:bg-white dark:text-black transition-all"
            >
              Se deconnecter
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
          </div>
            
        </div>
      </section>
      {/* <!-- ===== Funfact End ===== --> */}
    </>
  );
};

export default StudentInfo;
