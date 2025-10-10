import { Metadata } from "next";
import SectionLoader from "@/components/Common/SectionLoader";
import SideBar from "@/components/Enseignement/SideBar";

export const metadata: Metadata = {
  title: {
    default: "Enseignements | Plateforme de Renforcement Académique",
    template: "%s | Enseignements - Plateforme de Renforcement"
  },
  description: "Section dédiée aux programmes d'enseignement et de renforcement académique personnalisés.",
};

export default async function StudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
        <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
            <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
                <div className="flex flex-col-reverse gap-7.5 lg:flex-row xl:gap-12.5">
                    <SideBar />
                    {children}
                </div>
            </div>    
        </section>
    </div>
  );
}