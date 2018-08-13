import { Component, trigger } from '@angular/core';
import { LoadingController, FabContainer, ActionSheetController, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import { Storage } from '@ionic/storage';

declare var window;
declare var cordova;
declare var Honeywell;

@IonicPage()
@Component({
  selector: 'page-movement',
  templateUrl: 'movement.html',
})
export class MovementPage {
  myForm: FormGroup;
  private receiving = [];
  private putawaylist = [];
  private location = [];
  private putaway = [];
  private movementtemp = [];
  private getmovementlist = [];
  public buttonText: string;
  public loading: boolean;
  public detailput: boolean = false;
  option: BarcodeScannerOptions;
  data = {};
  rackno = '';
  barcodeno = '';
  private nextno = '';
  public totalqty: any;
  receivingno = '';
  docno = '';
  orderno = '';
  batchno = '';
  itemno = '';
  locationcode = '';
  position = '';
  divisionno = '';
  qty = '';
  qtyprevious = '';
  putawayno = '';
  qtyreceiving = '';
  unit = '';
  rcvlist = '';
  totaldataputaway: any;
  private token: any;
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public loadingCtrl: LoadingController) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.myForm = formBuilder.group({
      rackno: ['', Validators.compose([Validators.required])],
      barcodeno: [''],
    })
    this.storage.get('token').then((val) => {
      this.token = val;
    });
  }
  ngAfterViewInit() {
    this.loader.dismiss();
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
    })

  }
  ionViewDidLoad() {
  }
  doOpenQty() {
    let barcodeno = this.myForm.value.barcodeno
    var batchno = barcodeno.substring(0, 6);
    var itemno = barcodeno.substring(6, 14);
    this.api.get('table/putaway', { params: { limit: 30, filter: "batch_no=" + "'" + batchno + "'" + ' AND ' + "item_no=" + "'" + itemno + "'" + ' AND ' + "status='OPEN'" } })
      .subscribe(val => {
        this.putawaylist = val['data'];
        if (this.putawaylist.length) {
          let alert = this.alertCtrl.create({
            title: 'Qty',
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

                }
              },
              {
                text: 'OK',
                handler: data => {
                  if (data.qty > this.putawaylist[0].qty) {
                    let alert = this.alertCtrl.create({
                      title: 'Error ',
                      subTitle: 'Qty Input Greater than Qty Stock',
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                  else {
                    this.api.get('table/movement_temp', { params: { limit: 30, filter: "batch_no=" + "'" + batchno + "'" + ' AND ' + "item_no=" + "'" + itemno + "'" } })
                      .subscribe(val => {
                        this.getmovementlist = val['data'];
                        if (this.getmovementlist.length) {
                          const headers = new HttpHeaders()
                            .set("Content-Type", "application/json");
                          let date = moment().format('YYYY-MM-DD');
                          this.api.put("table/movement_temp",
                            {
                              "movementtemp_no": this.getmovementlist[0].movementtemp_no,
                              "qty": parseInt(this.getmovementlist[0].qty) + parseInt(data.qty),
                              "date": date,
                              "pic": '12345'
                            },
                            { headers })
                            .subscribe(val => {
                              this.getMovementTemp();
                              this.myForm.get('barcodeno').setValue('');
                              let alert = this.alertCtrl.create({
                                title: 'Sukses ',
                                subTitle: 'Update Item Sukses',
                                buttons: ['OK']
                              });
                              alert.present();
                            })
                        }
                        else {
                          const headers = new HttpHeaders()
                            .set("Content-Type", "application/json");
                          this.getNextNoPUTemp().subscribe(val => {
                            this.nextno = val['nextno'];
                            let date = moment().format('YYYY-MM-DD');
                            this.api.post("table/movement_temp",
                              {
                                "movementtemp_no": this.nextno,
                                "putaway_no": this.putawaylist[0].putaway_no,
                                "receiving_no": this.putawaylist[0].receiving_no,
                                "doc_no": this.putawaylist[0].doc_no,
                                "order_no": this.putawaylist[0].order_no,
                                "batch_no": this.putawaylist[0].batch_no,
                                "item_no": this.putawaylist[0].item_no,
                                "date": date,
                                "location_code": this.putawaylist[0].location_code,
                                "location_previous_position": this.putawaylist[0].location_position,
                                "location_current_position": this.myForm.value.rackno,
                                "division": this.putawaylist[0].division,
                                "qty": data.qty,
                                "qty_putaway": this.putawaylist[0].qty,
                                "qty_receiving": this.putawaylist[0].qty_receiving,
                                "unit": this.putawaylist[0].unit,
                                "flag": '',
                                "pic": '12345',
                                "status": 'OPEN',
                                "chronology_no": '',
                                "uuid": UUID.UUID()
                              },
                              { headers })
                              .subscribe(val => {
                                this.getMovementTemp();
                                this.myForm.get('barcodeno').setValue('');
                                let alert = this.alertCtrl.create({
                                  title: 'Sukses ',
                                  subTitle: 'Add Item Sukses',
                                  buttons: ['OK']
                                });
                                alert.present();
                              })
                          });
                        }
                      });
                  }
                }
              }
            ]
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Error ',
            subTitle: 'Barcode Not Found',
            buttons: ['OK']
          });
          alert.present();
        }

      });
  }
  doSaveToMovement() {
    this.api.get('table/movement_temp', { params: { limit: 30, filter: "pic=" + '12345' } })
      .subscribe(val => {
        this.getmovementlist = val['data'];
        this.api.get('table/location_master', { params: { limit: 30, filter: "location_alocation=" + "'" + this.myForm.value.rackno + "'" } })
          .subscribe(val => {
            this.location = val['data'];
            if (this.getmovementlist.length == 0) {
              let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'List Putway Must Be Fill',
                buttons: ['OK']
              });
              alert.present();
            }
            else if (this.myForm.value.rackno == '') {
              let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Rack Number Must Be Fill',
                buttons: ['OK']
              });
              alert.present();
            }
            else if (this.location.length == 0) {
              let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Rack Number Not Found',
                buttons: ['OK']
              });
              alert.present();
            }
            else {
              let alert = this.alertCtrl.create({
                title: 'Confirm Save',
                message: 'Do you want to Save this list?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                  },
                  {
                    text: 'Save',
                    handler: () => {
                      this.api.get('table/movement_temp', { params: { limit: 30, filter: "pic=" + '12345' } })
                        .subscribe(val => {
                          this.getmovementlist = val['data'];
                          for (let i = 0; i < this.getmovementlist.length; i++) {
                            const headers = new HttpHeaders()
                              .set("Content-Type", "application/json");
                            this.getNextNo().subscribe(val => {
                              this.nextno = val['nextno'];
                              let date = moment().format('YYYY-MM-DD');
                              this.api.post("table/putaway",
                                {
                                  "putaway_no": this.nextno,
                                  "receiving_no": this.getmovementlist[0].receiving_no,
                                  "doc_no": this.getmovementlist[0].doc_no,
                                  "order_no": this.getmovementlist[0].order_no,
                                  "batch_no": this.getmovementlist[0].batch_no,
                                  "item_no": this.getmovementlist[0].item_no,
                                  "posting_date": date,
                                  "location_code": this.getmovementlist[0].location_code,
                                  "location_position": this.myForm.value.rackno,
                                  "division": this.getmovementlist[0].division,
                                  "qty": this.getmovementlist[0].qty,
                                  "qty_receiving": this.getmovementlist[0].qty_receiving,
                                  "unit": this.getmovementlist[0].unit,
                                  "flag": '',
                                  "pic": '',
                                  "status": 'OPEN',
                                  "chronology_no": '',
                                  "uuid": UUID.UUID()
                                },
                                { headers })
                                .subscribe(val => {
                                  const headers = new HttpHeaders()
                                    .set("Content-Type", "application/json");
                                  this.getNextNoPU().subscribe(val => {
                                    this.nextno = val['nextno'];
                                    let date = moment().format('YYYY-MM-DD');
                                    this.api.post("table/movement",
                                      {
                                        "movement_no": this.nextno,
                                        "putaway_no": this.getmovementlist[0].putaway_no,
                                        "receiving_no": this.getmovementlist[0].receiving_no,
                                        "doc_no": this.getmovementlist[0].doc_no,
                                        "order_no": this.getmovementlist[0].order_no,
                                        "batch_no": this.getmovementlist[0].batch_no,
                                        "item_no": this.getmovementlist[0].item_no,
                                        "date": date,
                                        "location_code": this.getmovementlist[0].location_code,
                                        "location_previous_position": this.getmovementlist[0].location_previous_position,
                                        "location_current_position": this.myForm.value.rackno,
                                        "division": this.getmovementlist[0].division,
                                        "qty": this.getmovementlist[0].qty,
                                        "qty_putaway": this.putawaylist[0].qty_putaway,
                                        "qty_receiving": this.putawaylist[0].qty_receiving,
                                        "unit": this.putawaylist[0].unit,
                                        "flag": '',
                                        "pic": '12345',
                                        "status": 'OPEN',
                                        "chronology_no": '',
                                        "uuid": UUID.UUID()
                                      },
                                      { headers })
                                      .subscribe(val => {
                                        const headers = new HttpHeaders()
                                          .set("Content-Type", "application/json");
                                        let date = moment().format('YYYY-MM-DD');
                                        this.api.put("table/putaway",
                                          {
                                            "putaway_no": this.getmovementlist[0].putaway_no,
                                            "qty": this.getmovementlist[0].qty_putaway - this.getmovementlist[0].qty,
                                            "pic": '12345',
                                          },
                                          { headers })
                                          .subscribe(val => {
                                            const headers = new HttpHeaders()
                                              .set("Content-Type", "application/json");
                                            this.api.delete("table/movement_temp", { params: { filter: "movementtemp_no=" + "'" + this.getmovementlist[0].movementtemp_no + "'" }, headers })
                                              .subscribe(val => {
                                                this.api.get('table/movement_temp', { params: { limit: 30, filter: "pic=" + '12345' } })
                                                  .subscribe(val => {
                                                    this.getmovementlist = val['data'];
                                                    let alert = this.alertCtrl.create({
                                                      title: 'Sukses ',
                                                      subTitle: 'Save Item To Rack Sukses',
                                                      buttons: ['OK']
                                                    });
                                                    this.myForm.reset()
                                                    this.getMovementTemp();
                                                    alert.present();
                                                  });
                                              })
                                          });

                                      })
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
          });

      });
  }
  doDeletePutawayList(putemp) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete  ' + putemp.item_no + ' ?',
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

            this.api.delete("table/movement_temp", { params: { filter: 'movementtemp_no=' + "'" + putemp.movementtemp_no + "'" }, headers })
              .subscribe(
                (val) => {
                  this.getMovementTemp();
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
  doScanBarcodeItem() {
    var self = this
    Honeywell.barcodeReaderPressSoftwareTrigger(function () {
      Honeywell.onBarcodeEvent(function (data) {
        var barcodeno = data.barcodeData;
        var batchno = barcodeno.substring(0, 6);
        var itemno = barcodeno.substring(6, 14);
        self.api.get('table/putaway', { params: { limit: 30, filter: "batch_no=" + "'" + batchno + "'" + ' AND ' + "item_no=" + "'" + itemno + "'" + ' AND ' + "status='OPEN'" } })
          .subscribe(val => {
            self.putawaylist = val['data'];
            if (self.putawaylist.length) {
              let alert = self.alertCtrl.create({
                title: 'Qty',
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
                    }
                  },
                  {
                    text: 'OK',
                    handler: data => {
                      var batchno = barcodeno.substring(0, 6);
                      var itemno = barcodeno.substring(6, 14);
                      self.api.get('table/movement_temp', { params: { limit: 30, filter: "batch_no=" + "'" + batchno + "'" + " AND " + "item_no=" + "'" + itemno + "'" } })
                        .subscribe(val => {
                          self.getmovementlist = val['data'];
                          if (self.getmovementlist.length) {
                            const headers = new HttpHeaders()
                              .set("Content-Type", "application/json");
                            let date = moment().format('YYYY-MM-DD');
                            self.api.put("table/movement_temp",
                              {
                                "movementtemp_no": self.getmovementlist[0].movementtemp_no,
                                "qty": parseInt(self.getmovementlist[0].qty) + parseInt(data.qty),
                                "date": date,
                                "pic": '12345'
                              },
                              { headers })
                              .subscribe(val => {
                                self.getMovementTemp();
                                self.myForm.get('barcodeno').setValue('');
                                let alert = self.alertCtrl.create({
                                  title: 'Sukses ',
                                  subTitle: 'Update Item Sukses',
                                  buttons: ['OK']
                                });
                                alert.present();
                              })
                          }
                          else {
                            const headers = new HttpHeaders()
                              .set("Content-Type", "application/json");
                            self.getNextNoPUTemp().subscribe(val => {
                              self.nextno = val['nextno'];
                              let date = moment().format('YYYY-MM-DD');
                              self.api.post("table/movement_temp",
                                {
                                  "movementtemp_no": self.nextno,
                                  "putaway_no": self.putawaylist[0].putaway_no,
                                  "receiving_no": self.putawaylist[0].receiving_no,
                                  "doc_no": self.putawaylist[0].doc_no,
                                  "order_no": self.putawaylist[0].order_no,
                                  "batch_no": self.putawaylist[0].batch_no,
                                  "item_no": self.putawaylist[0].item_no,
                                  "date": date,
                                  "location_code": self.putawaylist[0].location_code,
                                  "location_previous_position": self.putawaylist[0].location_position,
                                  "location_current_position": self.myForm.value.rackno,
                                  "division": self.putawaylist[0].division,
                                  "qty": data.qty,
                                  "qty_putaway": self.putawaylist[0].qty,
                                  "qty_receiving": self.putawaylist[0].qty_receiving,
                                  "unit": self.putawaylist[0].unit,
                                  "flag": '',
                                  "pic": '12345',
                                  "status": 'OPEN',
                                  "chronology_no": '',
                                  "uuid": UUID.UUID()
                                },
                                { headers })
                                .subscribe(val => {
                                  self.getMovementTemp();
                                  self.myForm.get('barcodeno').setValue('');
                                  let alert = self.alertCtrl.create({
                                    title: 'Sukses ',
                                    subTitle: 'Add Item Sukses',
                                    buttons: ['OK']
                                  });
                                  alert.present();
                                })
                            });
                          }
                        });
                    }
                  }
                ]
              });
              alert.present();
            }
            else {
              let alert = self.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Barcode Not Found',
                buttons: ['OK']
              });
              alert.present();
            }

          });
      }, function (reason) {
        console.error(reason);
      });
    }, function (reason) {
      console.error(reason);
    }, {
        press: true
      });
  }
  doScanBarcodeRack() {
    var self = this
    Honeywell.barcodeReaderPressSoftwareTrigger(function () {
      Honeywell.onBarcodeEvent(function (data) {
        var barcodeno = data.barcodeData.substring(0, 12);
        self.myForm.get('rackno').setValue(barcodeno)
      }, function (reason) {
        console.error(reason);
      });
    }, function (reason) {
      console.error(reason);
    }, {
        press: true
      });
  }
  getMovementTemp() {
    this.api.get('table/movement_temp', { params: { limit: 30, filter: "pic='12345'" } })
      .subscribe(val => {
        this.movementtemp = val['data'];
      });
  }
  getNextNo() {
    return this.api.get('nextno/putaway/putaway_no')
  }
  getNextNoPUTemp() {
    return this.api.get('nextno/movement_temp/movementtemp_no')
  }
  getNextNoPU() {
    return this.api.get('nextno/movement/movement_no')
  }

}
