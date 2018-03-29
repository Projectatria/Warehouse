import { Component } from '@angular/core';
import { FabContainer, ActionSheetController, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-movement',
  templateUrl: 'movement.html',
})
export class MovementPage {
  myFormModal: FormGroup;
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
    public actionSheetCtrl: ActionSheetController
  ) {

  }

  ionViewDidLoad() {
  }
  doOpenQty(barcodeno) {
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
                  console.log('Cancel clicked');
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
                              this.barcodeno = '';
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
                                "location_current_position": this.rackno,
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
                                this.barcodeno = '';
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
        this.api.get('table/location_master', { params: { limit: 30, filter: "location_alocation=" + "'" + this.rackno + "'" } })
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
            else if (this.rackno == '') {
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
                      console.log('Cancel clicked');
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
                                  "location_position": this.rackno,
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
                                        "location_current_position": this.rackno,
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
                                            console.log(this.getmovementlist[0].movementtemp_no)
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
                                                    this.rackno = '';
                                                    this.barcodeno = '';
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
            console.log('Cancel clicked');
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
                  console.log("DELETE call successful value returned in body",
                    val);
                  this.getMovementTemp();
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
  doScanBarcodeItem() {
    this.buttonText = "Loading..";
    this.loading = true;
    this.option = {
      prompt: "Please scan your code"
    }
    this.barcodeScanner.scan({ "orientation": 'landscape' }).then((barcodeData) => {
      if (barcodeData.cancelled) {
        console.log("User cancelled the action!");
        this.loading = false;
        return false;
      }
      var barcodeno = barcodeData.text;
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
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'OK',
                  handler: data => {
                    var batchno = barcodeno.substring(0, 6);
                    var itemno = barcodeno.substring(6, 14);
                    this.api.get('table/movement_temp', { params: { limit: 30, filter: "batch_no=" + "'" + batchno + "'" + " AND " + "item_no=" + "'" + itemno + "'" } })
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
                              this.barcodeno = '';
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
                                "location_current_position": this.rackno,
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
                                this.barcodeno = '';
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
    });
  }
  doScanBarcodeRack() {
    this.buttonText = "Loading..";
    this.loading = true;
    this.option = {
      prompt: "Please scan your code"
    }
    this.barcodeScanner.scan({ "orientation": 'landscape' }).then((barcodeData) => {
      if (barcodeData.cancelled) {
        console.log("User cancelled the action!");
        this.loading = false;
        return false;
      }
      this.rackno = barcodeData.text;
    });
  }
  getMovementTemp() {
    this.api.get('table/movement_temp', { params: { limit: 30, filter: "pic='12345'" } })
      .subscribe(val => {
        console.log('get movementtemp')
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
