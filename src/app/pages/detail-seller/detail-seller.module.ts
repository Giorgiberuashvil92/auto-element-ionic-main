import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSellerPageRoutingModule } from './detail-seller-routing.module';

import { DetailSellerPage } from './detail-seller.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetailSellerPageRoutingModule,
        CoreModule
    ],
  declarations: [DetailSellerPage]
})
export class DetailSellerPageModule {}
