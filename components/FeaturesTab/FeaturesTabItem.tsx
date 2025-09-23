import React from "react";
import { FeatureTab } from "@/types/featureTab";
import Image from "next/image";
import FAQ from "../FAQ";
import Pricing from "../Pricing";
import { useUserAuthStore } from "@/store/userStore";

const FeaturesTabItem = ({ featureTab, id }: { featureTab: FeatureTab, id: string }) => {
  const { title, desc1, desc2, image, imageDark } = featureTab;
  const {
    myRecherches,
    mySemestres,
    myStages,
    myValidations,
    myReleves,
    mySessions,

  } = useUserAuthStore();

  const renderEnseignement = () => {
    console.log("Data semestres student :", mySemestres);
    return <Pricing />
  }

  const renderRecherche = () => {
    console.log("Data stages student :", myStages);
    console.log("Data recherches student :", myRecherches);
    return <Pricing />
  }

  const renderDocument = () => {
    console.log("Data validatios student :", myValidations);
    console.log("Data releves student :", myReleves);
    console.log("Data sessions student :", mySessions);
    return <FAQ produits={[...myValidations, ...myReleves, ...mySessions]} />
  }

  switch (id) {
    case "tabOne":
      return renderEnseignement();
    case "tabTwo":
      return renderRecherche();
    case "tabThree":
      return renderDocument();
    default:
      return renderEnseignement();
  }

};

export default FeaturesTabItem;
