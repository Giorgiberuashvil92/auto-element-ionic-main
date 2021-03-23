import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdsPageRoutingModule } from './ads-routing.module';

import { AdsPage } from './ads.page';
import {AddComponent} from './add/add.component';
import {PhotoUploadComponent} from './photoUpload/photoUpload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdsPageRoutingModule,
  ],
  entryComponents: [AddComponent, PhotoUploadComponent],
  declarations: [AdsPage, AddComponent, PhotoUploadComponent]
})
export class AdsPageModule {}
