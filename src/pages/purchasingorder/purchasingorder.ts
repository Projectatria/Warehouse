import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HomePage } from '../home/home';
import { HttpHeaders } from "@angular/common/http";
import { PurchasingorderupdatePage } from '../purchasingorderupdate/purchasingorderupdate';

@IonicPage()
@Component({
  selector: 'page-purchasingorder',
  templateUrl: 'purchasingorder.html',
})
export class PurchasingorderPage {
  private purchasing_order = [];
  searchpo: any;
  items = [];
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
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
    /* this.form = this.formBuilder.group({
       dccode: ['', Validators.compose([Validators.required])],
       docno: ['', Validators.compose([Validators.required])],
       orderno: ['', Validators.compose([Validators.required])],
       vendorno: ['', Validators.compose([Validators.required])],
       postingdate: ['', Validators.compose([Validators.required])] 
     });*/
    this.getPO();
    this.toggled = false;
    /*let self = this;
    setInterval( () => {
      this.getPO();
    }, 10);*/
  }
  getPO() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.purchasing_order.push(data[i]);
              this.totaldata = val['count'];
              this.searchpo = this.purchasing_order;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchPO(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.purchasing_order = this.searchpo.filter(po => {
        return po.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.purchasing_order = this.searchpo;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };
  viewDetail(po) {
    this.navCtrl.push('DetailpoPage', {
      param: po.order_no
    });
  }
  doAddPO() {
    let locationModal = this.modalCtrl.create('PurchasingorderaddPage', this.modalCtrl, { cssClass: "modal-fullscreen" });
    locationModal.present();
  }

  doInfinite(infiniteScroll) {
    this.getPO().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
  doUpdatePO(po) {
    let locationModal = this.modalCtrl.create('PurchasingorderupdatePage', {param: po}, { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  doDeletePO(po) {
    console.log({ param: po.order_no });
    this.api.delete("table/purchasing_order",
      {
        "order_no": { param: po.order_no }
      })
      .subscribe(
      (val) => {
        console.log("DELETE call successful value returned in body",
          val);
      },
      response => {
        console.log("DELETE call in error", response);
      },
      () => {
        console.log("The DELETE observable is now completed.");
      });
  }
  doRefresh(refresher) {
    this.api.get("table/purchasing_order").subscribe(val => {
      this.purchasing_order = val['data'];              
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
  }
}