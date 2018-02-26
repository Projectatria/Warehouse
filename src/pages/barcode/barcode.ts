import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {
  barcode = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private viewCtrl: ViewController) 
  {
    this.barcode = navParams.get('barcode');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodelistPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
