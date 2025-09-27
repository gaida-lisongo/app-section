import { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Résultats | Plateforme de Renforcement Académique",
    template: "%s | Résultats - Plateforme de Renforcement"
  },
  description: "Consultation des résultats et bulletins de notes des étudiants.",
};

export default async function StudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {children}
      </div>
    </section>
  );
}