import { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Produits | Plateforme de Renforcement Académique",
    template: "%s | Produits - Plateforme de Renforcement"
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
        {children}
    </div>
  );
}