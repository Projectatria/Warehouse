import { Component } from '@angular/core';
import { MenuController, AlertController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoginPage } from '../../pages/login/login';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-useraccount',
  templateUrl: 'useraccount.html',
})
export class UseraccountPage {
  private token = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public menu: MenuController,
    public platform: Platform,
    public alert: AlertController,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UseraccountPage');
  }
  doLogout() {
    this.storage.remove('token');
    this.navCtrl.setRoot(LoginPage)
  }

}
