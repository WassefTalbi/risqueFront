import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActifComponent } from './actif.component';





const routes: Routes = [
  {
    path: "list",
    component: ActifComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActifRoutingModule { }
