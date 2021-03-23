import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionDetailPageRoutingModule } from './subscription-detail-routing.module';

import { SubscriptionDetailPage } from './subscription-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionDetailPageRoutingModule
  ],
  declarations: [SubscriptionDetailPage]
})
export class SubscriptionDetailPageModule {}
