import { Component, ViewChild } from '@angular/core';
import { AlertController, ViewController, IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UUID } from 'angular2-uuid';
/**
 * Generated class for the ReceivingdetailupdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receivingdetailupdate',
  templateUrl: 'receivingdetailupdate.html',
})
export class ReceivingdetailupdatePage {
  myForm: FormGroup;
  private detailno = '';
  private orderno = '';
  private itemno = '';
  private qty = '';
  private staging = '';
  private description = '';
  private uuidrcv = '';
  private uuid = '';
  private locationcode = '';
  private photos = [];
  private totalphoto:any;
  imageURI: string = '';
  imageFileName: string = '';

  error_messages = {
    'docno': [
      { type: 'required', message: 'Doc No Must Be Fill' }

    ],
    'staging': [
      { type: 'required', message: 'Staging Must Be Fill' }
    ],
    'description': [
      { type: 'required', message: 'descrption Code Must Be Fill' }
    ]
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public api: ApiProvider,
    public fb: FormBuilder,
    public http: HttpClient
  ) {
    this.myForm = fb.group({
      orderno: [''],
      itemno: [''],
      qty: [''],
      staging: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    })
    this.detailno = navParams.get('detailno');
    this.orderno = navParams.get('orderno');
    this.itemno = navParams.get('itemno');
    this.qty = navParams.get('qty');
    this.staging = navParams.get('staging');
    this.description = navParams.get('description');
    this.locationcode = navParams.get('locationcode')
    this.uuidrcv = navParams.get('uuid');
    this.myForm.get('orderno').setValue(this.orderno);
    this.myForm.get('itemno').setValue(this.itemno);
    this.myForm.get('qty').setValue(this.qty);
    this.myForm.get('staging').setValue(this.staging);
    this.myForm.get('description').setValue(this.description);
    this.getPhotos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivingdetailupdatePage');
  }
  close() {
    this.viewCtrl.dismiss();
  }
  deletePhoto(photo) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");

            this.api.delete("table/link_image", { params: { filter: 'no=' + "'" + photo.no + "'" }, headers })
              .subscribe(
                (val) => {
                  console.log("DELETE call successful value returned in body",
                    val);
                  this.api.get("table/link_image", { params: { filter: 'parent=' + "'" + photo.parent + "'" } }).subscribe(val => {
                    this.photos = val['data'];
                    this.totalphoto = val['count'];
                  });
                },
                response => {
                  console.log("DELETE call in error", response);
                },
                () => {
                  console.log("The DELETE observable is now completed.");
                });
          }
        }
      ]
    });
    confirm.present();
  }
  getPhotos(){
    this.api.get("table/link_image", { params: { filter: 'parent=' + "'" + this.uuidrcv + "'" } }).subscribe(val => {
      this.photos = val['data'];
      this.totalphoto = val['count'];
    })
  }
  getCamera() {
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
              "img_src": 'http://101.255.60.202/webapi/img/'+this.uuid,
              "file_name": this.uuid,
              "description": "",
              "latitude": "",
              "longitude": "",
              "location_code": this.locationcode,
              "upload_date": "",
              "upload_by": ""
            },
            { headers })
            .subscribe(
              (val) => {
                this.presentToast("Image uploaded successfully");
              });
          this.imageURI = '';
          this.imageFileName = '';
          this.api.get("table/link_image", { params: { filter: 'parent=' + "'" + this.uuidrcv + "'" } }).subscribe(val => {
            this.photos = val['data'];
            this.totalphoto = val['count'];
          });
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

  doSave() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/receiving",
      {
        "receiving_no": this.detailno,
        //"receiving_date": '',
        "receiving_description": this.myForm.value.description,
        "staging": this.myForm.value.staging,
        "receiving_pic": 'Aji'
      },
      { headers })
      .subscribe(
        (val) => {
          console.log("Update call successful value returned in body",
            val);
          let alert = this.alertCtrl.create({
            title: 'Sukses',
            subTitle: 'Save Sukses',
            buttons: ['OK']
          });
          alert.present();
          this.viewCtrl.dismiss();
        }
      )
  };
}
