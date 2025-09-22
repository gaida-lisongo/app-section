import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Acceuil",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Vie Académique",
    newTab: false,
    path: "/news",
  },
  {
    id: 2.1,
    title: "Apropos",
    newTab: false,
    path: "/about",
  },
  {
    id: 3,
    title: "Etudes",
    newTab: false,
    submenu: [
      {
        id: 30,
        title: "Enseignements",
        newTab: false,
        path: "/studies",
      },
      {
        id: 31,
        title: "Recherches",
        newTab: false,
        path: "/researches",
      },
      {
        id: 32,
        title: "Stages",
        newTab: false,
        path: "/stages",
      },
      {
        id: 33,
        title: "Enrollements",
        newTab: false,
        path: "/enrollements",
      },
      {
        id: 34,
        title: "Documents",
        newTab: false,
        path: "/documents",
      },
      // {
      //   id: 36,
      //   title: "404",
      //   newTab: false,
      //   path: "/error",
      // },
    ],
  },

  {
    id: 4,
    title: "Contact",
    newTab: false,
    path: "/support",
  },
];

export default menuData;
