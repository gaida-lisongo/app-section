"use client";
import GaleriePosts from "@/components/Blog/GaleriePosts";
import EventCarousel from "@/components/Blog/EventCarousel";
import RelatedPost from "@/components/Blog/RelatedPost";
import SharePost from "@/components/Blog/SharePost";
import SectionLoader from "@/components/Common/SectionLoader";
import { useSectionStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Event {    
    _id: string;
    titre: string;
    date_event: Date | string;
    description: string;
    photo?: string;
}

type AgendaType = {
  _id?: string;
  annee: string;
  current: boolean;
  events: {
    _id?: string;
    titre: string;
    date_event: Date | string;
    description: string;
  }[]
}

const NewsClient = () => {
  const { section, loading, fetchSection } = useSectionStore();
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedAgenga, setSelectedAgenda] = useState<AgendaType | null>(null);

  useEffect(() => {
    fetchSection();
  }, []);

  useEffect(() => {
    if (section?.galery && section.galery.length > 0) {
        // Sélectionner l'année courante par défaut
        const currentGallery = section.galery.find(g => g.current);
        const defaultGallery = currentGallery || section.galery[0];
        
        if (defaultGallery) {
          setSelectedGalleryId(defaultGallery._id);
          setSelectedEvents(defaultGallery.events || []);
          setSelectedYear(defaultGallery.annee);
        }
    }

    if (section?.agenda && section.agenda.length > 0) {
      const currentAgenda = section.agenda.find(a => a.current);
      const defaultAgenda = currentAgenda || section.agenda[0];
      
      if (defaultAgenda) {
        setSelectedAgenda(defaultAgenda);
      }
    }
  }, [section]);

  const handleYearSelect = (galleryId: string) => {
    if (!section?.galery) return;
    
    const selectedGallery = section.galery.find(g => g._id === galleryId);
    if (selectedGallery) {
      setSelectedGalleryId(galleryId);
      setSelectedEvents(selectedGallery.events || []);
      setSelectedYear(selectedGallery.annee);
    }
  };
  
  if (loading) {
    return <SectionLoader
      title="Chargement de la section..."
      subtitle="Récupération des informations..."
      size="lg"
      className="min-h-screen"
     />;
  }

  if (!section) {
    return null;
  }

  const galeryFormated = section.galery ? section.galery.map((item, index) => ({
    _id: item._id || index,
    annee: item.annee,
    current: item.current,
    eventsId: item.events ? item.events.map(e => e._id) : [],
  })) : [];
  console.log("galeryFormated", galeryFormated);

  return (
    <>
      <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col-reverse gap-7.5 lg:flex-row xl:gap-12.5">
            <div className="md:w-1/2 lg:w-[32%]">

              <GaleriePosts 
                data={galeryFormated} 
                onClick={handleYearSelect}
                selectedId={selectedGalleryId || undefined}
              />

              {
                selectedAgenga ? <RelatedPost data={selectedAgenga} logo={section.description.images[0]} /> : null
              } 
            </div>

            <div className="lg:w-2/3">
              <EventCarousel 
                events={selectedEvents}
                selectedYear={selectedYear}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsClient;