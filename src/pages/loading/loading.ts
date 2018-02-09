import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  private items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, private modal: ModalController) {
    this.api.get('table/loading').subscribe(val => {
      this.items = val['data'];
    })

  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadingPage');
  }
  addLoading(){
    let addLoading = this.modal.create('Loadingaddpage', this.modal, {cssClass: "modal-fullscreen"});
    addLoading.present();
  }

}
