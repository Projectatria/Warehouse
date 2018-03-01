import { Component } from '@angular/core';
import { ViewController, Platform, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-receiving',
  templateUrl: 'receiving.html',
})
export class ReceivingPage {
  myFormModal: FormGroup;
  private purchasing_order = [];
  private purchasing_order_action = [];
  searchpo: any;
  searchpoaction: any;
  items = [];
  halaman = 0;
  halamanaction = 0;
  totaldata: any;
  totaldataaction: any;
  totaldataitem: any;
  public toggled: boolean = false;
  orderno = '';
  rcv: string = "preparationreceiving";
  private width: number;
  private height: number;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public viewCtrl: ViewController

  ) {
    this.getPO();
    this.getPOAction();
    this.toggled = false;
    this.rcv = "preparationreceiving"
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
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
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset, filter: "status='inpg'" } })
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
  getPOAction() {
    return new Promise(resolve => {
      let offsetaction = 30 * this.halamanaction
      console.log('offset', this.halamanaction);
      if (this.halamanaction == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halamanaction++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetaction, filter: "status='inp1'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.purchasing_order_action.push(data[i]);
              this.totaldataaction = val['count'];
              this.searchpoaction = this.purchasing_order_action;
            }
            if (data.length == 0) {
              this.halamanaction = -1
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
  getSearchPOAction(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.purchasing_order_action = this.searchpoaction.filter(poact => {
        return poact.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.purchasing_order_action = this.searchpoaction;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };
  viewDetail(po) {
    this.navCtrl.push('ReceivingdetailPage', {
      orderno: po.order_no,
      docno: po.doc_no,
      batchno: po.batch_no,
      locationcode: po.location_code,
      transferdate: po.transfer_date,
      totalitem: po.total_item,
      poid: po.po_id
    });
  }
  viewDetailAction(poact) {
    this.navCtrl.push('DetailpoactionPage', {
      orderno: poact.order_no,
      docno: poact.doc_no,
      batchno: poact.batch_no,
      locationcode: poact.location_code,
      transferdate: poact.transfer_date
    });
  }
  doInfinite(infiniteScroll) {
    this.getPO().then(response => {
      infiniteScroll.complete();

    })
  }
  doInfiniteAction(infiniteScroll) {
    this.getPOAction().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefresh(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='inpg'" } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
  }
  doRefreshAction(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='inp1'" } }).subscribe(val => {
      this.purchasing_order_action = val['data'];
      this.totaldataaction = val['count'];
      this.searchpoaction = this.purchasing_order_action;
      refresher.complete();
    });
  }
  doPostingPO(po) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to Posting?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Posting',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");
            this.api.put("table/purchasing_order",
              {
                "po_id": po.po_id,
                "status": 'inpg',
                "user_id": ''
              },
              { headers })
              .subscribe(
                (val) => {
                  console.log("Posting call successful value returned in body",
                    val);
                  let alert = this.alertCtrl.create({
                    title: 'Sukses',
                    subTitle: 'Posting Sukses',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='inpg'" } }).subscribe(val => {
                    this.purchasing_order = val['data'];
                    this.totaldata = val['count'];
                    this.searchpo = this.purchasing_order;
                  });

                },
                response => {
                  console.log("Posting call in error", response);
                },
                () => {
                  console.log("The Posting observable is now completed.");
                });
          }
        }
      ]
    });
    alert.present();
  }
  doPostingRCV(poact) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Are you sure you want to posting  ' + poact.order_no + ' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Posting',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");

            this.api.put("table/purchasing_order",
              {
                "po_id": poact.po_id,
                "status": 'inpg'
              },
              { headers })
              .subscribe(
                (val) => {
                  console.log("Posting call successful value returned in body",
                    val);
                  let alert = this.alertCtrl.create({
                    title: 'Sukses',
                    subTitle: 'Posting Sukses',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='inp1'" } }).subscribe(val => {
                    this.purchasing_order_action = val['data'];
                    this.totaldataaction = val['count'];
                    this.searchpoaction = this.purchasing_order_action;
                  });

                },
                response => {
                  console.log("Posting call in error", response);
                },
                () => {
                  console.log("The Posting observable is now completed.");
                });
          }
        }
      ]
    });
    alert.present();
  }
  doListBarcode(poact) {
    let locationModal = this.modalCtrl.create('BarcodelistPage', {
      batchno: poact.batch_no,
      orderno: poact.order_no
    },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
}