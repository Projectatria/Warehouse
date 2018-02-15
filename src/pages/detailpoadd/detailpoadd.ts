import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";


/**
 * Generated class for the PurchasingorderaddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailpoadd',
  templateUrl: 'detailpoadd.html',
})
export class DetailpoaddPage {
  myForm: FormGroup;
  private items = [];
  private nextno = '';

  error_messages = {
    'docno': [
      { type: 'required', message: 'Doc No Must Be Fill' }

    ],
    'orderno': [
      { type: 'required', message: 'Order No Must Be Fill' }
    ],
    'itemno': [
      { type: 'required', message: 'Vendor No Must Be Fill' }
    ],
    'qty': [
      { type: 'required', message: 'Transfer Date Must Be Fill' }
    ],
    'unit': [
      { type: 'required', message: 'Location Code Must Be Fill' }
    ]
  }
  item:any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public api: ApiProvider,
    public alertCtrl: AlertController
  ) {
    this.myForm = fb.group({
      docno: ['', Validators.compose([Validators.required])],
      orderno: ['', Validators.compose([Validators.required])],
      itemno: ['', Validators.compose([Validators.required])],
      qty: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
    })
    this.getItems();
  }
  getItems() {
    this.api.get('table/items', { params: { limit: 100 } }).subscribe(val => {
      this.items = val['data'];
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasingorderaddPage');
    console.log(this.nextno);
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  onChange(item) {
    console.log('Testing',item);
    this.item = item;
  }
  insertPODetail() {
    this.getNextNo().subscribe(val => {
      this.nextno = val['nextno'];

      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/purchasing_order_detail",
        {
          "po_detail_no": this.nextno,
          "doc_no": this.myForm.value.docno,
          "order_no": this.myForm.value.orderno,
          "batch_no": '',
          "item_no": this.myForm.value.itemno,
          "description": '',
          "location_code": '',
          "transfer_date": '',
          "receiving_date": '',
          "qty": this.myForm.value.qty,
          "unit": this.myForm.value.unit,
          "division": '',
          "staging": '',
          "position": '',
          "status": '1',
          "receiving_pic": '',
          "chronology_no": ''
        },
        { headers })
        .subscribe(
        (val) => {
          console.log("POST call successful value returned in body",
            val);
          this.myForm.reset()
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Insert Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.viewCtrl.dismiss();
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        });
    });
  }
  getNextNo() {
    return this.api.get('nextno/purchasing_order_detail/po_detail_no')
  }
}
