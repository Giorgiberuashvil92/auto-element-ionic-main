import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAdsPageRoutingModule } from './add-ads-routing.module';

import { AddAdsPage } from './add-ads.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddAdsPageRoutingModule,
        CoreModule
    ],
  declarations: [AddAdsPage]
})
export class AddAdsPageModule {}
