import PaymentForm from "@/components/Payment/PaymentForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Paiement Résultats | Plateforme de Renforcement Académique",
  description: "Effectuez le paiement pour accéder à vos résultats académiques.",
};

// Composant de fallback pour le loading
const PaymentFormSkeleton = () => (
  <div className="w-full">
    <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 animate-pulse"></div>
              {step < 3 && <div className="mx-2 h-5 w-5 bg-gray-200 animate-pulse"></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PaymentPage = () => {
  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
          <Suspense fallback={<PaymentFormSkeleton />}>
            <PaymentForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
