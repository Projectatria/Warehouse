import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DashboardtaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboardtask',
  templateUrl: 'dashboardtask.html',
})
export class DashboardtaskPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }
  doPO() {
    document.getElementById('po').style.display = 'block';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doReceiving() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'block';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doStagingin() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'block';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doQcin() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'block';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doPutaway() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'block';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doPicking() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'block';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doQcout() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'block';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
  doStagingout() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }
  doLoading() {
    document.getElementById('po').style.display = 'none';
    document.getElementById('receiving').style.display = 'none';
    document.getElementById('stagingin').style.display = 'none';
    document.getElementById('qcin').style.display = 'none';
    document.getElementById('putaway').style.display = 'none';
    document.getElementById('picking').style.display = 'none';
    document.getElementById('qcout').style.display = 'none';
    document.getElementById('stagingout').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
  }

}
