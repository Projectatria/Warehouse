import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-deliveryorder',
  templateUrl: 'deliveryorder.html',
})
export class DeliveryorderPage {
  private provinsi = [];
  private kabupaten = [];
  private kecamatan = [];
  // myDate: string=new Date().toISOString();
  myDate= moment().format();

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  this.getProvinsi();
  /*this.getKabupaten();
  this.getKecamatan();*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryorderPage');
  }
  getProvinsi() {
    this.api.get('table/wilayah_provinsi',{params:{limit:100}}).subscribe(val => {
      this.provinsi = val['data'];
    });
  }
  getKabupaten() {
    this.api.get('table/wilayah_kabupaten',{params:{filter:'provinsi_id='+ "'" + this.provinsi + "'"}}).subscribe(val => {
      this.kabupaten = val['data'];
    });
  }
  getKecamatan() {
    this.api.get('table/wilayah_kecamatan',{params:{filter:'kabupaten_id='+ "'" + this.kabupaten + "'"}}).subscribe(val => {
      this.kecamatan = val['data'];
    });
  }
}
