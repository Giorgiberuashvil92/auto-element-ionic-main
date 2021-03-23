import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAdsPageRoutingModule } from './my-ads-routing.module';

import {FilterPipe, MyAdsPage} from './my-ads.page';
import {CoreModule} from "../../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyAdsPageRoutingModule,
        CoreModule
    ],
  declarations: [MyAdsPage,FilterPipe]
})
export class MyAdsPageModule {}
