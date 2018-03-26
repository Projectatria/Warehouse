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
  private quality_control = [];
  private qcresult = [];
  private qcinpic = [];
  searchstaging: any;
  searchqc: any;
  halaman = 0;
  totaldata: any;
  totaldataqc: any;
  totaldataqcresult: any;
  public toggled: boolean = false;
  qc: string = "qcin";
  private nextnoqc = '';
  public detailqc: boolean = false;
  private qclist = '';
  private batchnolist = '';

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
    this.detailqc = false;
    this.api.get('table/qc_in', { params: { limit: 30, filter: "pic='12345'" } })
      .subscribe(val => {
        this.quality_control = val['data'];
        this.totaldataqc = val['count'];
        this.searchqc = this.quality_control;
      });
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
              this.searchstaging = this.staging_in;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getStagingqc() {
    return new Promise(resolve => {
      let offsetqc = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/qc_in', { params: { limit: 30, offset: offsetqc, filter: "pic='12345'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.quality_control.push(data[i]);
              this.totaldataqc = val['count'];
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
  getSearchStagingDetail(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.staging_in = this.searchstaging.filter(qc => {
        return qc.order_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.staging_in = this.searchstaging;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfiniteStaging(infiniteScroll) {
    this.getStagingin().then(response => {
      infiniteScroll.complete();

    })
  }
  doInfiniteQC(infiniteScroll) {
    this.getStagingqc().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
  doRefreshStaging(refresher) {
    this.api.get('table/staging_in', { params: { limit: 30 } })
      .subscribe(val => {
        this.staging_in = val['data'];
        this.totaldata = val['count'];
        this.searchstaging = this.staging_in;
        refresher.complete();
      });
  }
  doRefreshmyqc(refresher) {
    this.api.get('table/qc_in', { params: { limit: 30, filter: "pic='12345'" } })
      .subscribe(val => {
        this.quality_control = val['data'];
        this.totaldataqc = val['count'];
        this.searchqc = this.quality_control;
        refresher.complete();
      });
  }
  ionViewDidLoad() {
  }
  viewDetail(myqc) {
    this.navCtrl.push('QcindetailPage', {
      qcno: myqc.qc_no,
      receivingno: myqc.receiving_no,
      orderno: myqc.order_no,
      batchno: myqc.batch_no,
      itemno: myqc.item_no,
      pic: myqc.pic,
      qty: myqc.qty,
      staging: myqc.staging
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
            this.api.get('table/qc_in', { params: { limit: 30, filter: "pic='12345'" + " AND " + "batch_no=" + "'" + staging.batch_no + "'" + " AND " + "item_no=" + "'" + staging.item_no + "'" } })
              .subscribe(val => {
                this.qcinpic = val['data'];
                if (this.qcinpic.length == 0) {
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
                              this.api.get('table/staging_in')
                                .subscribe(val => {
                                  this.staging_in = val['data'];
                                  this.totaldata = val['count'];
                                  this.searchstaging = this.staging_in;
                                  this.api.get('table/qc_in', { params: { limit: 30, filter: "pic='12345'" } })
                                    .subscribe(val => {
                                      this.quality_control = val['data'];
                                      this.totaldataqc = val['count'];
                                      this.searchqc = this.quality_control;
                                    });
                                });

                            });
                        });
                    });
                }
                else {
                  const headers = new HttpHeaders()
                    .set("Content-Type", "application/json");
                  let date = moment().format('YYYY-MM-DD');
                  this.api.put("table/qc_in",
                    {
                      "qc_no": this.qcinpic[0].qc_no,
                      "qty": parseInt(this.qcinpic[0].qty) + parseInt(data.qty)
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
                          this.api.get('table/staging_in')
                            .subscribe(val => {
                              this.staging_in = val['data'];
                              this.totaldata = val['count'];
                              this.searchstaging = this.staging_in;
                              this.api.get('table/qc_in', { params: { limit: 30, filter: "pic='12345'" } })
                                .subscribe(val => {
                                  this.quality_control = val['data'];
                                  this.totaldataqc = val['count'];
                                  this.searchqc = this.quality_control;
                                });
                            });

                        });
                    });
                }
              });
          }
        }
      ]
    });
    alert.present();
  }
  doDetailQC(myqc) {
    this.qcresult = [];
    this.qclist = myqc.item_no;
    this.batchnolist = myqc.batch_no;
    this.detailqc = this.detailqc ? false : true;
    this.getQCResult(myqc);
  }
  getQCResult(myqc) {
    return new Promise(resolve => {
      this.api.get("table/qc_in_result", { params: { filter: 'qc_no=' + "'" + myqc.qc_no + "'" } }).subscribe(val => {
        this.qcresult = val['data'];
        this.totaldataqcresult = val['count'];
        resolve();
      })
    });
  }
  doChecked() {
    let alert = this.alertCtrl.create({
      title: 'Please Input Barcode Number',
      inputs: [
        {
          name: 'item',
          placeholder: 'Barcode',
          value: ''
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

          }
        }
      ]
    });
    alert.present();
  }
}