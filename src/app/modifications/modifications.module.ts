import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificationsPageRoutingModule } from './modifications-routing.module';

import { ModificationsPage } from './modifications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificationsPageRoutingModule
  ],
  declarations: [ModificationsPage]
})
export class ModificationsPageModule {}
