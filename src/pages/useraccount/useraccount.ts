import { Component } from '@angular/core';
import { MenuController, AlertController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoginPage } from '../../pages/login/login';
import { Storage } from '@ionic/storage';
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-useraccount',
  templateUrl: 'useraccount.html',
})
export class UseraccountPage {
  private token: any;
  private users = [];
  private user = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public menu: MenuController,
    public platform: Platform,
    public alert: AlertController,
    public storage: Storage) {
    this.storage.get('username').then((val) => {
      console.log(val);
      this.user = val;
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad UseraccountPage');
  }
  doLogout() {
    console.log(this.user)
    this.api.get('table/user_role', { params: { filter: "name=" + "'" + this.user + "'" } })
      .subscribe(val => {
        this.users = val['data'];
        const headers = new HttpHeaders()
          .set("Content-Type", "application/json");
        this.api.put("table/user_role",
          {
            "id_user": this.users[0].id_user,
            "token": ''
          },
          { headers })
          .subscribe(val => {
            this.storage.remove('token');
            this.storage.remove('username');
            this.navCtrl.setRoot(LoginPage)
          })
      });
  }

}
