import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QcoutPage } from './qcout';

@NgModule({
  declarations: [
    QcoutPage,
  ],
  imports: [
    IonicPageModule.forChild(QcoutPage),
  ],
})
export class QcoutPageModule {}
