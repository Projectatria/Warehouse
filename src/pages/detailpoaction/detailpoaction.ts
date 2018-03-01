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
  searchpodetail: any;
  items = [];
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
  docno = '';
  orderno = '';
  batchno = '';
  locationcode = '';
  transferdate = '';
  receivingno = '';
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
    })
    this.getPOD();
    this.toggled = false;
    this.detailpo = "detailpoitem";
    this.docno = navParams.get('docno');
    this.orderno = navParams.get('orderno');
    this.batchno = navParams.get('batchno');
    this.locationcode = navParams.get('locationcode');
    this.transferdate = navParams.get('transferdate');
  }
  getPOD() {
    this.api.get("table/receiving", { params: { filter: 'order_no=' + "'" + this.orderno + "'" } }).subscribe(val => {
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
        this.api.get('table/receiving', { params: { limit: 30, offset: offset, filter: 'order_no=' + "'" + this.orderno + "'" } })
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
    this.api.get("table/receiving", { params: { limit: 30, filter: 'order_no=' + "'" + this.orderno + "'" } }).subscribe(val => {
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
        locationplan: detailpo.position
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
    let locationModal = this.modalCtrl.create('BarcodePage', {
      barcode: detailpo.item_no
    },
      { cssClass: "modal-fullscreen" });
    locationModal.present();
  }
  doOpenToTL(detailpo) {
    this.getUsers();
    document.getElementById("myModal").style.display = "block";
    this.receivingno = detailpo.receiving_no;
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
        "receiving_pic": this.myFormModal.value.pic
      },
      { headers })
      .subscribe(
        (val) => {
          console.log("Update call successful value returned in body",
            val);
          document.getElementById("myModal").style.display = "none";
          this.myFormModal.reset()
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
}