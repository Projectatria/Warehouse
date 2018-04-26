import { Component } from '@angular/core';
import { ActionSheetController, Platform, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FileChooser } from "@ionic-native/file-chooser";
import { FileOpener } from "@ionic-native/file-opener";
import { FilePath } from "@ionic-native/file-path";
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-purchasingorder',
  templateUrl: 'purchasingorder.html',
})
export class PurchasingorderPage {
  myFormModal: FormGroup;
  private users = [];
  private purchasing_order = [];
  private infopo = [];
  private preparation = [];
  private usertoken = [];
  searchpo: any;
  searchpoaction: any;
  searchinfopo: any;
  searchpreparation: any;
  items = [];
  halaman = 0;
  halamaninfopo = 0;
  halamanpreparation = 0;
  totaldata: any;
  totaldataitem: any;
  totaldatainfopo: any;
  totaldatapreparation: any;
  public toggled: boolean = false;
  orderno = '';
  po: string;
  private width: number;
  private height: number;
  private datearrival = '';
  filter = '';
  sortPO = '';
  sortInfoPO = '';
  sortPrepare = '';
  private token: any;
  private userpic = '';
  private poid = '';
  public userid:any;
  public role = [];
  public roleid = '';

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
    private platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    private http: HttpClient
  ) {
    this.myFormModal = formBuilder.group({
      pic: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    })
    this.getPO();
    this.getInfoPO();
    this.getPrepare();
    this.toggled = false;
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
      this.storage.get('userid').then((val) => {
        this.userid = val;
        this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'" } })
        .subscribe(val => {
          this.preparation = val['data'];
        });
        this.api.get('table/user_role', { params: { filter: "id_user=" + "'" + this.userid + "'" } })
        .subscribe(val => {
          this.role = val['data']
          this.roleid = this.role[0].id_group
          if (this.roleid != "ADMIN") {
            this.po = "preparation"
          }
          else {
            this.po = "purchasingorder"
          }
        })
      });
    });
    this.sortPO = ''
    this.sortInfoPO = ''
    this.sortPrepare = ''
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
  ionViewDidLoad() {
  }
  getPO() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset, filter: "status='OPEN'" } })
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
  getInfoPO() {
    return new Promise(resolve => {
      let offsetinfopo = 30 * this.halamaninfopo
      if (this.halamaninfopo == -1) {
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
      if (this.halamanpreparation == -1) {
        resolve();
      }
      else {
        this.halamanpreparation++;
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offsetprepare, filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'" } })
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
  getSearchPO(ev: any) {
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
  getSearchInfoPO(ev: any) {
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
      status: prepare.status,
      totalpost: prepare.total_item_post
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
                    this.purchasing_order = val['data'];
                    this.totaldata = val['count'];
                    this.searchpo = this.purchasing_order;
                  });
                },
                response => {

                },
                () => {

                });
          }
        }
      ]
    });
    alert.present();
  }
  doRefresh(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
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
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'"  } }).subscribe(val => {
      this.preparation = val['data'];
      this.totaldatapreparation = val['count'];
      this.searchpreparation = this.preparation;
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
      message: 'Do you want to posting  ' + po.order_no + ' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Posting',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");

            let date = moment().format('YYYY-MM-DD');
            this.api.put("table/purchasing_order",
              {
                "po_id": po.po_id,
                "posting_date": date,
                "status": 'INP1',
                "user_id": ''
              },
              { headers })
              .subscribe(
                (val) => {
                  let alert = this.alertCtrl.create({
                    title: 'Sukses',
                    subTitle: 'Posting Sukses',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
                    this.purchasing_order = val['data'];
                    this.totaldata = val['count'];
                    this.searchpo = this.purchasing_order;
                  });

                },
                response => {

                },
                () => {

                });
          }
        }
      ]
    });
    alert.present();
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
                  this.doSendNotificationPic(info)
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
                },
                () => {
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

                },
                () => {

                });
          }
        }
      ]
    });
    alert.present();
  }
  doOpenOptions(po) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          icon: 'md-checkmark-circle-outline',
          text: 'Posting',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Confirm Posting',
              message: 'Do you want to posting  ' + po.order_no + ' ?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {

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
                        "status": 'INP1',
                        "user_id": ''
                      },
                      { headers })
                      .subscribe(
                        (val) => {
                          let alert = this.alertCtrl.create({
                            title: 'Sukses',
                            subTitle: 'Posting Sukses',
                            buttons: ['OK']
                          });
                          alert.present();
                          this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
                            this.purchasing_order = val['data'];
                            this.totaldata = val['count'];
                            this.searchpo = this.purchasing_order;
                          });

                        },
                        response => {

                        },
                        () => {

                        });
                  }
                }
              ]
            });
            alert.present();
          }
        },
        {
          icon: 'md-open',
          text: 'Update',
          handler: () => {
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
        },
        {
          icon: 'md-trash',
          text: 'Delete',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Confirm Delete',
              message: 'Are you sure you want to delete  ' + po.order_no + ' ?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {

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
                          this.api.get("table/purchasing_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
                            this.purchasing_order = val['data'];
                            this.totaldata = val['count'];
                            this.searchpo = this.purchasing_order;
                          });
                        },
                        response => {

                        },
                        () => {

                        });
                  }
                }
              ]
            });
            alert.present();
          }
        },
        {
          icon: 'md-close',
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();
  }
  doListBarcode(prepare) {
    let locationModal = this.modalCtrl.create('BarcodelistPage', {
      batchno: prepare.batch_no,
      orderno: prepare.order_no
    },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  doSortPO(filter) {
    if (this.sortPO == 'ASC') {
      this.sortPO = 'DESC'
    }
    else {
      this.sortPO = 'ASC'
    }
    this.api.get("table/purchasing_order", { params: { filter: "status='OPEN'", sort: filter + " " + this.sortPO + " " } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.filter = filter
    });
  }
  doSortInfoPO(filter) {
    if (this.sortInfoPO == 'ASC') {
      this.sortInfoPO = 'DESC'
    }
    else {
      this.sortInfoPO = 'ASC'
    }
    this.api.get("table/purchasing_order", { params: { filter: "status='INP1'", sort: filter + " " + this.sortInfoPO + " " } }).subscribe(val => {
      this.infopo = val['data'];
      this.totaldatainfopo = val['count'];
      this.filter = filter
    });
  }
  doSortPrepare(filter) {
    if (this.sortPrepare == 'ASC') {
      this.sortPrepare = 'DESC'
    }
    else {
      this.sortPrepare = 'ASC'
    }
    this.api.get("table/purchasing_order", { params: { filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'" , sort: filter + " " + this.sortPrepare + " " } }).subscribe(val => {
      this.preparation = val['data'];
      this.totaldatapreparation = val['count'];
      this.filter = filter
    });
  }
  selectdatePO(datearrivalPO) {
    if (datearrivalPO == '') {
      this.api.get("table/purchasing_order", { params: { filter: "status='OPEN'" } }).subscribe(val => {
        this.purchasing_order = val['data'];
        this.totaldata = val['count'];
      });
    }
    else {
      this.api.get("table/purchasing_order", { params: { filter: "status='OPEN'" + " AND " + "transfer_date=" + "'" + datearrivalPO + "'" } }).subscribe(val => {
        this.purchasing_order = val['data'];
        this.totaldata = val['count'];
      });
    }
  }
  selectdateInfoPO(datearrivalInfoPO) {
    if (datearrivalInfoPO == '') {
      this.api.get("table/purchasing_order", { params: { filter: "status='INP1'" } }).subscribe(val => {
        this.infopo = val['data'];
        this.totaldatainfopo = val['count'];
      });
    }
    else {
      this.api.get("table/purchasing_order", { params: { filter: "status='INP1'" + " AND " + "transfer_date=" + "'" + datearrivalInfoPO + "'" } }).subscribe(val => {
        this.infopo = val['data'];
        this.totaldatainfopo = val['count'];
      });
    }
  }
  selectdatePrepare(datearrivalPrepare) {
    if (datearrivalPrepare == '') {
      this.api.get("table/purchasing_order", { params: { filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'"  } }).subscribe(val => {
        this.preparation = val['data'];
        this.totaldatapreparation = val['count'];
      });
    }
    else {
      this.api.get("table/purchasing_order", { params: { filter: "status='INP2'" + " AND " + "pic=" + "'" + this.userid + "'"  + " AND " + "transfer_date=" + "'" + datearrivalPrepare + "'" } }).subscribe(val => {
        this.preparation = val['data'];
        this.totaldatapreparation = val['count'];
      });
    }
  }
  getUsers() {
    this.api.get('table/user', { params: { limit: 100 } }).subscribe(val => {
      this.users = val['data'];
    });
  }
  doOpenToPIC(info) {
    this.getUsers();
    this.myFormModal.get('pic').setValue(info.pic);
    document.getElementById("myModalPic").style.display = "block";
    this.poid = info.po_id;
  }
  doOffToPIC() {
    document.getElementById("myModalPic").style.display = "none";
    this.myFormModal.reset()
  }
  onChange(user) {
    this.userpic = user.id_user;
  }
  doSendToPic() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/purchasing_order",
      {
        "po_id": this.poid,
        "pic": this.myFormModal.value.pic
      },
      { headers })
      .subscribe(
        (val) => {
          document.getElementById("myModalPic").style.display = "none";
          this.myFormModal.reset()
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.getInfoPO();
        },
        response => {
        },
        () => {
        });
  }
  doSendNotificationPic(info) {
    this.api.get("table/user", { params: { filter: "id_user=" + "'" + info.pic + "'" } })
      .subscribe(val => {
        this.usertoken = val['data'];
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": "key=AAAAtsHtkUc:APA91bF8isugU-XkNTVVYVC-eQQJxn1UI4wBqUcbuXNvh2yUAS3CfDCxDB8himPNr4wJx8f5KPezZpY_jpTr8_WegNEiJ1McJAriwYJZ5iOv0Q1X6CXnDn_xZeGbWX-V6DnPk7XImX5L"
        })
        this.http.post("https://fcm.googleapis.com/fcm/send",
          {
            "to": this.usertoken[0].token,
            "notification": {
              "body": this.usertoken[0].name + ", You have new job ",
              "title": "Atria Warehouse",
              "content_available": true,
              "priority": 2,
              "sound": "default",
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "color": "#FFFFFF",
              "icon": "atria"
            },
            "data": {
              "body": this.usertoken[0].name + ", You have new job ",
              "title": "Atria Warehouse",
              "userid": this.usertoken[0].id_user,
              "name": this.usertoken[0].name
            }
          },
          { headers })
          .subscribe(data => {
          }, (e) => {
          });
      });

  }

}