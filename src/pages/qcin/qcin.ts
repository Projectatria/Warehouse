import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-qcin',
  templateUrl: 'qcin.html',
})
export class QcinPage {
  private staging_in = [];
  searchqc: any;
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
  qc: string = "qcin";
  private nextnoqc = '';

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController
  ) {
    this.getStagingin();
    this.toggled = false;
    this.qc = "qcin"
  }
  getStagingin() {
    return new Promise(resolve => {
      let offsetstagingin = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/staging_in', { params: { limit: 30, offset: offsetstagingin } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.staging_in.push(data[i]);
              this.totaldata = val['count'];
              this.searchqc = this.staging_in;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchQCDetail(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.staging_in = this.searchqc.filter(qc => {
        return qc.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.staging_in = this.searchqc;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getStagingin().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefresh(refresher) {
    this.api.get('table/staging_in', { params: { limit: 30 } })
      .subscribe(val => {
        this.staging_in = val['data'];
        this.totaldata = val['count'];
        this.searchqc = this.staging_in;
        refresher.complete();
      });
  }
  ionViewDidLoad() {

  }
  viewDetail(qc) {
    this.navCtrl.push('QcindetailPage', {
      orderno: qc.order_no,
      docno: qc.doc_no,
      batchno: qc.batch_no,
      locationcode: qc.location_code,
      transferdate: qc.transfer_date,
      totalitem: qc.total_item,
      poid: qc.po_id
    });
  }
  doOpenQty(staging) {
    let alert = this.alertCtrl.create({
      title: staging.item_no,
      inputs: [
        {
          name: 'qty',
          placeholder: 'Qty'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.api.get('nextno/qc_in/qc_no')
              .subscribe(val => {
                console.log('Get Next No')
                this.nextnoqc = val['nextno'];
                console.log('qc 1', this.nextnoqc)
                const headers = new HttpHeaders()
                  .set("Content-Type", "application/json");
                let date = moment().format('YYYY-MM-DD');
                this.api.post("table/qc_in",
                  {
                    "qc_no": this.nextnoqc,
                    "receiving_no": staging.receiving_no,
                    "doc_no": staging.doc_no,
                    "order_no": staging.order_no,
                    "batch_no": staging.batch_no,
                    "item_no": staging.item_no,
                    "pic": '12345',
                    "qty": data.qty,
                    "unit": staging.unit,
                    "staging": staging.staging,
                    "status": 'OPEN',
                    "uuid": UUID.UUID()
                  },
                  { headers })
                  .subscribe(val => {
                    console.log('Sukses 1')
                    const headers = new HttpHeaders()
                      .set("Content-Type", "application/json");
                    this.api.put("table/staging_in",
                      {
                        "staging_no": staging.staging_no,
                        "qty": staging.qty - data.qty
                      },
                      { headers })
                      .subscribe(val => {
                        console.log('Sukses 2')
                      });
                  });
              });
          }
        }
      ]
    });
    alert.present();
  }
}