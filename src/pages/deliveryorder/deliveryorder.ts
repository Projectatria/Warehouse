import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-deliveryorder',
  templateUrl: 'deliveryorder.html',
})
export class DeliveryorderPage {

  // myDate: string=new Date().toISOString();
  myDate= moment().format();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryorderPage');
  }

}
