import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetComponent } from './projet.component';




const routes: Routes = [
  {
    path: "list/:id",
    component: ProjetComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjetRoutingModule { }
