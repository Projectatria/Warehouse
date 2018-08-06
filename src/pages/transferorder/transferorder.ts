import { Component } from '@angular/core';
import { Events, LoadingController, ActionSheetController, Platform, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-transferorder',
  templateUrl: 'transferorder.html',
})
export class TransferorderPage {
  halamanto = 0;
  searchto: any;
  private transferorder = [];
  totaldatato: any;
  filter = '';
  sortTO = '';
  halamantolist = 0;
  searchtolist: any;
  private transferorderlist = [];
  totaldatatolist: any;
  sortTOList = '';
  to: string;
  private width: number;
  private height: number;
  public name: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public platform: Platform,
    public modalCtrl: ModalController,
    public storage: Storage,
    public alertCtrl: AlertController) {
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
      this.to = 'transferorder'
      this.storage.get('name').then((val) => {
        this.name = val;
      });
      this.api.get('table/transfer_order', { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
        this.transferorder = val['data']
        console.log(this.transferorder)
      });
      this.api.get('table/transfer_order', { params: { limit: 30, filter: "status='INPG'" } }).subscribe(val => {
        this.transferorderlist = val['data']
        console.log(this.transferorderlist)
      });
    })
    this.getTO()
  }
  doProfile() {
    this.navCtrl.push('UseraccountPage');
  }
  getTO() {
    return new Promise(resolve => {
      let offsetprepare = 30 * this.halamanto
      if (this.halamanto == -1) {
        resolve();
      }
      else {
        this.halamanto++;
        this.api.get('table/transfer_order', {
          params: {
            limit: 30, offset: offsetprepare, filter: "status='OPEN'"
          }
        })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.transferorder.push(data[i]);
              this.totaldatato = val['count'];
              this.searchto = this.transferorder;
            }
            if (data.length == 0) {
              this.halamanto = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchTO(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.transferorder = this.searchto.filter(to => {
        return to.to_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.transferorder = this.searchto;
    }
  }
  doInfiniteTO(infiniteScroll) {
    this.getTO().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefreshTO(refresher) {
    this.api.get("table/transfer_order", { params: { limit: 30, filter: "status='OPEN'" } }).subscribe(val => {
      this.transferorder = val['data'];
      this.totaldatato = val['count'];
      this.searchto = this.transferorder;
      refresher.complete();
    });
  }
  doSortTO(filter) {
    if (this.sortTO == 'ASC') {
      this.sortTO = 'DESC'
    }
    else {
      this.sortTO = 'ASC'
    }
    this.api.get("table/transfer_order", { params: { filter: "status='OPEN'", sort: filter + " " + this.sortTO + " " } }).subscribe(val => {
      this.transferorder = val['data'];
      this.totaldatato = val['count'];
      this.filter = filter
    });
  }
  doAddTO() {
    let locationModal = this.modalCtrl.create('TransferorderaddPage', this.modalCtrl, { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  viewDetailTO(to) {
    this.navCtrl.push('TransferorderdetailPage', {
      tono: to.to_no,
      locationcode: to.location_code,
      transferdate: to.transfer_date,
      status: to.status
    });
  }
  doPostingTO(to) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to posting  ' + to.to_no + ' ?',
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
            this.api.put("table/transfer_order",
              {
                "to_no": to.to_no,
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
  getTOList() {
    return new Promise(resolve => {
      let offsetprepare = 30 * this.halamantolist
      if (this.halamantolist == -1) {
        resolve();
      }
      else {
        this.halamantolist++;
        this.api.get('table/transfer_order', {
          params: {
            limit: 30, offset: offsetprepare, filter: "status='INPG'"
          }
        })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.transferorderlist.push(data[i]);
              this.totaldatatolist = val['count'];
              this.searchtolist = this.transferorderlist;
            }
            if (data.length == 0) {
              this.halamantolist = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchTOList(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.transferorderlist = this.searchto.filter(tolist => {
        return tolist.to_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.transferorderlist = this.searchtolist;
    }
  }
  doInfiniteTOList(infiniteScroll) {
    this.getTOList().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefreshTOList(refresher) {
    this.api.get("table/transfer_order", { params: { limit: 30, filter: "status='INPG'" } }).subscribe(val => {
      this.transferorderlist = val['data'];
      this.totaldatatolist = val['count'];
      this.searchtolist = this.transferorderlist;
      refresher.complete();
    });
  }
  doSortTOList(filter) {
    if (this.sortTOList == 'ASC') {
      this.sortTOList = 'DESC'
    }
    else {
      this.sortTOList = 'ASC'
    }
    this.api.get("table/transfer_order", { params: { filter: "status='INPG'", sort: filter + " " + this.sortTOList + " " } }).subscribe(val => {
      this.transferorderlist = val['data'];
      this.totaldatatolist = val['count'];
      this.filter = filter
    });
  }
  viewDetailTOList(tolist) {
    this.navCtrl.push('TransferorderdetailPage', {
      tono: tolist.to_no,
      locationcode: tolist.location_code,
      transferdate: tolist.transfer_date,
      status: tolist.status
    });
  }
  doPostingTOList(tolist) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to posting  ' + tolist.to_no + ' ?',
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
            this.api.put("table/transfer_order",
              {
                "to_no": tolist.to_no,
                "status": 'CLSD'
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

}
