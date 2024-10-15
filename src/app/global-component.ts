export const GlobalComponent = {

  headerToken: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },

  AUTH_API : 'http://localhost:1919/auth/',

  API_URL : 'http://localhost:1919/',

  models: 'modelSTT/',
  ENTREPRISE: 'entreprise/',
  DEPARTEMENT:'departement/',
  CATEGORIE:'categorie/',
  ACTIF:'actif/',
  RISQUE:'risque/',
  Projet:'projet/',
  user: 'user/',
  VULNERABILITE:'vulnerabilite/'



}
