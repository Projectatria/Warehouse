import { Component } from '@angular/core';
import { AlertController, ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  public photos: any;
  public base64Image: string;
  private detailno = '';
  private orderno = '';
  private itemno = '';
  private qty = '';
  private staging = '';
  private description = '';
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
    public viewCtrl: ViewController, 
    private camera: Camera, 
    private alertCtrl: AlertController,
    public api: ApiProvider,
    public fb: FormBuilder
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
    this.myForm.get('orderno').setValue(this.orderno);
    this.myForm.get('itemno').setValue(this.itemno);
    this.myForm.get('qty').setValue(this.qty);
    this.myForm.get('staging').setValue(this.staging);
    this.myForm.get('description').setValue(this.description);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivingdetailupdatePage');
  }
  close() {
    this.viewCtrl.dismiss();
  }
  ngOnInit() {
    this.photos = [];
  }
  deletePhoto(index) {
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
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
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
      )};
}
