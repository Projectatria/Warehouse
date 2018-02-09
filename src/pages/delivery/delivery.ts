import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from "../../providers/api/api";
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-delivery',
  templateUrl: 'delivery.html',
})
export class DeliveryPage {

  private items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, private modal: ModalController) {
    this.api.get('table/delivery').subscribe(val => {
      this.items = val['data'];
    })

  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryPage');
  }

  addDelivery() {
    let addDelivery = this.modal.create('DeliveryaddPage', this.modal, { cssClass: "modal-fullscreen" });
    addDelivery.present();
  }
}
