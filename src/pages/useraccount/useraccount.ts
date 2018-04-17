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
  private userid = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public menu: MenuController,
    public platform: Platform,
    public alert: AlertController,
    public storage: Storage) {
    this.storage.get('userid').then((val) => {
      this.userid = val;
    });
  }
  ionViewCanEnter() {
    this.storage.get('token').then((val) => {
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

  }
  doLogout() {
    this.api.get('table/user', { params: { filter: "id_user=" + "'" + this.userid + "'" } })
      .subscribe(val => {
        this.users = val['data'];
        const headers = new HttpHeaders()
          .set("Content-Type", "application/json");
        this.api.put("table/user",
          {
            "id_user": this.userid,
            "token": ''
          },
          { headers })
          .subscribe(val => {
            this.storage.remove('token');
            this.storage.remove('userid');
            this.storage.remove('name')
            this.navCtrl.setRoot(LoginPage)
          })
      });
  }
  doDashboard() {
    this.navCtrl.push('DashboardtaskPage');
  }

}
