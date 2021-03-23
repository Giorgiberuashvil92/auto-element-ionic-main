import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StateRepairPage } from './state-repair.page';

const routes: Routes = [
  {
    path: '',
    component: StateRepairPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StateRepairPageRoutingModule {}
