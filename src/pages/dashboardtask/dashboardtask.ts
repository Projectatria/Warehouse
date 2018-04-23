import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-dashboardtask',
  templateUrl: 'dashboardtask.html',
})
export class DashboardtaskPage {
  public POALL = [];
  public TOTALPOALL: any;
  public POMONTH = [];
  public TOTALPOMONTH: any;
  public PODAY = [];
  public TOTALPODAY: any;
  public POFINISH = [];
  public TOTALPOFINISH: any;
  public POPREPARATION = [];
  public TOTALPOPREPARATION: any;
  public PORECEIVING = [];
  public TOTALPORECEIVING: any;
  public RECALL = [];
  public TOTALRECALL: any;
  public RECMONTH = [];
  public TOTALRECMONTH: any;
  public RECDAY = [];
  public TOTALRECDAY: any;
  public RECFINISH = [];
  public TOTALRECFINISH: any;
  public RECPREPARATION = [];
  public TOTALRECPREPARATION: any;
  public RECEIVING = [];
  public TOTALRECEIVING: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetPO();
    this.doGetPOMonth();
    this.doGetPODay();
    this.doGetPOFinish();
    this.doGetPOPreparation();
    this.doGetPOReceiving();

    this.doGetREC();
    this.doGetRECMonth();
    this.doGetRECDay();
    this.doGetRECFinish();
    this.doGetRECPreparation();
    this.doGetReceiving();
  }

  ionViewDidLoad() {
  }
  /************************************************PO***********************************************************/
  doGetPO() {
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD'" } })
      .subscribe(val => {
        this.POALL = val['data'];
        this.TOTALPOALL = val['count']
      });
  }
  doGetPOPreparation() {
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status='INP2'" } })
      .subscribe(val => {
        this.POPREPARATION = val['data'];
        this.TOTALPOPREPARATION = val['count']
      });
  }
  doGetPOReceiving() {
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status='INPG'" } })
      .subscribe(val => {
        this.PORECEIVING = val['data'];
        this.TOTALPORECEIVING = val['count']
      });
  }
  doGetPOMonth() {
    let month = moment().format('MM');
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD' AND month(transfer_date)=" + month } })
      .subscribe(val => {
        this.POMONTH = val['data'];
        this.TOTALPOMONTH = val['count']
      });
  }
  doGetPODay() {
    let day = moment().format('YYYY-MM-DD');
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD' AND transfer_date=" + "'" + day + "'" } })
      .subscribe(val => {
        this.PODAY = val['data'];
        this.TOTALPODAY = val['count']
      });
  }
  doGetPOFinish() {
    this.api.get('table/purchasing_order', { params: { limit: 30, filter: "status='CLSD'" } })
      .subscribe(val => {
        this.POFINISH = val['data'];
        this.TOTALPOFINISH = val['count']
      });
  }

  /*************************************************************************************************************/

  /**********************************************RECEIVING******************************************************/

  doGetREC() {
    this.api.get('table/receiving', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD'" } })
      .subscribe(val => {
        this.RECALL = val['data'];
        this.TOTALRECALL = val['count']
      });
  }
  doGetRECPreparation() {
    this.api.get('table/receiving', { params: { limit: 30, filter: "status='INPG' OR status='CHECKED'" } })
      .subscribe(val => {
        this.RECPREPARATION = val['data'];
        this.TOTALRECPREPARATION = val['count']
      });
  }
  doGetReceiving() {
    this.api.get('table/receiving', { params: { limit: 30, filter: "status='CLSD'" } })
      .subscribe(val => {
        this.RECEIVING = val['data'];
        this.TOTALRECEIVING = val['count']
      });
  }
  doGetRECMonth() {
    let month = moment().format('MM');
    this.api.get('table/receiving', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD' AND month(transfer_date)=" + month } })
      .subscribe(val => {
        this.RECMONTH = val['data'];
        this.TOTALRECMONTH = val['count']
      });
  }
  doGetRECDay() {
    let day = moment().format('YYYY-MM-DD');
    this.api.get('table/receiving', { params: { limit: 30, filter: "status!='OPEN' AND status!='CLSD' AND transfer_date=" + "'" + day + "'" } })
      .subscribe(val => {
        this.RECDAY = val['data'];
        this.TOTALRECDAY = val['count']
      });
  }
  doGetRECFinish() {
    this.api.get('table/receiving', { params: { limit: 30, filter: "status='CLSD'" } })
      .subscribe(val => {
        this.RECFINISH = val['data'];
        this.TOTALRECFINISH = val['count']
      });
  }

  /*************************************************************************************************************/
  doRefresh() {
    this.doGetPO();
    this.doGetPOMonth();
    this.doGetPODay();
    this.doGetPOFinish();
    this.doGetPOPreparation();
    this.doGetPOReceiving();
    this.doGetREC();
    this.doGetRECMonth();
    this.doGetRECDay();
    this.doGetRECFinish();
    this.doGetRECPreparation();
    this.doGetReceiving();
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
