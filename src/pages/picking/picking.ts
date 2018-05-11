import { Component } from '@angular/core';
import { LoadingController, FabContainer, ActionSheetController, ModalController, MenuController, IonicPage, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-picking',
  templateUrl: 'picking.html',
})
export class PickingPage {
  myFormModal: FormGroup;
  private receiving = [];
  private location_master = [];
  private division = [];
  private picking = [];
  private pickinglist = [];
  private putawaytemp = [];
  private receivingputawaylist = [];
  private getputawaylist = [];
  private location = [];
  private listpicking = [];
  private listpickingdetail = [];
  private putawayfound = [];
  private usertoken = [];
  private users = [];
  searchrcv: any;
  searchloc: any;
  searchpicking: any;
  halaman = 0;
  totaldata: any;
  totaldatapicking: any;
  totaldatapickingdetail: any;
  totaldatalistpicking: any;
  divisioncode = '';
  divdesc = '';
  setdiv = '';
  receivingno = '';
  docno = '';
  orderno = '';
  batchno = '';
  itemno = '';
  locationcode = '';
  position = '';
  divisionno = '';
  qty = '';
  qtyprevious = '';
  putawayno = '';
  qtyreceiving = '';
  unit = '';
  rcvlist = '';
  barcodeno = '';
  rackno = '';
  sortPICK = '';
  filter = '';
  public totalqty: any;
  private nextno = '';
  public toggled: boolean = false;
  public detailpick: boolean = false;
  public detailpicklist: boolean = false;
  pick: string = "picking";
  public buttonText: string;
  public loading: boolean;
  option: BarcodeScannerOptions;
  data = {};
  groupby = '';
  search = '';
  itemnolist = '';
  invoicelist = '';
  roomlist = '';
  private token: any;
  public userid = [];
  public role = [];
  public rolearea = '';
  public rolegroup = '';
  public roleid = '';
  public userpic = '';
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    private http: HttpClient,
    public loadingCtrl: LoadingController
  ) {    
    this.loader = this.loadingCtrl.create({
    // cssClass: 'transparent',
    content: 'Loading Content...'
  });
  this.loader.present();
    this.myFormModal = formBuilder.group({
      pic: ['', Validators.compose([Validators.required])],
    })
    this.storage.get('userid').then((val) => {
      this.userid = val;
      this.api.get('table/user_role', { params: { filter: "id_user=" + "'" + this.userid + "'" } })
        .subscribe(val => {
          this.role = val['data']
          if (this.role.length != 0) {
            this.rolearea = this.role[0].id_area
            this.rolegroup = this.role[0].id_group
            this.roleid = this.role[0].id_role
            if (this.roleid == "STAFF") {
              this.pick = "picking"
            }
            else {
              this.pick = "listpicking"
            }
          }
        })
    });
    this.getpicking();
    this.toggled = false;
    this.groupby = ""
    this.search = 'invoice_no';
  }
  ngAfterViewInit() {
    this.loader.dismiss();
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
  getpicking() {
    return new Promise(resolve => {
      let offsetpicking = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/picking_list', { params: { limit: 30, offset: offsetpicking, filter: "status='OPEN'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.listpicking.push(data[i]);
              this.totaldatalistpicking = val['count'];
              this.searchpicking = this.listpicking;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  getSetGroupBy(groupby) {
    this.api.get('table/picking_list', { params: { limit: 30, filter: "status='OPEN'", group: groupby, groupSummary: "sum (qty) as qtysum" } })
      .subscribe(val => {
        this.listpicking = val['data'];
        this.totaldatalistpicking = val['count'];
        this.searchpicking = this.listpicking;
      });
  }
  getDetailGroupByInvoice(listpick) {
    this.listpickingdetail = [];
    this.detailpicklist = this.detailpicklist ? false : true
    this.invoicelist = listpick.invoice_no
    this.api.get('table/picking_list', { params: { limit: 30, filter: "status='OPEN'" + " AND " + "invoice_no=" + "'" + listpick.invoice_no + "'" } })
      .subscribe(val => {
        this.listpickingdetail = val['data'];
        this.totaldatapickingdetail = val['count'];
      });
  }
  getDetailGroupByItems(listpick) {
    this.listpickingdetail = [];
    this.detailpicklist = this.detailpicklist ? false : true
    this.itemnolist = listpick.item_no
    this.api.get('table/picking_list', { params: { limit: 30, filter: "status='OPEN'" + " AND " + "item_no=" + "'" + listpick.item_no + "'" } })
      .subscribe(val => {
        this.listpickingdetail = val['data'];
        this.totaldatapickingdetail = val['count'];
      });
  }
  getDetailGroupByRoom(listpick) {
    this.listpickingdetail = [];
    this.detailpicklist = this.detailpicklist ? false : true
    this.roomlist = listpick.room
    this.api.get('table/picking_list', { params: { limit: 30, filter: "status='OPEN'" + " AND " + "room=" + "'" + listpick.room + "'" } })
      .subscribe(val => {
        this.listpickingdetail = val['data'];
        this.totaldatapickingdetail = val['count'];
      });
  }
  getSearchInvoice(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.invoice_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.listpicking;
    }
  }
  getSearchItems(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.listpicking;
    }
  }
  getSearchRoom(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.room.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.searchpicking;
    }
  }
  getSearchGroupInvoice(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.invoice_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.searchpicking;
    }
  }
  getSearchGroupItems(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.searchpicking;
    }
  }
  getSearchGroupRoom(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listpicking = this.searchpicking.filter(pick => {
        return pick.room.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.listpicking = this.searchpicking;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getpicking().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefreshpicking(refresher) {
    this.api.get('table/picking_list', { params: { limit: 30, filter: "status='OPEN'" } })
      .subscribe(val => {
        this.listpicking = val['data'];
        this.totaldatapicking = val['count'];
        this.searchpicking = this.listpicking;
        refresher.complete();
      });
  }

  doSortPICK(filter) {
    if (this.sortPICK == 'ASC') {
      this.sortPICK = 'DESC'
    }
    else {
      this.sortPICK = 'ASC'
    }
    this.api.get("table/picking_list", { params: { filter: "status='OPEN'", sort: filter + " " + this.sortPICK + " " } }).subscribe(val => {
      this.listpicking = val['data'];
      this.totaldatalistpicking = val['count'];
      this.filter = filter
    });
  }
  doSortPICKDetail(filter, listpick) {

  }
  getUsers() {
    this.api.get('table/user_role', { params: { filter: "id_area='INBOUND' AND id_group='STAFF'" } }).subscribe(val => {
      this.users = val['data'];
    });
  }
  onChange(user) {
    this.userpic = user.id_user;
  }
  doOffToPIC() {
    document.getElementById("myModalPic").style.display = "none";
    this.myFormModal.reset()
  }
  doOpenToPIC() {
    this.getUsers();
    document.getElementById("myModalPic").style.display = "block";
  }
  doSendToPic() {
    this.doSendNotificationPic();
  }
  doSendNotificationPic() {
    this.api.get("table/user", { params: { filter: "id_user=" + "'" + this.userpic + "'" } })
      .subscribe(val => {
        this.usertoken = val['data'];
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": "key=AAAAtsHtkUc:APA91bF8isugU-XkNTVVYVC-eQQJxn1UI4wBqUcbuXNvh2yUAS3CfDCxDB8himPNr4wJx8f5KPezZpY_jpTr8_WegNEiJ1McJAriwYJZ5iOv0Q1X6CXnDn_xZeGbWX-V6DnPk7XImX5L"
        })
        this.http.post("https://fcm.googleapis.com/fcm/send",
          {
            "to": this.usertoken[0].token,
            "notification": {
              "body": this.usertoken[0].name + ", You have new job ",
              "title": "Atria Warehouse",
              "content_available": true,
              "priority": 2,
              "sound": "default",
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "color": "#FFFFFF",
              "icon": "atria"
            },
            "data": {
              "body": this.usertoken[0].name + ", You have new job ",
              "title": "Atria Warehouse",
              "param": "PICKING"
            }
          },
          { headers })
          .subscribe(data => {
          }, (e) => {
          });
      });

  }
}
