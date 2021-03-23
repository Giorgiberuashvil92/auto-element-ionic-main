import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguagesPageRoutingModule } from './languages-routing.module';

import { LanguagesPage } from './languages.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LanguagesPageRoutingModule,
        CoreModule
    ],
  declarations: [LanguagesPage]
})
export class LanguagesPageModule {}
