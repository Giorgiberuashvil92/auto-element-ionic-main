import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StateRepairPageRoutingModule } from './state-repair-routing.module';

import { StateRepairPage } from './state-repair.page';
import {CoreModule} from "../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StateRepairPageRoutingModule,
        CoreModule
    ],
  declarations: [StateRepairPage]
})
export class StateRepairPageModule {}
