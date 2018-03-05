import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-detailpoaction',
  templateUrl: 'detailpoaction.html',
})
export class DetailpoactionPage {
  myFormModal: FormGroup;
  private purchasing_order_detail = [];
  private users = [];
  private locations = [];
  searchpodetail: any;
  poid = '';
  items = [];
  halaman = 0;
  totaldata: any;
  totaldatalocation: any;
  public toggled: boolean = false;
  docno = '';
  orderno = '';
  batchno = '';
  locationcode = '';
  transferdate = '';
  receivingno = '';
  status = '';
  batch = '';
  item = '';
  position = '';
  qty = '';
  detailpo: string = "detailpoitem";
  barcode: {};
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
      pic: [''],
      location: [''],
    })
    this.getPOD();
    this.toggled = false;
    this.detailpo = "detailpoitem";
    this.poid = navParams.get('poid');
    this.docno = navParams.get('docno');
    this.orderno = navParams.get('orderno');
    this.batchno = navParams.get('batchno');
    this.status = navParams.get('status');
    this.locationcode = navParams.get('locationcode');
    this.transferdate = navParams.get('transferdate');
  }
  getPOD() {
    this.api.get("table/receiving", { params: { filter: 'order_no=' + "'" + this.orderno + "'" + " AND status='OPEN'" } }).subscribe(val => {
      this.purchasing_order_detail = val['data'];
      this.totaldata = val['count'];
    })
  }
  getPODetail() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/receiving', { params: { limit: 30, offset: offset, filter: 'order_no=' + "'" + this.orderno + "'" + " AND status='OPEN'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.purchasing_order_detail.push(data[i]);
              this.totaldata = val['count'];
              this.searchpodetail = this.purchasing_order_detail;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchPODetail(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.purchasing_order_detail = this.searchpodetail.filter(detailpo => {
        return detailpo.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.purchasing_order_detail = this.searchpodetail;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getPODetail().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefresh(refresher) {
    this.api.get("table/receiving", { params: { limit: 30, filter: 'order_no=' + "'" + this.orderno + "'" + " AND status='OPEN'" } }).subscribe(val => {
      this.purchasing_order_detail = val['data'];
      this.totaldata = val['count'];
      this.searchpodetail = this.purchasing_order_detail;
      refresher.complete();
    });
  }
  doActionPO(detailpo) {
    let locationModal = this.modalCtrl.create('DetailpoactionupdatePage',
      {
        detailno: detailpo.receiving_no,
        docno: detailpo.doc_no,
        orderno: detailpo.order_no,
        itemno: detailpo.item_no,
        qty: detailpo.qty,
        receivingpic: detailpo.receiving_pic,
        locationplan: detailpo.position,
        status: detailpo.status
      },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  ionViewDidLoad() {
    this.getPODetail();
  }
  /*doBarcode(detailpo) {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,
      detailpo.item_no).then((res) => {
        console.log(res)
        this.barcode = res;
      }, (err) => {
        console.log(err);
      })
  }*/
  doListBarcode(detailpo) {
    let locationModal = this.modalCtrl.create('BarcodelistPage', {
      batchno: detailpo.batch_no,
      orderno: detailpo.order_no,
      itemno: detailpo.item_no,
      qty: detailpo.qty
    },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  doOpenToTL(detailpo) {
    this.batch = detailpo.batch_no;
    this.item = detailpo.item_no;
    this.position = detailpo.position;
    this.qty = detailpo.qty;
    return new Promise(resolve => {
      this.getLocations(detailpo).subscribe(val => {
        let data = val['data'];
        for (let i = 0; i < data.length; i++) {
          this.locations.push(data[i]);
          this.totaldatalocation = val['count'];
        }
        if (detailpo.position == '' && this.status == 'INP2') {
          this.myFormModal.get('pic').setValue(detailpo.receiving_pic);
          this.myFormModal.get('location').setValue((this.locations[0]).location_alocation);
          document.getElementById("myModal").style.display = "block";
          this.receivingno = detailpo.receiving_no;
        }
        else {
          this.getUsers();
          this.myFormModal.get('pic').setValue(detailpo.receiving_pic);
          this.myFormModal.get('location').setValue(detailpo.position);
          document.getElementById("myModal").style.display = "block";
          this.receivingno = detailpo.receiving_no;
        }
        resolve();
      });
    });
  }
  getLocations(detailpo) {
    return this.api.get('table/location_master', {
      params: {
        filter:
          'location_code=' + "'" + detailpo.location_code + "'" +
          ' ' + 'AND' + ' ' +
          'division=' + "'" + detailpo.division + "'" +
          ' ' + 'AND' + ' ' +
          "status='true'"
      }
    })
  }
  doOffToTL() {
    document.getElementById("myModal").style.display = "none";
    this.myFormModal.reset()
  }
  getUsers() {
    this.api.get('table/user_role', { params: { limit: 100 } }).subscribe(val => {
      this.users = val['data'];
    });
  }
  doSendToTL() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/receiving",
      {
        "receiving_no": this.receivingno,
        "receiving_pic": this.myFormModal.value.pic,
        "position": this.myFormModal.value.location
      },
      { headers })
      .subscribe(
        (val) => {
          console.log("Update call successful value returned in body",
            val);
          document.getElementById("myModal").style.display = "none";
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          if (this.myFormModal.value.location != '') {
            this.api.put("table/location_master",
              {
                "location_alocation": this.myFormModal.value.location,
                "batch_no": this.batch,
                "item_no": this.item,
                "qty": this.qty,
                "status": 'BOOKING'
              },
              { headers })
              .subscribe();
          }
          if (this.position != '') {
            this.api.put("table/location_master",
              {
                "location_alocation": this.position,
                "batch_no": '',
                "item_no": '',
                "qty": 0,
                "status": 'TRUE'
              },
              { headers })
              .subscribe();
          }
          this.myFormModal.reset()
          this.locations = [];
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.getPOD();
        },
        response => {
          console.log("Update call in error", response);
        },
        () => {
          console.log("The Update observable is now completed.");
        });
  }
  doOpenLocation() {

  }
  doPostingRCV(detailpo) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Posting',
      message: 'Do you want to posting Item No ' + detailpo.item_no + ' ?',
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
            this.api.put("table/purchasing_order_detail",
              {
                "po_detail_no": detailpo.receiving_no,
                "status": 'CLSD'
              },
              { headers })
              .subscribe();
            this.api.put("table/receiving",
              {
                "receiving_no": detailpo.receiving_no,
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
                  this.api.get("table/receiving", { params: { limit: 30, filter: 'order_no=' + "'" + this.orderno + "'" + " AND status='OPEN'" } }).subscribe(val => {
                    this.purchasing_order_detail = val['data'];
                    this.totaldata = val['count'];
                    this.searchpodetail = this.purchasing_order_detail;
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

}