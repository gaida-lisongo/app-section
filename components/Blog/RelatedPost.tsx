"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogData from "./blogData";
import PostModal from "./PostModal";

type AgendaType = {
  _id?: string;
  annee: string;
  current: boolean;
  events: {
    _id?: string;
    titre: string;
    date_event: Date | string;
    description: string;
  }[]
}

type EventType = {
  _id?: string;
  titre: string;
  date_event: Date | string;
  description: string;
}

const RelatedPost = ( { data, logo } : { data: AgendaType, logo: string } ) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<EventType | null>(null);

  const handlePostClick = (post: EventType) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };
  
  return (
    <>
      <div className="animate_top rounded-md border border-stroke bg-white p-9 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
        <h4 className="mb-7.5 text-2xl font-semibold text-black dark:text-white">
          Valve {data.annee} - Articles Récents
        </h4>

        <div>
          {data.events.sort((a, b) => (a.date_event > b.date_event ? -1 : 1)).slice(0, 3).map((post, key) => (
            <div
              className="mb-7.5 flex flex-wrap gap-4 xl:flex-nowrap 2xl:gap-6 cursor-pointer group"
              key={key}
              onClick={() => handlePostClick(post)}
            >
              {/* <div className="max-w-45 relative h-18 w-45 flex-shrink-0">
                {logo ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                    <Image 
                      fill 
                      src={logo} 
                      alt="Logo" 
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div> */}
              <div className="flex-1">
                <h5 className="text-md font-medium text-black transition-all duration-300 group-hover:text-primary dark:text-white dark:group-hover:text-primary line-clamp-2 leading-tight">
                  {post.titre}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(post.date_event).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {post.description.slice(0, 80)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <PostModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
          logo={logo}
        />
      </div>
    </>
  );
};

export default RelatedPost;
