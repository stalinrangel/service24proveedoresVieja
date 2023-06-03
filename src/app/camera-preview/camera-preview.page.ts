import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { NavController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { RefreshService } from '../../services/refresh/refresh.service';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.page.html',
  styleUrls: ['./camera-preview.page.scss'],
})
export class CameraPreviewPage implements OnInit {


  smallPreview: boolean;
  IMAGE_PATH: any;
  colorEffect = 'none';
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  id: any;

  constructor(
    private cameraPreview: CameraPreview,
    private nav: NavController,
    private modalCtrl:ModalController,
    public refresh: RefreshService,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private toastController: ToastController,
  ) { 
  }


  ngOnInit() {
    this.verifyCamera();
  }


  verifyCamera(){
    if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          this.diagnostic.isCameraAuthorized().then((authorized) => {
              if(authorized)
                  this.startCameraBelow();
              else {
                this.diagnostic.requestCameraAuthorization().then((status) => {
                    if(status == this.diagnostic.permissionStatus.GRANTED)
                      this.startCameraBelow();
                    else {
                      this.request();
                      this.presentToast('No es posible acceder a la cámara, otorga permisos');
                    }
                });
              }
          });
        });
    } else {
      this.startCameraBelow();
    }
  }

  request(){
    let permission = this.diagnostic.permission;
    this.diagnostic.requestRuntimePermission(permission.CAMERA).then(
      success => {
        console.log('reuqestCameraAuthroization, success', success);
      },
      error => {
        console.log('reuqestCameraAuthroization, error', error);
      },
    );
  }

  startCameraAbove() {
    this.isToBack = false;
    this.cameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
  }

  startCameraBelow() {
    this.isToBack = true;
    let options = {
      x: 0,
      y: 50,
      width: window.screen.width,
      height: window.screen.height,
      toBack: true,
      tapPhoto: true,
      tapFocus: false,
      previewDrag: false,
      storeToFile: true,
      camera: "front",
      disableExifHeaderStripping: false
    };
      this.cameraPreview.startCamera(options);
  }

  goBack(){
    this.nav.pop();
  }

  stopCamera() {
    this.cameraPreview.stopCamera();
  }

  takePicture() {
    this.cameraPreview.takePicture({
      width: 400,
      height: 400,
      quality: 65
    }).then((imageData) => {
      this.IMAGE_PATH = imageData;
      if (this.platform.is('android')) {
        this.refresh.publishFormRefresh('file://' + imageData.toString());   
      } else {
        this.refresh.publishFormRefresh(imageData.toString());
      }    
      this.cameraPreview.stopCamera();
      this.nav.pop();
    }, (err) => {
      console.log(err);
      this.cameraPreview.stopCamera();
    });
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  show() {
    this.cameraPreview.show();
  }

  hide() {
    this.cameraPreview.hide();
  }

  changeColorEffect() {
    this.cameraPreview.setColorEffect(this.colorEffect);
  }

  changeFlashMode(mode) {
    this.cameraPreview.setFlashMode(mode);
  }

  changeZoom() {
    this.cameraPreview.setZoom(this.setZoom);
  }

  showSupportedPictureSizes() {
    this.cameraPreview.getSupportedPictureSizes().then((sizes) => {
      console.log(sizes);
    }, (err) => {
      console.log(err);
    });
  }
  
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      cssClass: "toast-scheme",
      duration: 2000
    });
    toast.present();
  }

}
