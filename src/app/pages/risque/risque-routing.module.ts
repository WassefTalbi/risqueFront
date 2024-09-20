import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RisqueComponent } from './risque.component';






const routes: Routes = [
  {
    path: "overview/:id",
    component: RisqueComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RisqueRoutingModule { }
