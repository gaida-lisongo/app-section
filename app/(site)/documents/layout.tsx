import { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Documents | Plateforme de Renforcement Académique",
    template: "%s | Documents - Plateforme de Renforcement"
  },
  description: "Section dédiée aux documents d'enseignement et de renforcement académique personnalisés.",
};

export default async function DocumentsLayout({
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