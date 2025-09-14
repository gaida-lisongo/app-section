import Service from "./Service";
import config from "./config.json";
import { Etudiant } from "@/types/etudiant";

class HomeService extends Service {
    constructor() {
        super();
    }
    
    async submitInscription(data: Partial<Etudiant>): Promise<Etudiant | null> {
        try {
            const res = await fetch(`${config.base_url}/etudiant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            return result as Etudiant || null;
            
        } catch (error) {
            console.error("Network error submitting inscription:", error);
            return null;
        }
    }

}

export default new HomeService();