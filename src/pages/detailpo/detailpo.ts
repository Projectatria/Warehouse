import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HomePage } from '../home/home';
/**
 * Generated class for the DetailpoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailpo',
  templateUrl: 'detailpo.html',
})
export class DetailpoPage {
  private po = '';
  private receiving = [];
  searchrcv: any;
  halaman = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {

    this.po = navParams.get('param');
    this.getReceiving();  
  }
  getReceiving() {

    return new Promise(resolve => {
      let offset = 30 * this.halaman
      console.log('offset', this.halaman);
      if (this.halaman == -1) {
        console.log('Data Tidak Ada')
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/receiving', { params: { limit: 30, offset: offset } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.receiving.push(data[i]);
              this.searchrcv = this.receiving;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchRCV(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.receiving = this.searchrcv.filter(rcv => {
        return rcv.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.receiving = this.searchrcv;
    }
  }
  viewItem(rcv) {
    this.navCtrl.push('ViewitemPage', {
      param: rcv.item_no
    });
  }
  putAway(rcv) {
    this.navCtrl.push('PutawayPage', {
      param: rcv.item_no
    });
  }
  ionViewDidLoad() {
    console.log(this.po);
    console.log(this.receiving);
  }
  doHome() {
    this.navCtrl.setRoot(HomePage);
  }
  doInfinite(infiniteScroll) {
    this.getReceiving().then(response => {
      infiniteScroll.complete();

    })
  }

}   
