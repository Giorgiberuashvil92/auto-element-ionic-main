import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellersPageRoutingModule } from './sellers-routing.module';

import { SellersPage } from './sellers.page';
import {CoreModule} from "../../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SellersPageRoutingModule,
        CoreModule
    ],
    exports: [
        SellersPage
    ],
    declarations: [SellersPage]
})
export class SellersPageModule {}
