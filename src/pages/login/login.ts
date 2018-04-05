import { Component } from '@angular/core';
import { AlertController, App, ViewController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { HomePage } from '../../pages/home/home';

@IonicPage()
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
  private token:any;

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
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
    this.login = "signin";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  doLogin() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.post("token",
      {
        "userid": this.myForm.value.username,
        "password": this.myForm.value.password
      },
      { headers })
      .subscribe((val) => {
        this.token = val['token'];
        console.log(this.token)
        this.storage.set('token', this.token);
        this.storage.set('username', this.myForm.value.username);
        this.navCtrl.setRoot(HomePage)
        this.myForm.reset();
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
