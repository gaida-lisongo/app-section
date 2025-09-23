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
    path: "/studies"
  },

  {
    id: 4,
    title: "Contact",
    newTab: false,
    path: "/support",
  },
];

export default menuData;
