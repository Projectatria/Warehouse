import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-receiving',
  templateUrl: 'receiving.html',
})
export class ReceivingPage {
  private purchasing_order = [];
  searchpo: any;
  items = [];
  halaman = 0;
  halamanaction = 0;
  totaldata: any;
  totaldataitem: any;
  public toggled: boolean = false;
  orderno = '';
  rcv: string = "receiving";
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
    /* this.form = this.formBuilder.group({
       dccode: ['', Validators.compose([Validators.required])],
       docno: ['', Validators.compose([Validators.required])],
       orderno: ['', Validators.compose([Validators.required])],
       vendorno: ['', Validators.compose([Validators.required])],
       postingdate: ['', Validators.compose([Validators.required])] 
     });*/
    this.getPO();
    this.toggled = false;
    this.rcv = "receiving"
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
        this.api.get('table/purchasing_order', { params: { limit: 30, offset: offset, filter: 'status=3' } })
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

  doInfinite(infiniteScroll) {
    this.getPO().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }
 
  doRefresh(refresher) {
    this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=3' } }).subscribe(val => {
      this.purchasing_order = val['data'];
      this.totaldata = val['count'];
      this.searchpo = this.purchasing_order;
      refresher.complete();
    });
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
              this.api.patch("table/qc_in",
              {
                "order_no": po.order_no,
                "status": '1'
              },
              { headers })
              .subscribe();
            this.api.put("table/purchasing_order",
              {
                "po_id": po.po_id,
                "status": '4',
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
                  this.api.get("table/purchasing_order", { params: { limit: 30, filter: 'status=3' } }).subscribe(val => {
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
}