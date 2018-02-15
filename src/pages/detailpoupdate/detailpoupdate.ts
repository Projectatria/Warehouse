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
  selector: 'page-detailpoupdate',
  templateUrl: 'detailpoupdate.html',
})
export class DetailpoupdatePage {
  myForm: FormGroup;
  private items = [];
  private nextno = '';
  private docno = '';
  private orderno = '';
  private itemno = '';
  private qty = '';
  private unit = '';

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
    this.docno = navParams.get('docno')
    this.orderno = navParams.get('orderno');
    this.itemno = navParams.get('itemno');
    this.qty = navParams.get('qty');
    this.unit = navParams.get('unit');
    this.myForm.get('docno').setValue(this.docno);
    this.myForm.get('orderno').setValue(this.orderno);
    this.myForm.get('itemno').setValue(this.itemno);
    this.myForm.get('qty').setValue(this.qty);
    this.myForm.get('unit').setValue(this.unit);
  }
  getItems() {
    this.api.get('table/items', { params: { limit: 100 } }).subscribe(val => {
      this.items = val['data'];
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasingorderupdatePage');
    console.log(this.nextno);
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  onChange(item) {
    console.log('Testing',item);
    this.item = item;
  }
  updatePODetail() {
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.put("table/purchasing_order_detail",
        {
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
          console.log("Update call successful value returned in body",
            val);
          this.myForm.reset()
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Update Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.viewCtrl.dismiss();
        },
        response => {
          console.log("Update call in error", response);
        },
        () => {
          console.log("The Update observable is now completed.");
        });
  }
}
