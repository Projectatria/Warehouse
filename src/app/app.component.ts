import { Component } from '@angular/core';
import { MenuController, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';
import { ApiProvider } from '../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  private token = '';
  public userid = [];
  public role = [];
  private rolearea = '';
  private rolegroup = '';
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public push: Push,
    private fcm: FCM,
    public api: ApiProvider,
    private storage: Storage) {
    platform.ready().then(() => {
      this.storage.get('token').then((val) => {
        this.token = val;
        if (this.token == null) {
          this.rootPage = LoginPage;
        }
        else {
          this.rootPage = HomePage;
        }
      });
      this.storage.get('userid').then((val) => {
        this.userid = val;
        this.api.get('table/user_role', { params: { filter: "id_user=" + "'" + this.userid + "'" } })
          .subscribe(val => {
            this.role = val['data']
            if (this.role.length != 0) {
              this.rolearea = this.role[0].id_area
              this.rolegroup = this.role[0].id_group
            }
          })
      });
      this.fcm.getToken().then(token => {
        this.storage.set('tokennotification', token);
        let date = moment().format('YYYY-MM-DD h:mm:ss');
        const headers = new HttpHeaders()
          .set("Content-Type", "application/json");
        this.api.post("table/token_notification",
          {
            "token": token,
            "date": date
          },
          { headers })
          .subscribe()
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            if (data.param == "PO") {
              this.rootPage = 'PurchasingorderPage'
            }
            else if (data.param == "PICKING") {
              this.rootPage = 'PickingPage'
            }
          } else {
            let alert = this.alertCtrl.create({
              subTitle: data.title,
              message: data.body,
              buttons: ['OK']
            });
            alert.present();
            if (data.param == "PO") {
              this.rootPage = 'PurchasingorderPage'
            }
            else if (data.param == "PICKING") {
              this.rootPage = 'PickingPage'
            }
          };
        });
      }, (e) => {
      });
    });
  }
  open(pageName) {
    this.rootPage = pageName;
  };
  doHome() {
    this.rootPage = HomePage;
  }
}

