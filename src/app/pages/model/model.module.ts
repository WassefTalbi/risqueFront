import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import {DROPZONE_CONFIG, DropzoneConfigInterface} from "ngx-dropzone-wrapper";


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModelRoutingModule
  ],
  providers: [
    DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
})
export class ModelModule { }
