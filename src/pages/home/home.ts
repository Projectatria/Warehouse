import { Component } from '@angular/core';
import { MenuController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';


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
  collection=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, 
              public menu: MenuController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
