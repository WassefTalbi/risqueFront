import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {LayoutComponentUser} from "./layout.component";
import {VerticalComponent} from "./vertical/vertical.component";
import {TopbarComponent} from "./topbar/topbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from "./footer/footer.component";
import {RightsidebarComponent} from "./rightsidebar/rightsidebar.component";
import {TwoColumnComponent} from "./two-column/two-column.component";
import {TwoColumnSidebarComponent} from "./two-column-sidebar/two-column-sidebar.component";
import {HorizontalComponent} from "./horizontal/horizontal.component";
import {HorizontalTopbarComponent} from "./horizontal-topbar/horizontal-topbar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {SimplebarAngularModule} from "simplebar-angular";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {TranslateModule} from "@ngx-translate/core";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxSpinnerModule} from "ngx-spinner";
import {LanguageService} from "../core/services/language.service";


@NgModule({
  declarations: [
    LayoutComponentUser,
    VerticalComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    RightsidebarComponent,
    TwoColumnComponent,
    TwoColumnSidebarComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    SimplebarAngularModule,
    BsDropdownModule.forRoot(),
    TranslateModule,
    CollapseModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxSpinnerModule.forRoot({type: 'ball-scale-multiple'})
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LanguageService],
  exports: [
    SidebarComponent,
  ]
})
export class LayoutUserModule { }
