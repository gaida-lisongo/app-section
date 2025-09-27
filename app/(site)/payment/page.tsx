import PaymentForm from "@/components/Payment/PaymentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement Résultats | Plateforme de Renforcement Académique",
  description: "Effectuez le paiement pour accéder à vos résultats académiques.",
};

const PaymentPage = () => {
  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
          <PaymentForm />
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
