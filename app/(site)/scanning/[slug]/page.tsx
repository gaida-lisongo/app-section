'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Etudiant } from "@/types/etudiant";
import EtudiantService from "@/app/services/EtudiantService";
import { useParams } from "next/navigation";
import StudentProfileCards from "@/components/Etudiant/StudentProfileCards";

const ScanningPage = () => {
    const searchParams = useParams();
    const slug = searchParams.slug as string;
    const [etudiant, setEtudiant] = useState<Etudiant | null>(null);

    useEffect(() => {
        if(slug) {
            EtudiantService.fetchEtudiant(slug)
            .then((response) => {
                if(response.success) {
                    console.log("User found:", response.data);

                    return response.data;
                }
            })
            .then((data) => {
                if(data) {
                    setEtudiant(data);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération de l'étudiant:", error);
            });
            
        }
    }, [slug]);

    if(!etudiant) {
        return (
            <div>
                <h1>ID:  {slug}</h1>
            </div>
        );
    }

    return (
        <div>
            <StudentProfileCards etudiant={etudiant} />
        </div>
    );
};

export default ScanningPage;
