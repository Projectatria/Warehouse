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
  selector: 'page-purchasingorderadd',
  templateUrl: 'purchasingorderadd.html',
})
export class PurchasingorderaddPage {
  myForm: FormGroup;
  private vendor = [];

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
    'vendorname': [
      { type: 'required', message: 'Vendor Name Must Be Fill' }
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
  ) 
  {
    this.myForm = fb.group({
      docno: ['', Validators.compose([Validators.required])],
      orderno: ['', Validators.compose([Validators.required])],
      vendorno: ['', Validators.compose([Validators.required])],
      vendorname: [''],
      transferdate: ['', Validators.compose([Validators.required])],
      locationcode: ['', Validators.compose([Validators.required])],
    })
    this.getVendor();
  }
  getVendor() {
    this.api.get('table/vendor',{params:{limit:100}}).subscribe(val => {
      this.vendor = val['data'];
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasingorderaddPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  } 
  insertPO() {
    //if (!this.myForm.valid) { return }
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.post("table/purchasing_order",
      {
        "po_id": '4',
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
