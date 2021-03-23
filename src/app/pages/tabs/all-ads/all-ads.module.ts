import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllAdsPageRoutingModule } from './all-ads-routing.module';

import {AllAdsPage, UnreadPipe} from './all-ads.page';
import {CoreModule} from "../../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AllAdsPageRoutingModule,
        CoreModule
    ],
  declarations: [AllAdsPage, UnreadPipe]
})
export class AllAdsPageModule {}
