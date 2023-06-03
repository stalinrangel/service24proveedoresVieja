import { Component } from '@angular/core';
import { Platform, NavController, ModalController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Vibration } from '@ionic-native/vibration/ngx'
import { Router } from '@angular/router';
import { ObjectserviceService } from '../services/objetcservice/objectservice.service';
import { StorageService } from '../services/storage/storage.service';
import { LocationTrackerService } from '../services/location-tracker/location-tracker.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { RefreshService } from '../services/refresh/refresh.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private onesignal: OneSignal,
    public navCtrl: NavController, 
    public refresh: RefreshService,
    public vibration: Vibration,
    private router: Router,
    private objService: ObjectserviceService,
    private storageService: StorageService,
    public locationTracker: LocationTrackerService,
    public modalController: ModalController,
    private alertController: AlertController, 
    private ga: GoogleAnalytics
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

     this.ga.startTrackerWithId('UA-168168892-1')
     .then(() => {
       console.log('Google analytics is ready now');
     })
     .catch(e => console.log('Error starting GoogleAnalytics', e));

      this.storageService.set('notifyGPROVSV24', '0'); 
      var that = this;
      this.onesignal.setLogLevel({logLevel: 6, visualLevel: 0});

      this.onesignal.startInit("d972ea38-fbba-48de-ac2c-991904917c41", "883867864317")
      .inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.None)
      .handleNotificationOpened(function(jsonData) {

        if(jsonData.notification.payload.additionalData.accion == 6){
          setTimeout(()=>{
            that.refresh.publishFormRefresh1(jsonData.notification.payload.additionalData.obj);
          },500)
        }

        if(jsonData.notification.payload.additionalData.accion == 2){
          setTimeout(()=>{
            var user = JSON.parse(jsonData.notification.payload.additionalData.obj);
            let data = {admin_id: user.emisor.id, chat_id: user.chat_id, token_notificacion: user.emisor.token_notificacion};
            that.objService.setExtras(data);
            that.navCtrl.navigateRoot('/tabs/tab3').then(()=>{
              that.navCtrl.navigateForward('chat-support');
            });
          },500)   
        }

        if(jsonData.notification.payload.additionalData.accion == 3){
          setTimeout(()=>{
            that.locationTracker.stopT();
            that.router.navigateByUrl('/tabs/tab2').then(()=>{
              that.refresh.publishFormRefresh2('histories');
            }); 
          },500);
        }

        if(jsonData.notification.payload.additionalData.accion == 8){
          setTimeout(()=>{
            var user = JSON.parse(jsonData.notification.payload.additionalData.obj);
            let data = {usuario_id: user.admin_id, id: user.chat_id, token_notificacion: user.token_notificacion};
            that.objService.setExtras(data);
            that.navCtrl.navigateRoot('/tabs/tab2').then(()=>{
              that.navCtrl.navigateForward('chat-pedidos');
            });
          },500)   
        }

        //CALIFICAR PEDIDO
        if(jsonData.notification.payload.additionalData.accion == 16){
          setTimeout(()=>{
            that.locationTracker.stopT();
            that.router.navigateByUrl('/tabs/tab2').then(()=>{
              that.refresh.publishFormRefresh1(jsonData.notification.payload.additionalData.obj);
            }); 
          },500)
        }

        //NOTIFICACIONES GENERALES
        if(jsonData.notification.payload.additionalData.accion == 17){
          setTimeout(()=>{
            that.storageService.set('notifyGPROVSV24', '1');
            that.viewNotification(); 
          },500)
        } 

        //PAGOS
        if(jsonData.notification.payload.additionalData.accion == 18){
          setTimeout(()=>{
            that.navCtrl.navigateRoot('/tabs/tab3').then(()=>{
              that.navCtrl.navigateForward('payments');
            });
          },500)
        }
      })
      .handleNotificationReceived(function(jsonData) {

        if(jsonData.payload.additionalData.accion == 2){          
          var user = JSON.parse(jsonData.payload.additionalData.obj);
          const mockMsg = {
            id: Date.now().toString(),
            emisor_id: user.emisor.id,
            userAvatar: user.emisor.imagen,
            receptor_id: 232322,
            created_at: Date.now(),
            msg: jsonData.payload.additionalData.contenido,
            status: 2
          };
          that.refresh.publishFormRefresh(mockMsg);
          
          if (that.router.url != '/chat-support') {
            setTimeout(()=>{
              let data = {admin_id: user.emisor.id, chat_id: user.chat_id, token_notificacion: user.emisor.token_notificacion};
              that.objService.setExtras(data);
              that.presentAlert(jsonData.payload.additionalData.contenido); 
            },500) 
          }
        }

        if(jsonData.payload.additionalData.accion == 8){
          setTimeout(()=>{
            let data = {msg: jsonData.payload.additionalData.contenido};
            that.refresh.publishFormRefresh(data); 
          },500)   

          if (that.router.url != '/chat-pedidos') {
            setTimeout(()=>{
              let data = {usuario_id: user.admin_id, id: user.chat_id, token_notificacion: user.token_notificacion};
              that.objService.setExtras(data);
              that.presentAlert1(jsonData.payload.additionalData.contenido); 
            },500) 
          } 
        }

        if(jsonData.payload.additionalData.accion == 3){
          setTimeout(()=>{
            that.locationTracker.stopT();
            that.refresh.publishFormRefresh2('histories'); 
          },500);
        }

        //PROVEEDOR APROBADO
        if(jsonData.payload.additionalData.accion == 9){
          setTimeout(()=>{
            that.refresh.publishFormRefresh2(Date.now());
          },300)
        }

        //CALIFICAR PEDIDO
        if(jsonData.payload.additionalData.accion == 16){
          setTimeout(()=>{
            that.locationTracker.stopT();
            that.refresh.publishFormRefresh1(jsonData.payload.additionalData.pedido_id);
          },300)
        }

        //NOTIFICACIONES GENERALES
        if(jsonData.notification.payload.additionalData.accion == 17){
          setTimeout(()=>{
            that.storageService.set('notifyGPROVSV24', '1');
            that.refresh.publishFormRefresh3(Date.now());
            that.presentAlert2(jsonData.payload.additionalData.contenido);
          },500)
        }

        //PAGOS
        if(jsonData.notification.payload.additionalData.accion == 18){
          setTimeout(()=>{
            that.refresh.publishFormRefresh(Date.now());
          },500)
        }
      })
      .endInit();
    });
  }

  async viewNotification() {
    const modal = await this.modalController.create({
      component: NotificationsComponent
    });
    modal.onDidDismiss().then((close)=> {    
    });
    return await modal.present();  
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Chat Soporte',
      message: msg,
      buttons: [
     {
          text: 'Ir al chat',
          handler: () => {          
            this.router.navigateByUrl('chat-support');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert1(msg) {
    const alert = await this.alertController.create({
      header: 'Chat Pedido',
      message: msg,
      buttons: [
     {
          text: 'Ir al chat',
          handler: () => {          
            this.navCtrl.navigateRoot('/tabs/tab2').then(()=>{
              this.navCtrl.navigateForward('chat-pedidos');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert2(msg) {
    const alert = await this.alertController.create({
      header: 'Service24',
      message: msg,
      buttons: [
     {
          text: 'OK',
          handler: () => {          
           
          }
        }
      ]
    });
    await alert.present();
  }
}
