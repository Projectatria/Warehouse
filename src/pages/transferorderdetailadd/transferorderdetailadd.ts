import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-transferorderdetailadd',
  templateUrl: 'transferorderdetailadd.html',
})
export class TransferorderdetailaddPage {
  myForm: FormGroup;
  private items = [];
  private nextno = '';
  private nextnorcv = '';
  item: any = {};
  private itemdesc = '';
  private itemdiv = '';
  private tono = '';
  private locationcode = '';
  private transferdate = '';
  private uuid = '';
  private uuid2 = '';
  totalitem: any;
  totalcount: any;
  private token: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.myForm = fb.group({
      tono: ['', Validators.compose([Validators.required])],
      locationcode: ['', Validators.compose([Validators.required])],
      transferdate: ['', Validators.compose([Validators.required])],
      itemno: ['', Validators.compose([Validators.required])],
      qty: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
    })
    this.getItems();
    this.tono = navParams.get('tono');
    this.locationcode = navParams.get('locationcode');
    this.transferdate = navParams.get('transferdate');
    this.myForm.get('tono').setValue(this.tono);
    this.myForm.get('locationcode').setValue(this.locationcode);
    this.myForm.get('transferdate').setValue(this.transferdate);
  }
  ionViewCanEnter() {
    this.storage.get('token').then((val) => {
      this.token = val;
      if (this.token != null) {
        return true;
      }
      else {
        return false;
      }
    });
  }
  getItems() {
    this.api.get('table/items', { params: { limit: 100 } }).subscribe(val => {
      this.items = val['data'];
    });
  }

  ionViewDidLoad() {

  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  onChange(item) {
    this.item = item;
    this.itemdesc = item.description;
    this.itemdiv = item.division_code;
  }
  insertTODetail() {
    this.getNextNo().subscribe(val => {
      this.nextno = val['nextno'];
      let uuid = UUID.UUID();
      this.uuid = uuid;
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/transfer_order_detail",
        {
          "to_detail_no": this.nextno,
          "to_no": this.tono,
          "item_no": this.myForm.value.itemno,
          "division": this.itemdiv,
          "date" : moment().format('YYYY-MM-DD'),
          "receipt_date": this.transferdate,
          "location_previous_code": '81003',
          "location_current_code": this.locationcode,
          "qty": this.myForm.value.qty,
          "qty_receiving": 0,
          "unit": this.myForm.value.unit,
          "status": 'OPEN',
          "uuid": this.uuid
        },
        { headers })
        .subscribe(
          (val) => {
            this.myForm.reset()
            let alert = this.alertCtrl.create({
              title: 'Sukses',
              subTitle: 'Insert Detail TO Sukses',
              buttons: ['OK']
            });
            alert.present();
            this.viewCtrl.dismiss();
          },
          response => {

          },
          () => {

          });
    });
  }
  getNextNo() {
    return this.api.get('nextno/transfer_order_detail/to_detail_no')
  }
}
