import { Component } from '@angular/core';
import { Platform, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { FileChooser } from "@ionic-native/file-chooser";
import { FileOpener } from "@ionic-native/file-opener";
import { FilePath } from "@ionic-native/file-path";

@IonicPage()
@Component({
  selector: 'page-purchasingorder',
  templateUrl: 'purchasingorder.html',
})
export class PurchasingorderPage {
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
  po: string = "preparationpo";
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
    public fileChooser: FileChooser,
    public fileOpener: FileOpener,
    public filePath: FilePath,
    private platform: Platform
  ) {
    this.getPO();
    this.getPOAction();
    this.toggled = false;
    this.po = "preparationpo"
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
  }
  ionViewDidLoad() {
    console.log(this.width);
    console.log(this.height);
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
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset, filter: 'status=1' } })
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
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetaction, filter: 'status=2' } })
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
    this.navCtrl.push('DetailpoPage', {
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
  doAddPO() {
    let locationModal = this.modalCtrl.create('PurchasingorderaddPage', this.modalCtrl, { cssClass: "modal-fullscreen" });
    locationModal.present();
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

  doUpdatePO(po) {
    let locationModal = this.modalCtrl.create('PurchasingorderupdatePage',
      {
        poid: po.po_id,
        docno: po.doc_no,
        orderno: po.order_no,
        vendorno: po.vendor_no,
        transferdate: po.transfer_date,
        locationcode: po.location_code,
        description: po.posting_desc
      },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  doDeletePO(po) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete  ' + po.order_no + ' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");

            this.api.delete("table/purchasing_order", { params: { filter: 'po_id=' + "'" + po.po_id + "'" }, headers })
              .subscribe(
                (val) => {
                  console.log("DELETE call successful value returned in body",
                    val);
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=1' } }).subscribe(val => {
                    this.purchasing_order = val['data'];
                    this.totaldata = val['count'];
                    this.searchpo = this.purchasing_order;
                  });
                },
                response => {
                  console.log("DELETE call in error", response);
                },
                () => {
                  console.log("The DELETE observable is now completed.");
                });
          }
        }
      ]
    });
    alert.present();
  }
  doRefresh(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=1' } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
  }

  doRefreshAction(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=2' } }).subscribe(val => {
      this.purchasing_order_action = val['data'];
      this.totaldataaction = val['count'];
      this.searchpoaction = this.purchasing_order_action;
      refresher.complete();
    });
  }
  chooseFile() {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {
        this.fileOpener.open(resolvedFilePath, 'application/pdf').then(value => {
          alert('Sukses')
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      })
    })
  }

  doPostingPO(po) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Are you sure you want to posting  ' + po.order_no + ' ?',
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
                "status": '2',
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=1' } }).subscribe(val => {
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
                "status": '3'
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=2' } }).subscribe(val => {
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
  doFilter(filter) {
    this.api.get("table/purchasing_order", { params: { filter: 'status=1', sort: filter } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      console.log(this.purchasing_order);
      console.log(this.totaldata);
    });
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