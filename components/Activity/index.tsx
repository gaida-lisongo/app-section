"use client";
import SectionHeader from "../Common/SectionHeader";

import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { motion } from "framer-motion";
import { testimonialData } from "./testimonialData";
import SingleActivity from "./SingleActivity";
import { useSectionStore } from "@/store";
import { useEffect, useState } from "react";

const Activities = () => {
  const [items, setItems] = useState<{id: number, name: string, designation: string, image: string, content: string}[] | []>([]);
  const [annee, setAnnee] = useState<string>("");
  const { section } = useSectionStore();

  useEffect(() => {
    console.log("Section mise à jour dans Activities:", section);
    let activities : {id: number, name: string, designation: string, image: string, content: string}[] = [];
    if (section && section.calendrier && section.calendrier.length > 0) {
      section.calendrier.forEach((cal) => {
        if (cal.current && cal.activities && cal.activities.length > 0) {
          setAnnee(cal.annee);
          cal.activities.forEach((act, index) => {
            activities.push({
              id: act._id ?? index,
              name: act.titre,
              designation: new Date(act.date_activity).toLocaleDateString(),
              image: section?.description?.images[0] || "/images/user/user-01.png", // Image par défaut ou basée sur l'activité
              content: act.description
            });
          });
        }
      });
    }
    setItems(activities);
  }, [section]);

  if (!section) {
    return null;
  }


  return (
    <>
      <section>
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `${annee ? `Année Académique ${annee}` : ""}`,
                subtitle: `Activités et Événements `,
                description: `Découvrez les moments forts et les événements marquants de notre institution au cours de l'année académique ${annee}.`,
              }}
            />
          </div>
          {/* <!-- Section Title End --> */}
        </div>

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
          className="animate_top mx-auto mt-15 max-w-c-1235 px-4 md:px-8 xl:mt-20 xl:px-0"
        >
          {/* <!-- Slider main container --> */}
          <div className="swiper testimonial-01 mb-20 pb-22.5">
            {/* <!-- Additional required wrapper --> */}
            <Swiper
              spaceBetween={50}
              slidesPerView={2}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
              breakpoints={{
                // when window width is >= 640px
                0: {
                  slidesPerView: 1,
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 2,
                },
              }}
            >
              {items ? items.map((review) => (
                <SwiperSlide key={review?.id}>
                  <SingleActivity review={review} />
                </SwiperSlide>
              )) : null}
            </Swiper>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Activities;
