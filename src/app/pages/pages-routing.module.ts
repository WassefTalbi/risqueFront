import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  {
    path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  },
  {
    path: 'learning', loadChildren: () => import('./learning/learning.module').then(m => m.LearningModule)
  },
  {
    path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule)
  }, 
  {
    path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
  },
  {
    path: 'advance-ui', loadChildren: () => import('./advanceui/advanceui.module').then(m => m.AdvanceuiModule)
  },
  {
    path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'real-estate', loadChildren: () => import('./real-estate/real-estate.module').then(m => m.RealEstateModule)
  },
  {
    path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  },
  {
    path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
  },
  {
    path: 'tables', loadChildren: () => import('./table/table.module').then(m => m.TableModule)
  },
  {
    path: 'forms', loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
  },
  {
    path: 'custom-ui', loadChildren: () => import('./custom-ui/custom-ui.module').then(m => m.CustomUiModule)
  },
  {
    path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule)
  },
  {
    path: 'model', loadChildren: () => import('./model/model.module').then(m => m.ModelModule)
  },
  {
    path: 'entreprises', loadChildren: () => import('./entreprise/entreprise.module').then(m => m.EntrepriseModule)
  },
  {
    path: 'departements', loadChildren: () => import('./departement/departement.module').then(m => m.DepartementModule)
  },
  {
    path: 'projets', loadChildren: () => import('./projet/projet.module').then(m => m.ProjetModule)
  },
  {
    path: 'projet', loadChildren: () => import('./projet-details/projet-details.module').then(m => m.ProjetDetailsModule)
  },
  {
    path: 'categories', loadChildren: () => import('./categorie/categorie.module').then(m => m.CategorieModule)
  },
  {
    path: 'actifs', loadChildren: () => import('./actif/actif.module').then(m => m.ActifModule)
  },
  {
    path: 'risque-menace', loadChildren: () => import('./risque/risque.module').then(m => m.RisqueModule)
  },
  {
    path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),canActivate: [AdminGuard] 
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
