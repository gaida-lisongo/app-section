import ClyclePage from "@/components/Enseignement";
import { Metadata } from "next";
import CycleService from "@/app/services/CycleService";

export const metadata: Metadata = {
  title: "Enseignements | Plateforme de Renforcement Académique",

  // other metadata
  description: "Découvrez nos programmes d'enseignement personnalisés pour le renforcement académique. Cours de soutien, méthodologie et accompagnement pédagogique.",
};

const StudiesPage = async () => {
  const cyclesData = await CycleService.getCyclesBySection();
  return (
    <>
        <ClyclePage cycles={cyclesData}/>
    </>
  );
};

export default StudiesPage;
