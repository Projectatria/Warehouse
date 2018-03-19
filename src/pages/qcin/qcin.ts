import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-qcin',
  templateUrl: 'qcin.html',
})
export class QcinPage {
  private quality_control = [];
  searchqc: any;
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
  qc: string = "qcin";
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
    this.getQC();
    this.toggled = false;
    this.qc = "qcin"
  }
  getQC() {
    return new Promise(resolve => {
      let offsetinfopo = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetinfopo, filter: "status='CLSD'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.quality_control.push(data[i]);
              this.totaldata = val['count'];
              this.searchqc = this.quality_control;
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
      this.quality_control = this.searchqc.filter(qc => {
        return qc.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.quality_control = this.searchqc;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getQC().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefresh(refresher) {
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status='CLSD'" } })
      .subscribe(val => {
        this.quality_control = val['data'];
        this.totaldata = val['count'];
        this.searchqc = this.quality_control;
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
      transferdate:qc.transfer_date,
      totalitem: qc.total_item,
      poid: qc.po_id
    });
  }
}