import { Component, ViewChild } from '@angular/core';
import { AlertController, ViewController, IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-receivingdetailview',
  templateUrl: 'receivingdetailview.html',
})
export class ReceivingdetailviewPage {
  imageURI: string = '';
  imageFileName: string = '';
  private uuid1 = '';
  private uuid2 = '';

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
  ) { }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad UploadPage');
  }
  getImage() {
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

      let options: FileUploadOptions = {
        fileKey: 'fileToUpload',
        fileName: this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1),
        chunkedMode: true,
        mimeType: "image/jpeg",
        headers: {}
      }

      let url = "http://10.10.10.7/webapi5/api/Upload";
      fileTransfer.upload(this.imageURI, url, options)
        .then((data) => {
          console.log(" Uploaded Successfully", data);

          loader.dismiss();
          this.presentToast("Image uploaded successfully");
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
  insertUUID() {
    let uuid = UUID.UUID();
    let uuid2 = UUID.UUID();
    this.uuid1 = uuid;
    this.uuid2 = uuid2;
    console.log(this.uuid1);
    console.log(this.uuid2);
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.post("table/link_image",
      {
        "no": this.uuid1,
        "parent": this.uuid2
      },
      { headers })
      .subscribe(
        (val) => {
          this.presentToast("Insert successfully");
        },
        (err) => {
          console.log(err);
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
  close() {
    this.viewCtrl.dismiss();
  }
}
