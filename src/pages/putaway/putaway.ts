import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-putaway',
  templateUrl: 'putaway.html',
})
export class PutawayPage {
  myFormModal: FormGroup;
  private receiving = [];
  private location_master = [];
  private division = [];
  private putaway = [];
  searchrcv: any;
  searchloc: any;
  halaman = 0;
  totaldata: any;
  totaldataputaway: any;
  divisioncode = '';
  divdesc = '';
  setdiv = '';
  receivingno = '';
  docno = '';
  orderno = '';
  batchno = '';
  itemno = '';
  locationcode = '';
  divisionno = '';
  qty = '';
  unit = '';
  rcvlist = '';
  public totalqty: any;
  private nextno = '';
  public toggled: boolean = false;
  public detailput: boolean = false;
  put: string = "putaway";

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner
  ) {
    this.myFormModal = formBuilder.group({
      qty: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    })
    this.getrcv();
    this.toggled = false;
    this.put = "putaway"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PutawayPage');
  }
  getrcv() {
    return new Promise(resolve => {
      let offsetinforcv = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/receiving', { params: { limit: 30, offset: offsetinforcv, filter: "status='CLSD'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.receiving.push(data[i]);
              this.totaldata = val['count'];
              this.searchrcv = this.receiving;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getrcv().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
  viewDetail(rcv) {
    this.api.get('table/putaway', { params: { limit: 30, filter: "receiving_no=" + rcv.receiving_no } })
      .subscribe(val => {
        this.putaway = val['data'];
        this.rcvlist = rcv.receiving_no;
        this.totaldataputaway = val['count'];
        this.detailput = this.detailput ? false : true;
      });
  }

  doRefresh(refresher) {
    this.api.get('table/receiving', { params: { limit: 30, filter: "status='CLSD'" } })
      .subscribe(val => {
        this.receiving = val['data'];
        this.totaldata = val['count'];
        this.searchrcv = this.receiving;
        refresher.complete();
      });
  }
  doPutaway(rcv) {
    this.api.get('table/putaway', { params: { limit: 30, filter: "receiving_no=" + rcv.receiving_no } })
      .subscribe(val => {
        this.putaway = val['data'];
        this.totalqty = this.putaway.reduce(function (prev, cur) {
          return prev + cur.qty;
        }, 0);
        console.log('Total Qty:', this.totalqty);
        if (this.totalqty >= rcv.qty) {
          console.log('lewat')
          let alert = this.alertCtrl.create({
            title: 'Error ',
            subTitle: 'Qty does not exist',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.myFormModal.reset();
          document.getElementById("myModal").style.display = "block";
          this.myFormModal.get('location').setValue(rcv.position)
          this.myFormModal.get('qty').setValue(rcv.qty - this.totalqty)
          this.receivingno = rcv.receiving_no;
          this.docno = rcv.doc_no;
          this.orderno = rcv.order_no;
          this.batchno = rcv.batch_no;
          this.itemno = rcv.item_no;
          this.locationcode = rcv.location_code;
          this.divisionno = rcv.division;
          this.qty = rcv.qty;
          this.unit = rcv.unit;
        }
      });

  }
  doOffPutaway() {
    this.myFormModal.reset();
    document.getElementById("myModal").style.display = "none";
  }
  doOpenLocation() {
    this.location_master = [];
    return new Promise(resolve => {
      this.api.get('table/division', { params: { limit: 1000, sort: 'description ASC' } }).subscribe(val => {
        this.division = val['data'];
        this.divisioncode = this.division[14].description
        return new Promise(resolve => {
          this.api.get('table/location_master', { params: { limit: 1000, filter: 'division=' + "'" + this.division[14].code + "'" } }).subscribe(val => {
            this.location_master = val['data'];
            this.searchloc = this.location_master;
            document.getElementById("myLocations").style.display = "block";
            document.getElementById("myHeader").style.display = "none";
            resolve();
          })
        });
      });
    });
  }
  doOffLocations() {
    document.getElementById("myLocations").style.display = "none";
    document.getElementById("myHeader").style.display = "block";
    this.divdesc = '';
  }

  doSetLoc(div) {
    console.log('div', div.code)
    this.setdiv = div.code;
  }
  doLocation() {
    console.log(this.setdiv);
    this.api.get('table/location_master', { params: { limit: 1000, filter: 'division=' + "'" + this.setdiv + "'" } }).subscribe(val => {
      this.location_master = val['data'];
      this.searchloc = this.location_master;
    });
  }
  doSelectLoc(locmst) {
    this.myFormModal.get('location').setValue(locmst.location_alocation);
    this.doOffLocations();
  }
  doSavePutaway() {
    this.api.get('table/putaway', { params: { limit: 30, filter: "receiving_no=" + this.receivingno } })
      .subscribe(val => {
        this.putaway = val['data'];
        this.totalqty = this.putaway.reduce(function (prev, cur) {
          return prev + cur.qty;
        }, 0);
        console.log('Total Qty:', this.totalqty);
        if ((this.totalqty + this.myFormModal.value.qty) >= this.qty) {
          console.log('lewat')
          let alert = this.alertCtrl.create({
            title: 'Error ',
            subTitle: 'Qty does not exist',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.getNextNo().subscribe(val => {
            this.nextno = val['nextno'];
            let date = moment().format('YYYY-MM-DD');
            this.api.post("table/putaway",
              {
                "putaway_no": this.nextno,
                "receiving_no": this.receivingno,
                "doc_no": this.docno,
                "order_no": this.orderno,
                "batch_no": this.batchno,
                "item_no": this.itemno,
                "posting_date": date,
                "location_code": this.locationcode,
                "location_position": this.myFormModal.value.location,
                "division": this.divisionno,
                "qty": this.myFormModal.value.qty,
                "unit": this.unit,
                "flag": '',
                "pic": '',
                "status": 'OPEN',
                "chronology_no": '',
                "uuid": UUID.UUID()
              },
              { headers })
              .subscribe(val => {
                let alert = this.alertCtrl.create({
                  title: 'Sukses',
                  subTitle: 'Save Sukses',
                  buttons: ['OK']
                });
                alert.present();
                this.doOffPutaway();
              });
          });
        }
      });
  }

  getNextNo() {
    return this.api.get('nextno/putaway/putaway_no')
  }
}
