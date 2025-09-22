"use client"

import { Cycle } from "@/app/services/CycleService"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const SideBar = ( {cyclesData } : { cyclesData: Cycle[] } ) => {
    const [activeClasseId, setActiveClasseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const pathname = usePathname();

    // Effet pour détecter l'URL actuelle et mettre à jour l'élément actif
    useEffect(() => {
        const pathSegments = pathname.split('/');
        const classeIdFromUrl = pathSegments[pathSegments.length - 1];
        
        // Vérifier si l'ID de l'URL correspond à une classe existante
        const allClasses = cyclesData?.flatMap(cycle => cycle.classes || []) || [];
        const foundClasse = allClasses.find(classe => classe._id === classeIdFromUrl);
        
        if (foundClasse) {
            setActiveClasseId(classeIdFromUrl);
        }
    }, [pathname, cyclesData]);

    const handleClasseClick = (classeId: string) => {
        setActiveClasseId(classeId);
    };

    // Filtrer les classes basé sur le terme de recherche
    const filteredClasses = cyclesData?.flatMap(cycle => 
        cycle.classes?.filter(classe => 
            classe.designation.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    ) || [];
    return (
        <div className="md:w-1/2 lg:w-[32%]">
        <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-3.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher une classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-stroke px-6 py-4 shadow-solid-12 focus:border-primary focus:outline-hidden dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
                />

                <div className="absolute right-0 top-0 flex items-center p-5">
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="clear-search"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <svg
                        className="fill-black transition-all duration-300 hover:fill-primary dark:fill-white dark:hover:fill-primary"
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Section Cycles */}
        <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-6 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black dark:text-white">
                    Cycles d'études
                </h4>
                <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                    {cyclesData?.length || 0}
                </span>
            </div>
            
            <div className="space-y-2">
                {cyclesData?.map((cycle, index) => (
                    <div 
                        key={cycle._id || index}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <h5 className="font-medium text-black dark:text-white">
                                {cycle.designation}
                            </h5>
                            <span className="text-xs text-gray-500">
                                {cycle.classes?.length || 0} classe{(cycle.classes?.length || 0) > 1 ? 's' : ''}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Système: {cycle.systeme}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-9 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-2xl font-semibold text-black dark:text-white">
                    Classes
                </h4>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {cyclesData?.flatMap(cycle => cycle.classes || []).length || 0}
                </span>
            </div>

            <ul>
                {searchTerm && (
                    <li className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        {filteredClasses.length} résultat{filteredClasses.length > 1 ? 's' : ''} pour "{searchTerm}"
                    </li>
                )}
                {
                    (searchTerm ? filteredClasses : cyclesData?.flatMap(cycle => cycle.classes || []) || [])?.map((classe) => {
                        const isActive = activeClasseId === classe._id;
                        return (
                            <li 
                                key={classe._id} 
                                className={`mb-3 transition-all duration-300 last:mb-0 ${
                                    isActive 
                                        ? 'text-primary font-semibold bg-primary/10 rounded-lg px-3 py-2' 
                                        : 'hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 py-2'
                                }`}
                            >
                                <a 
                                    href={`/studies/${classe._id}`}
                                    onClick={() => handleClasseClick(classe._id || '')}
                                    className={`block w-full transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-primary font-semibold' 
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{classe.designation}</span>
                                        {isActive && (
                                            <svg 
                                                className="h-4 w-4 text-primary" 
                                                fill="currentColor" 
                                                viewBox="0 0 20 20"
                                            >
                                                <path 
                                                    fillRule="evenodd" 
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                    clipRule="evenodd" 
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="mt-1 text-xs text-primary/70">
                                            {classe.semestres?.length || 0} semestre{(classe.semestres?.length || 0) > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </a>
                            </li>
                        );
                    })
                }
                
                {/* Message si aucun résultat */}
                {searchTerm && filteredClasses.length === 0 && (
                    <li className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Aucune classe trouvée pour "{searchTerm}"
                    </li>
                )}
                {/* <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                <a href="#">Blog</a>
                </li>
                <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                <a href="#">Events</a>
                </li>
                <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                <a href="#">Grids</a>
                </li>
                <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                <a href="#">News</a>
                </li>
                <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                <a href="#">Rounded</a>
                </li> */}
            </ul>
        </div>

        {/* <RelatedPost /> */}
    </div>
    )
}

export default SideBar
