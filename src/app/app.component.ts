import { Component } from '@angular/core';
import { MenuController, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public menu: MenuController, public alertCtrl: AlertController, public push: Push) {
    platform.ready().then(() => {

    });

  }
  open(pageName) {
    this.rootPage = pageName;
  };
  doHome() {
    this.rootPage = HomePage;
  }
}

