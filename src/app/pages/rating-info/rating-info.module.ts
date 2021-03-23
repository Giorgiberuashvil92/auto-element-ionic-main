import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatingInfoPageRoutingModule } from './rating-info-routing.module';

import { RatingInfoPage } from './rating-info.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RatingInfoPageRoutingModule,
        CoreModule
    ],
  declarations: [RatingInfoPage]
})
export class RatingInfoPageModule {}
