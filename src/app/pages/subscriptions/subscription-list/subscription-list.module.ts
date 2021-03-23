import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionListPageRoutingModule } from './subscription-list-routing.module';

import { SubscriptionListPage } from './subscription-list.page';
import {CoreModule} from "../../../core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SubscriptionListPageRoutingModule,
        CoreModule
    ],
  declarations: [SubscriptionListPage]
})
export class SubscriptionListPageModule {}
