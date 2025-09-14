"use client";

import { useSectionStore } from "@/store";
import Head from "next/head";
import { useEffect } from "react";

const DynamicHead = () => {
  const { section, fetchSection } = useSectionStore();

  useEffect(() => {
    fetchSection();
  }, []);

  useEffect(() => {
    if (section?.description) {
      // Mettre à jour le titre dynamiquement
      document.title = `${section.description.sigle} | ${section.description.designation || 'Institut'}`;
      
      // Mettre à jour la meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', section.description.objectif || 'Institut de formation');
      } else {
        // Créer la meta description si elle n'existe pas
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = section.description.objectif || 'Institut de formation';
        document.head.appendChild(meta);
      }

      // Ajouter d'autres métadonnées si nécessaire
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${section.description.sigle} | ${section.description.designation}`);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = `${section.description.sigle} | ${section.description.designation}`;
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', section.description.objectif);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = section.description.objectif || 'Institut de formation';
        document.head.appendChild(meta);
      }
    }
  }, [section]);

  return null; // Ce composant ne rend rien visuellement
};

export default DynamicHead;