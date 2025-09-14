import Image from "next/image";

interface SectionLoaderProps {
  logoSrc?: string;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({
  logoSrc,
  title = "Chargement de la section",
  subtitle = "Récupération des informations...",
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: {
      container: "min-h-[40vh]",
      logo: "w-16 h-16",
      logoInner: "inset-1",
      title: "text-lg",
      subtitle: "text-sm",
      progressBar: "w-48 h-1.5"
    },
    md: {
      container: "min-h-[60vh]",
      logo: "w-24 h-24",
      logoInner: "inset-2",
      title: "text-xl",
      subtitle: "text-base",
      progressBar: "w-64 h-2"
    },
    lg: {
      container: "min-h-[80vh]",
      logo: "w-32 h-32",
      logoInner: "inset-3",
      title: "text-2xl",
      subtitle: "text-lg",
      progressBar: "w-80 h-3"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <section className={`overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46 ${className}`}>
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className={`flex items-center justify-center ${currentSize.container}`}>
          <div className="text-center">
            {/* Logo de la section comme loader */}
            <div className="relative mb-8">
              <div className={`${currentSize.logo} mx-auto relative`}>
                {/* Cercle de chargement animé */}
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                
                {/* Logo au centre */}
                <div className={`absolute ${currentSize.logoInner} bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center overflow-hidden`}>
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt="Logo de la section"
                      width={size === "sm" ? 48 : size === "md" ? 64 : 96}
                      height={size === "sm" ? 48 : size === "md" ? 64 : 96}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  ) : (
                    <div className={`${size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-12 h-12"} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center`}>
                      <svg className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"} text-white`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Effet de pulsation */}
                <div className="absolute inset-0 border-2 border-blue-300 dark:border-blue-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
            
            {/* Texte de chargement */}
            <div className="space-y-3">
              <h3 className={`${currentSize.title} font-semibold text-gray-800 dark:text-white`}>
                {title}
              </h3>
              <p className={`${currentSize.subtitle} text-gray-600 dark:text-gray-400`}>
                {subtitle}
              </p>
              
              {/* Barre de progression animée */}
              <div className={`${currentSize.progressBar} bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
              
              {/* Points de chargement animés */}
              <div className="flex justify-center space-x-2 mt-4">
                <div className={`${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0s' }}></div>
                <div className={`${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionLoader;