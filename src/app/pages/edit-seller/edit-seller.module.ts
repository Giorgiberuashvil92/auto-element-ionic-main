import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSellerPageRoutingModule } from './edit-seller-routing.module';

import { EditSellerPage } from './edit-seller.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditSellerPageRoutingModule,
        CoreModule
    ],
  declarations: [EditSellerPage]
})
export class EditSellerPageModule {}
