import ClyclePage from "@/components/Enseignement";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Enseignements | Plateforme de Renforcement Académique",

  // other metadata
  description: "Découvrez nos programmes d'enseignement personnalisés pour le renforcement académique. Cours de soutien, méthodologie et accompagnement pédagogique.",
};

const StudiesPage = async () => {
  return (
    <>
        <ClyclePage />
    </>
  );
};

export default StudiesPage;
