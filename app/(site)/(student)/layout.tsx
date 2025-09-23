import { Metadata } from "next";
import AuthGuard from "@/components/Auth/AuthGuard";
import StudentInfo from "@/components/FunFact/StudentInfo";

export const metadata: Metadata = {
  title: {
    default: "Espace Étudiant | Plateforme de Renforcement Académique",
    template: "%s | Espace Étudiant - Plateforme de Renforcement"
  },
  description: "Espace personnel dédié aux étudiants pour accéder à leurs cours, documents et suivre leur progression académique.",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AuthGuard>
        <div className="container mx-auto mt-40 px-4 py-8">
          <StudentInfo />
          {children}
        </div>
      </AuthGuard>
    </div>
  );
}