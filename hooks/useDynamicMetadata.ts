"use client";

import { useSectionStore } from "@/store";
import { useEffect } from "react";

export const useDynamicMetadata = () => {
  const { section, fetchSection } = useSectionStore();

  useEffect(() => {
    fetchSection();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && section?.description) {
      // Mettre à jour le titre
      const title = `${section.description.sigle} | ${section.description.designation || 'Institut'}`;
      document.title = title;
      
      // Mettre à jour les métadonnées
      updateMetaTag('description', section.description.objectif || 'Institut de formation');
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('og:description', section.description.objectif || 'Institut de formation', 'property');
      updateMetaTag('twitter:title', title, 'name');
      updateMetaTag('twitter:description', section.description.objectif || 'Institut de formation', 'name');
      
      // Ajouter le sigle comme keyword
      updateMetaTag('keywords', `${section.description.sigle}, institut, formation, ${section.description.designation}`);
    }
  }, [section]);

  return section;
};

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}