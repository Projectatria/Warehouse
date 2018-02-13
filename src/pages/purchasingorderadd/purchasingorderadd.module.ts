import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PurchasingorderaddPage } from './purchasingorderadd';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PurchasingorderaddPage,
  ],
  imports: [
    IonicPageModule.forChild(PurchasingorderaddPage), ComponentsModule
  ],
})
export class PurchasingorderaddPageModule {}
