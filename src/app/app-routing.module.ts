import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { LayoutComponent } from './layouts/layout.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthGuard } from './core/guards/auth.guard';
import {AdminGuard} from "./core/guards/admin.guard";
import {userGuard} from "./core/guards/user.guard";
import {LayoutComponentUser} from "./layout-user/layout.component";

const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AdminGuard] },
  { path: 'User', component: LayoutComponentUser, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [userGuard]  },
  { path: 'auth', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages',component: AuthlayoutComponent, loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule)/*,canActivate: [userGuard]*/},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
