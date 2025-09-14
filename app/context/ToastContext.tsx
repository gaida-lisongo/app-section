"use client";
import { useSectionStore } from "@/store";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  const { fetchSection } = useSectionStore();
  
  useEffect(() => {
    fetchSection();
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ToasterContext;
