import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificationsPage } from './modifications.page';

const routes: Routes = [
  {
    path: '',
    component: ModificationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificationsPageRoutingModule {}
