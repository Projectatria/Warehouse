import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  barcode: string='';

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }

  scanBarcode(){
    let options = {
      orientation: 'landscape'
    }

      this.barcodeScanner.scan(options).then((barcodeData) => {
    // Success! Barcode data is here
    this.barcode=barcodeData.text;
   }, (err) => {
       // An error occurred
   });
  }

  cariInvoice(){
    
  }
}
