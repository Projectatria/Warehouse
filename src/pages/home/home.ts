import { Component } from '@angular/core';
import { MenuController, AlertController, Platform, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  atria: string = "warehouse";
  private token = '';
  private username = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public menu: MenuController,
    public platform: Platform,
    public alert: AlertController,
    private push: Push,
    public storage: Storage) {
    this.atria = "warehouse";
    this.storage.get('token').then((val) => {
      console.log(val);
      this.token = val;
    });
    this.storage.get('username').then((val) => {
      console.log(val);
      this.username = val;
    });
  }
  ionViewCanEnter() {
    this.storage.get('token').then((val) => {
      console.log(val);
      this.token = val;
      if (this.token != null) {
        return true;
      }
      else {
        return false;
      }
    });
  }
  doPreparationPO() {
    this.navCtrl.push('PurchasingorderPage');
  }
  doReceiving() {
    this.navCtrl.push('ReceivingPage');
  }
  doQcIn() {
    this.navCtrl.push('QcinPage');
  }
  doPutaway() {
    this.navCtrl.push('PutawayPage');
  }
  doMovement() {
    this.navCtrl.push('MovementPage');
  }
  doProfile() {
    this.navCtrl.push('UseraccountPage');
  } 
}
