import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSellerPage } from './edit-seller.page';

const routes: Routes = [
  {
    path: '',
    component: EditSellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSellerPageRoutingModule {}
