import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [

 
  {
    id: 1,
    label: 'Dashboard',
    icon: 'ri-apps-line',
    link: '/User/analytics',
    parentId: 8,
  },
  {
    id: 2,
    label: 'Entreprises',
    icon: 'ri-apps-line',
    link: '/User/entreprises/list',
    parentId: 1
  },   
   {
       id: 3,
       label: 'Actif',
       icon: 'ri-apps-line',
       parentId: 8,
       subItems: [
           {
               id: 4,
               label: 'Categorie',
               link: '/User/categories/list',
               parentId: 3
           },
           {
               id: 5,
               label: 'Liste des actif',
               link: '/User/actifs/list',
               parentId: 3
           },
          
       ]
   },

]
