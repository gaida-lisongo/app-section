export interface Response {
    success: boolean;
    message?: string;
    data?: any;
}

export interface Section {
    description: {
      sigle: string;
      designation: string;
      devise: string;
      objectif: string;
      images: string[];
      motChef: {
        photo: string;
        description: string;
      };
    };
    contact: {
      addresse: string;
      telephone: string;
      email: string;
      www: string;
    },
    _id: string;
    offres: {
      _id?: number;
      icon: string;
      titre: string;
      description: string;
    }[];
    calendrier: {
      _id?: number;
      current: boolean;
      annee: string;
      activities: {
        _id?: number;
        titre: string;
        date_activity: string;
        description: string;
      }[]
    }[];
    alumni: {
      description: string;
      nom: string;
      photo: string;
      titre: string;
      _id: string;
    }[];
    galery: any[];
    agenda: any[];
    missions: {
      _id?: string;
      titre: string;
      description: string;
    }[];
    history: any[];
    team: {
        photo: string;
        nom: string;
        grade: string;
        fonction: "Chef de Section" | "Chargé de l'Enseignement" | "Chargé de la Recherche";
        _id: string;
    }[];
    valeurs: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Annee {
    _id: string;
    debut: number;
    fin: number;
    motDg: {
        photo: string;
        description: string;
    }
    articles: {
      author: string;
      sectionId: string;
      title: string;
      content: string;
      image: string;
      date: Date | string;
      _id: string;
      tags: string[];
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}