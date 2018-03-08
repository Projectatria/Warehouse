import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-qcindetail',
  templateUrl: 'qcindetail.html',
})
export class QcindetailPage {
  private quality_control = [];
  searchqc: any;
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
  qc: string = "qcin";
  orderno = '';
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
    this.orderno = navParams.get('orderno')
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
        this.api.get('table/qc_in', { params: { limit: 30, offset: offsetinfopo, filter: 'order_no=' + "'" + this.orderno + "'" } })
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
        return qc.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
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
    this.api.get('table/qc_in', { params: { limit: 30, filter: 'order_no=' + "'" + this.orderno + "'" } })
      .subscribe(val => {
        this.quality_control = val['data'];
        this.totaldata = val['count'];
        this.searchqc = this.quality_control;
        refresher.complete();
      });
  }
  ionViewDidLoad() {
    console.log(this.orderno)
  }
}