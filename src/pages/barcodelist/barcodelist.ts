import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-barcodelist',
  templateUrl: 'barcodelist.html',
})
export class BarcodelistPage {
  batchno = null;
  orderno = null;
  private barcode = [];
  private totaldata:any;
  constructor(public api: ApiProvider, public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private viewCtrl: ViewController) 
  {
    this.batchno = navParams.get('batchno');
    this.orderno = navParams.get('orderno');
    this.getItems();
  }
  getItems() {
    this.api.get("table/purchasing_order_detail", { params: { filter: 'order_no=' + "'" + this.orderno + "'" } }).subscribe(val => {
      this.barcode = val['data'];
      this.totaldata = val['count'];
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodelistPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  doPrint() {
    window.print();
  }
}
