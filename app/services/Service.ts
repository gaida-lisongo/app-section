import config from "./config";
import { Response, Section, Annee } from "../../types/section";

interface Service {
    fetchSection(): Promise<Section | null>;
    fetchAnnees(): Promise<Annee[] | null>;
}

class Service implements Service {
    private _id: string;

    constructor() {
        this._id = config._id;
        console.log("Current Id of section : ", this._id);
    }

    async fetchSection() : Promise<Section | null> {
        try {
            const res = await fetch(`${config.base_url}/section/${this._id}`);
            const data: Response = await res.json();
            console.log("Section data: ", data);  
            return data.success ? data.data as Section : null;
        } catch (error) {
            console.error("Error fetching section:", error);
            return null;
        }
    }

    async fetchAnnees() : Promise<Annee[] | null> {
        try {
            const res = await fetch(`${config.base_url}/annee`);
            const data: Annee[] = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching annees:", error);
            return null;
        }
        return null;
    }
}

export default Service;