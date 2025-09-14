"use client";
import { useSectionStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import SectionLoader from "../Common/SectionLoader";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(1); // Commence à l'index 1 (deuxième image)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { section, loading } = useSectionStore();

  const handleSubmit = (e) => {
    e.preventDefault();
  };


  // Animation automatique du carousel d'images
  useEffect(() => {
    if (section?.description.images && section.description.images.length > 2) { // Au moins 3 images pour avoir 2+ images utilisables
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => {
            // Cycle entre les images à partir de l'index 1
            const nextIndex = prevIndex + 1;
            return nextIndex >= section.description.images.length ? 1 : nextIndex;
          });
          setIsTransitioning(false);
        }, 150); // Délai pour l'animation de sortie
      }, 4000); // Change d'image toutes les 4 secondes

      return () => clearInterval(interval);
    }
  }, [section?.description.images]);

  const nextImage = () => {
    if (section?.description.images && !isTransitioning && section.description.images.length > 2) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= section.description.images.length ? 1 : nextIndex;
        });
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevImage = () => {
    if (section?.description.images && !isTransitioning && section.description.images.length > 2) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => {
          return prevIndex <= 1 ? section.description.images.length - 1 : prevIndex - 1;
        });
        setIsTransitioning(false);
      }, 150);
    }
  };

  const goToImage = (index: number) => {
    if (index !== currentImageIndex && !isTransitioning && index >= 1) { // Empêche d'aller à l'index 0
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
  };

  if (loading) {
    return (
      <SectionLoader 
        logoSrc={section?.description?.images?.[0]}
        title="Chargement de la section"
        subtitle="Récupération des informations de la faculté..."
        size="md"
      />
    );
  }

  if (!section) {
    return (
      <SectionLoader 
        title="Aucune section disponible"
        subtitle="Impossible de récupérer les informations de la section"
        size="md"
      />
    );
  }

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
                🔥 Section - {section.description.sigle}
              </h4>
              <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero ">
                {section.description.designation} {"   "}
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  {section.description.devise}
                </span>
              </h1>
              <p>
                {section.description.objectif}
              </p>

              <div className="mt-10">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap gap-5">
                    <button
                      aria-label="infos button"
                      className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                      onClick={() => window.location.href = '/about'}
                    >
                      En savoir plus
                    </button>
                    <button
                      aria-label="Contact button"
                      className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Nous Contacter
                    </button>
                  </div>
                </form>

                {/* <p className="mt-5 text-black dark:text-white">
                  Try for free no credit card required.
                </p> */}
              </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-700/444 w-full">
                  {/* Carousel d'images de la section */}
                  {section.description.images && section.description.images.length > 1 ? (
                    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-solid-l">
                      {/* Stack d'images pour le fondu enchaîné - Commence à partir de l'index 1 */}
                      <div className="relative w-full h-full">
                        {section.description.images.slice(1).map((image, originalIndex) => {
                          const adjustedIndex = originalIndex + 1; // Index réel dans le tableau original
                          if (!image) return null;
                          return (
                            <div
                              key={`${image}-${adjustedIndex}`}
                              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                adjustedIndex === currentImageIndex 
                                  ? isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100' 
                                  : 'opacity-0 scale-95'
                              }`}
                            >
                              <Image
                                className="object-cover rounded-lg transition-transform duration-1000 ease-in-out"
                                src={image}
                                alt={`Hero ${adjustedIndex + 1}`}
                                fill
                                priority={adjustedIndex === 1}
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Boutons de navigation */}
                      {section.description.images.length > 2 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={isTransitioning}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                              isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                            aria-label="Image précédente"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={isTransitioning}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                              isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                            aria-label="Image suivante"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Indicateurs de pagination */}
                      {section.description.images.length > 2 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                          {section.description.images.slice(1).map((_, originalIndex) => {
                            const adjustedIndex = originalIndex + 1;
                            return (
                              <button
                                key={adjustedIndex}
                                onClick={() => goToImage(adjustedIndex)}
                                disabled={isTransitioning}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  adjustedIndex === currentImageIndex
                                    ? 'bg-white shadow-lg scale-110'
                                    : 'bg-white/50 hover:bg-white/70'
                                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                aria-label={`Aller à l'image ${adjustedIndex + 1}`}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Overlay avec gradient pour améliorer la lisibilité */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    /* Images par défaut si pas d'images dans la section */
                    <>
                      <Image
                        className="shadow-solid-l dark:hidden"
                        src="/images/hero/hero-light.svg"
                        alt="Hero"
                        fill
                      />
                      <Image
                        className="hidden shadow-solid-l dark:block"
                        src="/images/hero/hero-dark.svg"
                        alt="Hero"
                        fill
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
