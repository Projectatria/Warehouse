import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-receivingcust',
  templateUrl: 'receivingcust.html',
})
export class ReceivingcustPage {

  private items=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
    this.api.get('table/receivingcust').subscribe(val => {
      this.items = val['data'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivingPage');
  }

  addReceiving(){
    this.navCtrl.push('ReceivingaddPage');
  }

}
