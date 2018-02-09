import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  private location_master = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }
 
  getLocationMaster() {
    this.api.get('table/location_master',{params:{limit:100}}).subscribe(val => {
      this.location_master = val['data'];
    });
  }
 
}
