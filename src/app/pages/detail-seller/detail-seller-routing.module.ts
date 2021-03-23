import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSellerPage } from './detail-seller.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSellerPageRoutingModule {}
