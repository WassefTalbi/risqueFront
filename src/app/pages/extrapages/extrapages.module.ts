import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

// Page Route
import { ExtraPagesRoutingModule } from './extrapages-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';

// Bootstrap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// Component
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermConditionsComponent } from './term-conditions/term-conditions.component';
import {CountUpModule} from "ngx-countup";
import {ModelsComponent} from "./models/models.component";
import {DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule} from "ngx-dropzone-wrapper";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxSliderModule} from "ngx-slider-v2";
import {RouterLink} from "@angular/router";
import {SimplebarAngularModule} from "simplebar-angular";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {UiSwitchModule} from "ngx-ui-switch";
import { UsersComponent } from './users/users.component';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  declarations: [
    ModelsComponent,
    StarterComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    ContactsComponent,
    TimelineComponent,
    FaqsComponent,
    PricingComponent,
    PrivacyPolicyComponent,
    TermConditionsComponent,
    UsersComponent
  ],
  imports: [
    BsDropdownModule,
    DropzoneModule,
    ModalModule,
    NgxSliderModule,
    PaginationModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule,
    SimplebarAngularModule,
    TooltipModule,
    UiSwitchModule,
    CountUpModule,
    CommonModule,
    ExtraPagesRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    AccordionModule.forRoot(),
    BsDatepickerModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExtrapagesModule { }
