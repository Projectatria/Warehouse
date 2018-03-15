import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  itemno = null;
  qty = null;
  i = null;
  arr = [];
  private barcode = [];
  private totaldata: any;
  constructor(public api: ApiProvider, public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private viewCtrl: ViewController) {
    this.batchno = navParams.get('batchno');
    this.orderno = navParams.get('orderno');
    this.itemno = navParams.get('itemno');
    this.qty = navParams.get('qty');
    this.getItems();
    for (this.i = 0; this.i < this.qty; this.i++) {
      this.arr.push(this.i);
    }
  }
  getItems() {
    this.api.get("table/purchasing_order_detail", {
      params:
        {
          filter: 'order_no=' + "'" + this.orderno + "'" +
            ' ' + 'and' + ' ' +
            'item_no=' + "'" + this.itemno + "'"
        }
    }).subscribe(val => {
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
