"use client";
import React, { useEffect } from "react";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";
import { useSectionStore } from "@/store";

const Feature = () => {
  const { section, loading } = useSectionStore();

  if (!section || loading) {
    return null; // Ou un loader si nécessaire
  }

  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="features" className="py-20 lg:py-25 xl:py-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: section?.description.designation || "Section",
              subtitle: "Nos offres de formation",
              description: `De la formation initiale aux spécialisations avancées, nous vous accompagnons dans votre parcours académique avec des méthodes pédagogiques innovantes et un encadrement personnalisé.`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
            {/* <!-- Features item Start --> */}
            {section.offres.map((feature, key) => (
              <SingleFeature feature={{ ...feature, _id: feature._id ?? key }} key={key} />
            ))}

            {/* {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))} */}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Feature;
