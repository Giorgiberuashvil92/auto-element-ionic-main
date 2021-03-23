import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllAdsPage } from './all-ads.page';

const routes: Routes = [
  {
    path: '',
    component: AllAdsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAdsPageRoutingModule {}
