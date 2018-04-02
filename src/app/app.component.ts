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
      // statusBar.styleDefault();
      // splashScreen.hide();
      this.pushsetup();
    });
  }
  pushsetup() {
    const options: PushOptions = {
      android: {
        senderID: '985026959746'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'Notification',
          message: notification.message
        })
        youralert.present();
      }
    });
    pushObject.on('registration').subscribe((registration: any) => alert('Deviced registered' + registration));
    pushObject.on('error').subscribe((error: any) => alert('Error with Push Plugin' + error));
  }
  open(pageName) {
    this.rootPage = pageName;
  };
  doHome() {
    this.rootPage = HomePage;
  }
}

