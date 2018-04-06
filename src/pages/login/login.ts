import { Component } from '@angular/core';
import { AlertController, App, ViewController, Platform, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  myForm: FormGroup;
  private width: number;
  private height: number;
  login: string = "signin";
  rootPage: any;
  private token: any;
  private user = [];
  private tokennotification = '';

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public fb: FormBuilder,
    public api: ApiProvider,
    public viewCtrl: ViewController,
    public appCtrl: App,
    private alertCtrl: AlertController) {
    this.myForm = fb.group({
      userid: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
    this.login = "signin";
  }

  ionViewDidLoad() {
  }
  doLogin() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.post("token",
      {
        "userid": this.myForm.value.userid,
        "password": this.myForm.value.password
      },
      { headers })
      .subscribe((val) => {
        this.token = val['token'];
        this.api.get('table/user', { params: { filter: "id_user=" + "'" + this.myForm.value.userid + "'" } })
          .subscribe(val => {
            this.user = val['data'];
            this.storage.set('token', this.token);
            this.storage.set('userid', this.myForm.value.userid);
            this.storage.set('name', this.user[0].name);
            this.storage.get('tokennotification').then((val) => {
              this.tokennotification = val;
              const headers = new HttpHeaders()
                .set("Content-Type", "application/json");
              this.api.put("table/user",
                {
                  "id_user": this.user[0].id_user,
                  "token": this.tokennotification
                },
                { headers })
                .subscribe()
            });
            this.navCtrl.setRoot(HomePage)
            this.myForm.reset();
          });
      }, (e) => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Username or Password is Incorrect',
          buttons: ['OK']
        });
        alert.present();
      });
  }

}
