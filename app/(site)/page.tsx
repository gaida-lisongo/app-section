import { Metadata } from "next";
import Hero from "@/components/Hero";
import Feature from "@/components/Features";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Activities from "@/components/Activity";

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

export default function Home() {
  return (
    <main>
      <Hero />
      <FunFact />
      <Feature />
      <FeaturesTab />
      <Activities />
    </main>
  );
}
