"use client"
import { Cycle } from "@/app/services/CycleService";
import RelatedPost from "@/components/Blog/RelatedPost";
import { useSectionStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import CycleTabs from "./CycleTabs";
import SectionLoader from "../Common/SectionLoader";
import CycleService from "@/app/services/CycleService";


const ClyclePage = () => {
  const { section, loading, fetchSection } = useSectionStore();
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchSection();
  }, [fetchSection]);

  useEffect(() => {
    const fetchCycles = async () => {
      const cyclesData = await CycleService.getCyclesBySection();
      setCycles(cyclesData)
    }
    fetchCycles()
    console.log("Cycle data: ", cycles);
    console.log("Section data : ", section); 
  }, [section, cycles]);

  // Prevent hydration mismatch by only showing loading state on client
  if (!isClient) {
    return <SectionLoader title="Chargement des cycles..." />;
  }

  return (

    <div className="lg:w-2/3">
      <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
        <CycleTabs cycles={cycles} />
      </div>
    </div>
  );
};

export default ClyclePage;
