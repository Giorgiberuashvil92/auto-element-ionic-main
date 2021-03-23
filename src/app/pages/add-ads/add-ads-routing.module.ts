import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAdsPage } from './add-ads.page';

const routes: Routes = [
  {
    path: '',
    component: AddAdsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAdsPageRoutingModule {}
