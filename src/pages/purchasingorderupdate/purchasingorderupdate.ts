import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";


@IonicPage()
@Component({
  selector: 'page-purchasingorderupdate',
  templateUrl: 'purchasingorderupdate.html',
})
export class PurchasingorderupdatePage {
  myForm: FormGroup;
  private vendor = [];
  private nextno = '';
  private datapo = '';

  error_messages = {
    'docno': [
      { type: 'required', message: 'Doc No Must Be Fill' }

    ],
    'orderno': [
      { type: 'required', message: 'Order No Must Be Fill' }
    ],
    'vendorno': [
      { type: 'required', message: 'Vendor No Must Be Fill' }
    ],
    'transferdate': [
      { type: 'required', message: 'Transfer Date Must Be Fill' }
    ],
    'locationcode': [
      { type: 'required', message: 'Location Code Must Be Fill' }
    ]
  }
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
      vendorno: ['', Validators.compose([Validators.required])],
      transferdate: ['', Validators.compose([Validators.required])],
      locationcode: ['', Validators.compose([Validators.required])],
    })
    this.getVendor();
    this.datapo = navParams.get('param');
  }
  getVendor() {
    this.api.get('table/vendor', { params: { limit: 100 } }).subscribe(val => {
      this.vendor = val['data'];
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasingorderupdatePage');
    console.log(this.datapo);
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  insertPO() {
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");

      this.api.post("table/purchasing_order",
        {
          "po_id": this.nextno,
          "doc_no": this.myForm.value.docno,
          "order_no": this.myForm.value.orderno,
          "batch_no": '',
          "vendor_no": this.myForm.value.vendorno,
          "vendor_status": '',
          "transfer_date": this.myForm.value.transferdate,
          "posting_date": this.myForm.value.transferdate,
          "posting_desc": '',
          "location_code": this.myForm.value.locationcode,
          "status": '',
          "user_id": '',
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
  }
}
