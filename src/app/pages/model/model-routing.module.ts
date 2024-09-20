import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeafletComponent} from "../maps/leaflet/leaflet.component";
import {SpeechToTextComponent} from "./speech-to-text/speech-to-text.component";

const routes: Routes = [
  {
    path: 'speechToText',
    component: SpeechToTextComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelRoutingModule {

}
