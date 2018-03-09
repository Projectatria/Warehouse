import { Component } from '@angular/core';
import { ModalController, MenuController, IonicPage, LoadingController, NavController, ToastController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-qcindetail',
  templateUrl: 'qcindetail.html',
})
export class QcindetailPage {
  private quality_control = [];
  private qcresult = [];
  searchqc: any;
  halaman = 0;
  totaldata: any;
  totaldataqcresult: any;
  public toggled: boolean = false;
  qc: string = "qcin";
  button: string = "qcin";
  orderno = '';
  data = {};
  option: BarcodeScannerOptions;
  public buttonText: string;
  private uuid = '';
  private uuidrcv = '';
  public loading: boolean;
  private photos = [];
  private totalphoto: any;
  imageURI: string = '';
  imageFileName: string = '';
  public detailqc: boolean = false;
  private qclist = '';
  public functionality: boolean = false;
  public productstyle: boolean = false;
  public datameasurement: boolean = false;
  public packaging: boolean = false;
  public shippingmark: boolean = false;

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
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
  ) {
    this.orderno = navParams.get('orderno')
    this.getQC();
    this.toggled = false;
    this.detailqc = false;
    this.functionality = false;
    this.productstyle = false;
    this.datameasurement = false;
    this.packaging = false;
    this.shippingmark = false;
    this.qc = "qcin"
    this.button = "qcin"
  }
  getQC() {
    return new Promise(resolve => {
      let offsetinfopo = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/qc_in', { params: { limit: 30, offset: offsetinfopo, filter: 'order_no=' + "'" + this.orderno + "'" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.quality_control.push(data[i]);
              this.totaldata = val['count'];
              this.searchqc = this.quality_control;
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  getSearchQCDetail(ev: any) {
    console.log(ev)
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.quality_control = this.searchqc.filter(qc => {
        return qc.item_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.quality_control = this.searchqc;
    }
  }
  menuShow() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  };

  doInfinite(infiniteScroll) {
    this.getQC().then(response => {
      infiniteScroll.complete();

    })
  }
  toggleSearch() {
    this.toggled = this.toggled ? false : true;
  }

  doRefresh(refresher) {
    this.api.get('table/qc_in', { params: { limit: 30, filter: 'order_no=' + "'" + this.orderno + "'" } })
      .subscribe(val => {
        this.quality_control = val['data'];
        this.totaldata = val['count'];
        this.searchqc = this.quality_control;
        refresher.complete();
      });
  }
  ionViewDidLoad() {
    console.log(this.orderno)
  }
  doPassed() {
    console.log('Passed')
  }
  doReject() {
    console.log('Reject')
  }
  // doChecked() {
  //   this.buttonText = "Loading..";
  //   this.loading = true;
  //   this.option = {
  //     prompt: "Please scan your code"
  //   }
  //   this.barcodeScanner.scan().then((barcodeData) => {
  //     if (barcodeData.cancelled) {
  //       console.log("User cancelled the action!");
  //       this.loading = false;
  //       return false;
  //     }
  //     this.data = barcodeData;
  //   });
  // }
  doChecked() {
    document.getElementById("myQCChecking").style.display = "block";
    document.getElementById("myHeader").style.display = "none";
    this.button = "qccheck"
  }
  doOffChecking() {
    document.getElementById("myQCChecking").style.display = "none";
    document.getElementById("myHeader").style.display = "block";
    this.button = "qcin"
  }
  doDetailQC(qc) {
    this.qclist = qc.item_no;
    this.detailqc = this.detailqc ? false : true;
    this.getQCResult(qc);
  }
  doCamera() {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI
    }
    options.sourceType = this.camera.PictureSourceType.CAMERA

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.imageFileName = this.imageURI;
      if (this.imageURI == '') return;
      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();
      const fileTransfer: FileTransferObject = this.transfer.create();

      let uuid = UUID.UUID();
      this.uuid = uuid;
      let options: FileUploadOptions = {
        fileKey: 'fileToUpload',
        //fileName: this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1),
        fileName: uuid + '.jpeg',
        chunkedMode: true,
        mimeType: "image/jpeg",
        headers: {}
      }

      let url = "http://10.10.10.7/webapi5/api/Upload";
      fileTransfer.upload(this.imageURI, url, options)
        .then((data) => {
          loader.dismiss();
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");

          this.api.post("table/link_image",
            {
              "no": this.uuid,
              "parent": this.uuidrcv,
              "table_name": "Receiving",
              "img_src": 'http://101.255.60.202/webapi/img/' + this.uuid,
              "file_name": this.uuid,
              "description": "",
              "latitude": "",
              "longitude": "",
              "location_code": '',
              "upload_date": "",
              "upload_by": ""
            },
            { headers })
            .subscribe(
              (val) => {
                this.presentToast("Image uploaded successfully");
                this.api.get("table/link_image", { params: { filter: 'parent=' + "'" + this.uuidrcv + "'" } }).subscribe(val => {
                  this.photos = val['data'];
                  this.totalphoto = val['count'];
                });
              });
          this.imageURI = '';
          this.imageFileName = '';
        }, (err) => {
          console.log(err);
          loader.dismiss();
          this.presentToast(err);
        });
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  getQCResult(qc) {
    return new Promise(resolve => {
      this.api.get("table/qc_in_result", { params: { filter: 'qc_no=' + "'" + qc.qc_no + "'" } }).subscribe(val => {
        this.qcresult = val['data'];
        this.totaldataqcresult = val['count'];
        resolve();
      })
    });
  }
  dofunctionality() {
    this.functionality = this.functionality ? false : true;
  }
  doproductstyle() {
    this.productstyle = this.productstyle ? false : true;
  }
  dodatameasurement() {
    this.datameasurement = this.datameasurement ? false : true;
  }
  dopackaging() {
    this.packaging = this.packaging ? false : true;
  }
  doshippingmark() {
    this.shippingmark = this.shippingmark ? false : true;
  }
}