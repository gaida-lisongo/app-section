import { motion } from 'framer-motion';

type Props = {
    data: {
        _id: string;
        annee: string;
        current: boolean;
        eventsId?: string[];
    }[],
    onClick?: (id : string) => void;
    selectedId?: string;
}

const GaleriePosts = ({data, onClick, selectedId} : Props) => {
    if(!data || data.length === 0) {
        return null;
    }
    
    // Trier les années par ordre décroissant (plus récente en premier)
    const sortedData = data.sort((a, b) => b.annee.localeCompare(a.annee));
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="animate_top mb-10 rounded-xl border border-stroke bg-white p-6 shadow-solid-13 dark:border-strokedark dark:bg-blacksection"
        >
            <div className="mb-6 text-center">
                <h4 className="text-2xl font-bold text-black dark:text-white mb-2">
                    Galerie par Année
                </h4>
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>

            <ul className="space-y-2">
                {sortedData.map(({ _id, annee, current, eventsId }, index) => {
                    const isSelected = selectedId === _id;
                    const isCurrent = current;
                    const eventCount = eventsId?.length || 0;
                    
                    return (
                        <motion.li 
                            key={_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="relative"
                        >
                            <button
                                onClick={() => onClick?.(_id)}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                                    isSelected 
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:transform hover:scale-102'
                                }`}
                            >
                                {/* Background animation */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform transition-transform duration-300 ${
                                    isSelected ? 'scale-100' : 'scale-0 group-hover:scale-100'
                                }`}></div>
                                
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isSelected 
                                                ? 'bg-white/20' 
                                                : 'bg-primary/10 group-hover:bg-primary/20'
                                        }`}>
                                            <svg className={`w-4 h-4 ${
                                                isSelected ? 'text-white' : 'text-primary'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`font-semibold text-lg ${
                                                    isSelected ? 'text-white' : 'text-black dark:text-white'
                                                }`}>
                                                    {annee}
                                                </span>
                                                
                                                {/* Badge année courante */}
                                                {isCurrent && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        isSelected 
                                                            ? 'bg-white/20 text-white' 
                                                            : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                                                    }`}>
                                                        Actuelle
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Nombre d'événements */}
                                            <p className={`text-sm ${
                                                isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                                {eventCount} événement{eventCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Arrow */}
                                    <div className={`transform transition-all duration-300 ${
                                        isSelected ? 'rotate-90 text-white' : 'group-hover:translate-x-1 text-gray-400'
                                    }`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-lg"
                                    />
                                )}
                            </button>
                        </motion.li>
                    );
                })}
            </ul>
            
            {/* Stats */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-6 pt-4 border-t border-stroke dark:border-strokedark"
            >
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Total années: {sortedData.length}</span>
                    <span>Total événements: {sortedData.reduce((acc, curr) => acc + (curr.eventsId?.length || 0), 0)}</span>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default GaleriePosts;