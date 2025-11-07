"use client";
import EtudiantService from "@/app/services/EtudiantService";
import { useSectionStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";

const Reset = () => {
  const { section, fetchSection } = useSectionStore();

  const [data, setData] = useState({
    section: section?.description?.sigle ?? "",
    matricule: "",
    message: "",
  });

  useEffect(() => {
    fetchSection();
    console.log("Section:", section);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de reinitialisation:", data);

    setData({ ...data, message: "Reinitialisation en cours..." });

    try {
      const response = await EtudiantService.checkAccount({
        section: data.section,
        matricule: data.matricule,
      });
      console.log("Reinitialisation reussie:", response);
      setData({ ...data, message: "Reinitialisation reussie" });
    } catch (error) {
      console.error("Erreur lors de la reinitialisation:", error);
      setData({ ...data, message: "Erreur lors de la reinitialisation" });
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
        <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
          Récupération du compte
        </h2>

        <div className="mb-10 flex items-center justify-center">
          <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
          <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
            Veuillez insérer votre matricule (Voir l'administration)
          </p>
          <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
            <input
              name="section"
              type="text"
              placeholder="Section"
              value={data.section}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
            />

            <input
              name="matricule"
              type="text"
              placeholder="Matricule"
              value={data.matricule}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
            />
          </div>

          <div className="flex flex-wrap gap-10 md:justify-between xl:gap-15">
            <div className="mb-4 flex items-center">
              <span className="border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 group mt-1 flex h-5 min-w-[20px] items-center justify-center rounded-sm peer-checked:bg-primary">
                <svg
                  className="opacity-0 in-[.group]:peer-checked:opacity-100"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4ZM20 6L12 13L4 6H20ZM12 11.5L16.5 16H9.5L12 11.5Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <label
                htmlFor="default-checkbox"
                className="flex max-w-[425px] cursor-pointer select-none  pl-3"
              >
                {data.message ? data.message : "Compte non trouvé"}
              </label>
            </div>

            <button
              aria-label="signup with email and password"
              className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
            >
              Reinitialiser
              <svg
                className="fill-white"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          <div className="mt-12.5 border-t border-stroke py-5 text-center dark:border-strokedark">
            <p>
              Voulez-vous vous connecter ?{" "}
              <Link
                className="text-black hover:text-primary dark:text-white dark:hover:text-primary"
                href="/auth/signin"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
      {/* <!-- ===== SignUp Form End ===== --> */}
    </>
  );
};

export default Reset;
