import { Semestre } from "@/types/etudiant";

const SemestresDetail = (
    {semestres}: {semestres: Semestre[]}
) => {
    console.log("Data semestres student :", semestres);
    return (
        <div>
            <h2>Semestres</h2>
            {semestres.map((semestre, index) => (
                <div key={index}>
                    <h3>{semestre.designation}</h3>
                </div>
            ))}
        </div>
    );
};

export default SemestresDetail;