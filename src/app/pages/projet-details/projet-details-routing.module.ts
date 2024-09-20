import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetDetailsComponent } from './projet-details.component';





const routes: Routes = [
  {
    path: "details/:id",
    component: ProjetDetailsComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjetDetailsRoutingModule { }
