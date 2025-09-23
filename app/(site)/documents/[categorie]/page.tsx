"use client";

import ProduitService, { Produit } from "@/app/services/ProduitService";
import DocumentHeader from "@/components/About/DocumentHeader";
import SectionLoader from "@/components/Common/SectionLoader";
import DocumentContent from "@/components/Pricing/DocumentContent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Documents() {
  const documentsData : {id: string; categorie: string; description: string}[] = [
    {
        id: 'sujet',
        categorie: "Sujets de recherche",
        description: "Les sujets de recherche représentent les travaux scientifiques que chaque étudiant doit préparer et défendre à la fin de son cycle.\nIls permettent de démontrer la capacité à mobiliser les connaissances acquises tout en proposant des solutions innovantes."
    },
    {
        id: 'stage',
        categorie: "Stages académiques",
        description: "Les stages académiques offrent aux étudiants l’opportunité de concilier théorie et pratique au sein d’entreprises ou d’organisations partenaires.\nIls constituent une expérience professionnelle essentielle pour appliquer les acquis pédagogiques."
    },
    {
        id: 'validation',
        categorie: "Fiches de validation",
        description: "La fiche de validation est un document clé qui retrace le parcours académique de l’étudiant.\nElle présente les crédits obtenus, les crédits non validés ainsi que les dettes (ou casseroles) accumulées au cours des semestres.\nElle permet ainsi à l’étudiant et à l’administration de suivre l’évolution et la régularité du cursus."
    },
    {
        id: 'releve',
        categorie: "Relevés de Cotes",
        description: "Le relevé de cotes est un document officiel qui authentifie les résultats obtenus par l’étudiant pour chaque unité d’enseignement.\nIl constitue une preuve académique fiable pour les promotions et les jurys de délibération.\nCette section centralise l’accès aux résultats et garantit la transparence dans le suivi pédagogique."
    }
  ];

  const params = useParams();
  const categorie = params.categorie as string;
  const [document, setDocument] = useState<{categorie: string; description: string} | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const documentcurrent = documentsData.find((doc) => doc.id === categorie);
    documentcurrent && setDocument(documentcurrent);
  }, []);

  
  useEffect(() => {
    const fetchProduits = async () => {
        try {
            setLoading(true);
            
            // Décoder le slug: anneeId-sectionId
            
            if (!categorie) {
            throw new Error('Format de slug invalide. Attendu: anneeId-sectionId');
            }
            
            const data = await ProduitService.getProduitsByCategorie(categorie);
            console.log("Detail produit:", data);
            setProduits(data);
            
            // Sélectionner le premier produit par défaut
            if (data.length > 0) {
            setSelectedProduit(data[0]);
            }
        } catch (err) {
            setError('Produits non trouvés pour cette année et section');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    if (categorie) {
      fetchProduits();
    }
  }, [categorie]);

  return (
    <div className="mt-10">
      <DocumentHeader categorie={document?.categorie || ""} description={document?.description || ""} />
      {loading ? <SectionLoader title="Chargement des produits..." /> : error ? <p className="text-red-500">{error}</p> : <DocumentContent
        title={`${produits.length} élément(s) trouvés`}
        subtitle={""}
        description={""}
        documents={produits}
      />}
    </div>
  );
}
