import { Component } from '@angular/core';
import { MenuController, AlertController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  atria: string = "warehouse";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public menu: MenuController,
    public platform: Platform,
    public alert: AlertController,
    private push: Push) {
    this.atria = "warehouse";
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
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
}
