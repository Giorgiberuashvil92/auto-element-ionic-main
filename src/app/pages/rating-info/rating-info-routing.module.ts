import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RatingInfoPage } from './rating-info.page';

const routes: Routes = [
  {
    path: '',
    component: RatingInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingInfoPageRoutingModule {}
