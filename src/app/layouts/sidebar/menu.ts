import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [


  {
    id: 2,
    label: 'DASHBOARD',
    icon: 'ph-gauge',
    link: '/analytics',
    parentId: 2
 
  },
  {
    id: 3,
    label: 'Utilisateurs',
    icon: 'ri-apps-line',
    link: '/users/list',
    parentId: 1
  },
  {
    id: 4,
    label: 'Entreprises',
    icon: 'ri-apps-line',
    link: '/entreprises/list',
    parentId: 1
  },

 
  {
    id: 3,
    label: 'Actif',
    isTitle: true
  },
  {
    id: 4,
    label: 'categories',
    icon: 'ri-apps-line',
    link: '/categories/list',
    parentId: 3
  },
  {
    id: 4,
    label: 'Actifs',
    icon: 'ri-apps-line',
    link: '/actifs/list',
    parentId: 3
  }, 
 
]
