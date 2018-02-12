import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-putaway',
  templateUrl: 'putaway.html',
})
export class PutawayPage {
  private location = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  
    this.getLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PutawayPage');
  }

  getLocation() {
    this.api.get('table/location',{params:{limit:100}}).subscribe(val => {
      this.location = val['data'];
    });
  }
  doLocation(location_name) { 
    console.log(location_name);
    this.navCtrl.push('LocationPage');
  }

}
