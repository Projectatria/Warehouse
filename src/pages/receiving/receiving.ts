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
  private infopo = [];
  private preparation = [];
  searchpo: any;
  searchinfopo: any;
  searchpreparation: any;
  items = [];
  halaman = 0;
  halamaninfopo = 0;
  halamanpreparation = 0;
  totaldata: any;
  totaldatainfopo: any;
  totaldatapreparation: any;
  totaldataitem: any;
  public toggled: boolean = false;
  orderno = '';
  rcv: string = "infopo";
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
    this.getInfoPO();
    this.getPrepare();
    this.toggled = false;
    this.rcv = "infopo"
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
  }
  getInfoPO() {
    return new Promise(resolve => {
      let offsetinfopo = 30 * this.halamaninfopo
      console.log('offset', this.halamaninfopo);
      if (this.halamaninfopo == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halamaninfopo++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetinfopo, filter: "status='INP1'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.infopo.push(data[i]);
              this.totaldatainfopo = val['count'];
              this.searchinfopo = this.infopo;
            }
            if (data.length == 0) {
              this.halamaninfopo = -1
            }
            resolve();
          });
      }
    })

  }
  getPrepare() {
    return new Promise(resolve => {
      let offsetprepare = 30 * this.halamanpreparation
      console.log('offset', this.halamanpreparation);
      if (this.halamanpreparation == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halamanpreparation++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetprepare, filter: "status='INP2'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.preparation.push(data[i]);
              this.totaldatapreparation = val['count'];
              this.searchpreparation = this.preparation;
            }
            if (data.length == 0) {
              this.halamanpreparation = -1
            }
            resolve();
          });
      }
    })

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
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset, filter: "status='INPG'" } })
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
  getSearchInfoPO(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.infopo = this.searchinfopo.filter(infopo => {
        return infopo.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.infopo = this.searchinfopo;
    }
  }
  getSearchPrepare(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.preparation = this.searchpreparation.filter(prepare => {
        return prepare.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.preparation = this.searchpreparation;
    }
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
  viewDetailInfoPO(info) {
    this.navCtrl.push('DetailpoactionPage', {
      poid: info.po_id,
      orderno: info.order_no,
      docno: info.doc_no,
      batchno: info.batch_no,
      locationcode: info.location_code,
      transferdate: info.transfer_date,
      status: info.status
    });
  }
  
  viewDetailPrepare(prepare) {
    this.navCtrl.push('DetailpoactionPage', {
      poid: prepare.po_id,
      orderno: prepare.order_no,
      docno: prepare.doc_no,
      batchno: prepare.batch_no,
      locationcode: prepare.location_code,
      transferdate: prepare.transfer_date,
      status: prepare.status
    });
  }
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
  doInfiniteInfoPO(infiniteScroll) {
    this.getInfoPO().then(response => {
      infiniteScroll.complete();

    })
  }
  doInfiniteprepare(infiniteScroll) {
    this.getPrepare().then(response => {
      infiniteScroll.complete();

    })
  }
  doInfinite(infiniteScroll) {
    this.getPO().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
  doRefreshInfoPO(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INP1'" } }).subscribe(val => {
      this.infopo = val['data'];
      this.totaldatainfopo = val['count'];
      this.searchinfopo = this.infopo;
      refresher.complete();
    });
  }
  
  doRefreshPrepare(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INP2'" } }).subscribe(val => {
      this.preparation = val['data'];
      this.totaldatapreparation = val['count'];
      this.searchinfopo = this.preparation;
      refresher.complete();
    });
  }
  doRefresh(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INPG'" } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
  }
  doPostingInfoPO(info) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to posting Order No ' + info.order_no + ' ?',
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
                "po_id": info.po_id,
                "status": 'INP2'
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INP1'" } }).subscribe(val => {
                    this.infopo = val['data'];
                    this.totaldatainfopo = val['count'];
                    this.searchinfopo = this.infopo;
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
  doPostingPrepare(prepare) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to posting Order No  ' + prepare.order_no + ' ?',
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
                "po_id": prepare.po_id,
                "status": 'INPG'
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INP1'" } }).subscribe(val => {
                    this.infopo = val['data'];
                    this.totaldatainfopo = val['count'];
                    this.searchinfopo = this.infopo;
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
                "status": 'ready',
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INPG'" } }).subscribe(val => {
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
  doListBarcode(prepare) {
    let locationModal = this.modalCtrl.create('BarcodelistPage', {
      batchno: prepare.batch_no,
      orderno: prepare.order_no
    },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
}