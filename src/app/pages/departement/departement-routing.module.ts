import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartementComponent } from './departement.component';




const routes: Routes = [
  {
    path: "list/:id",
    component: DepartementComponent
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartementRoutingModule { }
