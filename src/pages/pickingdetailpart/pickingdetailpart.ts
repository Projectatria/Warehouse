import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-pickingdetailpart',
  templateUrl: 'pickingdetailpart.html',
})
export class PickingdetailpartPage {
  private picking_detail = [];
  searchpodetail: any;
  items = [];
  halaman = 0;
  totaldata: any;
  public toggled: boolean = false;
  receiptno = '';
  docno = ''
  batchno = '';
  locationcode = '';
  expectedreceiptdate = '';
  pickingdetail: string = "pickingdetailitem";
  private token: any;
  public detailpicking: any;
  public pickinglist: any;
  public pickingresult = [];

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {
    this.toggled = false;
    this.pickingdetail = "pickingdetailitem"
    this.receiptno = navParams.get('receiptno');
    this.batchno = navParams.get('batchno');
    this.locationcode = navParams.get('locationcode');
    this.expectedreceiptdate = navParams.get('expectedreceiptdate');
    this.getSOD();
  }
  ionViewCanEnter() {
    this.storage.get('token').then((val) => {
      this.token = val;
      if (this.token != null) {
        return true;
      }
      else {
        return false;
      }
    });
  }
  getSOD() {
    this.api.get("table/picking_list_detail", { params: { filter: "receipt_no=" + "'" + this.receiptno + "'" } })
      .subscribe(val => {
        this.picking_detail = val['data'];
        this.totaldata = val['count'];
      })
  }
  doRefresh(refresher) {
    this.api.get("table/picking_list_detail", { params: { filter: "receipt_no=" + "'" + this.receiptno + "'" } })
      .subscribe(val => {
        this.picking_detail = val['data'];
        this.totaldata = val['count'];
        this.searchpodetail = this.picking_detail;
        refresher.complete();
      });
  }
  dodetailpicking(picking) {
    this.pickinglist = picking.item_no;
    this.detailpicking = this.detailpicking ? false : true;
    this.getPickingResult(picking);
  }
  getPickingResult(picking) {
    this.api.get("tablenav", { params: { limit: 30, table: "CSB_LIVE$Item", filter: "[No_]=" + "'" + picking.item_no + "'" } }).subscribe(val => {
      let dataitem = val['data']
      this.api.get("tablenav", { params: { limit: 30, table: "CSB_LIVE$Production BOM Line", filter: "[Production BOM No_]=" + "'" + dataitem[0]["Production BOM No_"] + "'" } }).subscribe(val => {
        this.pickingresult = val['data']
      });
    })
  }
}