import React from "react";
import Contact from "@/components/Contact";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Section Académique",
  description: "Institut de formation académique et professionnelle",
  keywords: ["institut", "formation", "académique", "éducation"],
  openGraph: {
    title: "Institut | Section Académique",
    description: "Institut de formation académique et professionnelle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Institut | Section Académique",
    description: "Institut de formation académique et professionnelle",
  },
};

const SupportPage = () => {
  return (
    <div className="pb-20 pt-40">
      <Contact />
    </div>
  );
};

export default SupportPage;
