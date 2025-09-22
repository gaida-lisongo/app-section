const CycleFooter = ({titre, id} : {titre: string, id: string}) => {
    return (
      <>
        <div className="mt-11 flex flex-wrap gap-4 md:items-center md:justify-between md:gap-0">
          <ul className="flex items-center gap-6">
            <li>
              <h2 className="text-3xl font-semibold text-black dark:text-white 2xl:text-sectiontitle2">
                
              </h2>
            </li>
          </ul>
  
          <ul className="flex items-center gap-4">
            <li>
              <a
                href={`#`}
                className="pr-2 duration-300 ease-in-out hover:text-primary"
              >
                Cycle: {titre}
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  };
  
  export default CycleFooter;
  