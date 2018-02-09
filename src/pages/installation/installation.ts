import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-installation',
  templateUrl: 'installation.html',
})
export class InstallationPage {

  private items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, private modal: ModalController) {
    this.api.get('table/installation').subscribe(val => {
      this.items = val['data'];
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallationPage');
  }
  addInstallation(){
    let addInstallation = this.modal.create('InstallationaddPage', this.modal, { cssClass: "modal-fullscreen"});
    addInstallation.present();
  }

}
