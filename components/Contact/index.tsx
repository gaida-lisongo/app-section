"use client";
import ContactService from "@/app/services/ContactService";
import { useSectionStore } from "@/store";
import { Message } from "@/types/contact";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const Contact = () => {
  /**
   * Source: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
   * Reason: To fix rehydration error
   */
  const [hasMounted, setHasMounted] = React.useState(false);
  const [payload, setPayload] = React.useState<Message>({
    nom: "",
    email: "",
    objet: "",
    telephone: "",
    contenu: "",
    status: "PENDING",
  });
  const [message, setMessage] = React.useState<string | null>("Veuillez remplir tous les champs.");
  const { section, loading } = useSectionStore();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const handleSubmit = async () => {

    try {
      //Verifie les champs
      if (!payload.nom || !payload.email || !payload.objet || !payload.contenu) {
        setMessage("S'il vous plaît remplir tous les champs obligatoires.");
        return;
      }
      const response = await ContactService.sendMessage(payload);
      console.log('Response from server:', response);
      
      if(response?._id) {
        setMessage("Message envoyé avec succès!");
        // Reset form
        setPayload({
          nom: "",
          email: "",
          objet: "",
          telephone: "",
          contenu: "",
          status: "PENDING",
        });

        setTimeout(() => {
          setMessage("Veuillez remplir tous les champs.");
        }, 5000); // Clear message after 5 seconds
      } else {
        setMessage("Échec de l'envoi du message. Veuillez réessayer plus tard.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <>
      {/* <!-- ===== Contact Start ===== --> */}
      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15"
            >
              <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Envoyez nous un message
              </h2>

              <form
                action="https://formbold.com/s/unique_form_id"
                method="POST"
              >
                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    placeholder="Nom Complet"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    value={payload.nom}
                    onChange={(e) => setPayload({ ...payload, nom: e.target.value })}
                  />

                  <input
                    type="email"
                    placeholder="Addresse Email"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    value={payload.email}
                    onChange={(e) => setPayload({ ...payload, email: e.target.value })}
                  />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    placeholder="Objet"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    value={payload.objet}
                    onChange={(e) => setPayload({ ...payload, objet: e.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Numéro de téléphone"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    value={payload.telephone}
                    onChange={(e) => setPayload({ ...payload, telephone: e.target.value })}
                  />
                </div>

                <div className="mb-11.5 flex">
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    value={payload.contenu}
                    onChange={(e) => setPayload({ ...payload, contenu: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex flex-wrap gap-4 xl:justify-between ">
                  <div className="mb-4 flex md:mb-0">
                    
                    <label
                      htmlFor="default-checkbox"
                      className="flex max-w-[425px] cursor-pointer select-none pl-5"
                    >
                      {message}
                    </label>
                  </div>

                  <button
                    aria-label="send message"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Soumettre
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
              </form>
            </motion.div>

            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Nos Coordonnées
              </h2>

              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Notre Localisation
                </h3>
                <p>{section?.contact.addresse}</p>
              </div>
              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Adresse Email
                </h3>
                <p>
                  <a href="#">{ section?.contact.email }</a>
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Numéro de téléphone
                </h4>
                <p>
                  <a href="#">{ section?.contact.telephone }</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== Contact End ===== --> */}
    </>
  );
};

export default Contact;
