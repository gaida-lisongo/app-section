'use client';

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import EtudiantService from "@/app/services/EtudiantService";

const RecoveryPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState({
        new_passwd: "",
        confirm_passwd: "",
        message: "Veuillez définir votre nouveau mot de passe",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if(data.new_passwd !== data.confirm_passwd) {
                setData({ ...data, message: "Les mots de passe ne correspondent pas" });
                return;
            }

            const payload = {
                new_passwd: data.new_passwd,
                confirm_passwd: data.confirm_passwd,
                etudiantId: slug
            };
            console.log("Charge : ", payload);

            const req = await EtudiantService.updateSecure(slug, data.new_passwd);
            console.log("Reponse : ", req);

            if(req.success) {
                setData({ ...data, message: "Mot de passe modifié avec succès" });
                //Redirection vers /dashboard apres 2 secondes
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
                <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                    Définir le mot de passe
                </h2>

                <div className="mb-10 flex items-center justify-center">
                <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
                <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
                    {data.message}
                </p>
                <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                        <input
                            name="new_passwd"
                            type="text"
                            placeholder="Nouveau mot de passe"
                            value={data.new_passwd}
                            onChange={(e) =>
                                setData({ ...data, [e.target.name]: e.target.value })
                            }
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                        />

                        <input
                            name="confirm_passwd"
                            type="text"
                            placeholder="Confirmer le mot de passe"
                            value={data.confirm_passwd}
                            onChange={(e) =>
                                setData({ ...data, [e.target.name]: e.target.value })
                            }
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-10 md:justify-between xl:gap-15">
                        <button
                            aria-label="signup with email and password"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                        >
                            Definir le mot de passe
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
        </div>
    );
};

export default RecoveryPage;
