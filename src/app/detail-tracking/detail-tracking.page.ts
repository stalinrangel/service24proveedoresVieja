import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { OrdersService } from '../../services/orders/orders.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { CalificationPage } from '../calification/calification.page';
import { CancelOrderPage } from '../cancel-order/cancel-order.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocationTrackerService } from '../../services/location-tracker/location-tracker.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { RefreshService } from '../../services/refresh/refresh.service';

declare var launchnavigator;
declare var cordova;

@Component({
  selector: 'app-detail-tracking',
  templateUrl: './detail-tracking.page.html',
  styleUrls: ['./detail-tracking.page.scss'],
})
export class DetailTrackingPage implements OnInit {

  public data: any;
  public loading: any;
  public myLatLng: any;
  public user = {
  	nombre: 'Proveedor',
  	imagen: 'assets/profile-general.png',
  	direccion: '',
    telefono: ''
  }
  public service = {
    nombre: 'Servicio',
    categoria: 'Categoria',
    descripcion: 'Descripcion',
    estado: 2,
    referencia: '',
    puntaje1: 0,
    comentario1: '',
    puntaje2: 0,
    comentario2: '',
    producto_id: ''
  }

  public finishRoute = {
    pedido_id: '',
    token_notificacion: '',
    token: '',
    finalizo: 16
  }
  public encaminov = 0;
  public datos: any;

  public chat = {
    usuario_id: '',
    id: '',
    token_notificacion: ''
  }

  public options : InAppBrowserOptions = {
    location : 'no',
    presentationstyle : 'pagesheet',
  };

  constructor(
    public navCtrl: NavController,
    public storage: StorageService, 
    private loadingCtrl: LoadingController, 
    private toastCtrl: ToastController, 
  	private objService: ObjectserviceService,
    public orderService: OrdersService,
    private launchNavigator: LaunchNavigator,
    private diagnostic: Diagnostic,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private modalController: ModalController,
    private callNumber: CallNumber,
    public locationTracker: LocationTrackerService,
    public http: HttpClient,
    public refresh: RefreshService,
    private iab: InAppBrowser
  ) { 
  	this.data = this.objService.getExtras();
    console.log(this.data)
  	this.user.nombre = this.data.usuario.nombre;
  	this.user.imagen = this.data.usuario.imagen;
    this.user.telefono = this.data.usuario.telefono;
  	this.user.direccion = this.data.direccion;
    this.service.nombre = this.data.productos[0].nombre;
    this.service.descripcion = this.data.productos[0].descripcion;
    this.service.categoria = this.data.productos[0].subcategoria.categoria.nombre +' - '+ this.data.productos[0].subcategoria.nombre;
    this.service.estado = this.data.estado;
    this.service.referencia = this.data.referencia;
    this.service.producto_id = this.data.productos[0].id;
    this.encaminov = this.data.encamino;
    this.storage.getObject('userRPSV24').then(items => {
      if (items != '' && items != null) {
        if (this.data.calificacion) {     
          for (var j = 0; j < this.data.calificacion.length; ++j) {
            if (this.data.calificacion[j].usuario_id == items.id) {
              this.service.puntaje1 = this.data.calificacion[j].puntaje;
              this.service.comentario1 = this.data.calificacion[j].comentario;
            } else {
              this.service.puntaje2 = this.data.calificacion[j].puntaje;
              this.service.comentario2 = this.data.calificacion[j].comentario;
            }
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillLeave(){
    if (this.data.estado == 3) {
      this.refresh.publishFormRefresh('track');
    }
  }

  finish(){
    this.finishRoute.pedido_id = this.data.id;
    this.storage.get('idRPSV24').then(items => {
      if (items != '' && items != null) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2 != '' && items2 != null) {
            this.finishRoute.token = items2;
            this.storage.get('notify_RPSV24').then(items3 => {
              if (items3 != '' && items3 != null) {
                this.finishRoute.token_notificacion = items3;
                this.presentLoading();
                this.orderService.finishService(items,this.finishRoute,items2).subscribe(
                  data => {
                    this.data.estado = 4;
                    this.loading.dismiss();
                    this.locationTracker.stopTracking();
                    this.presentToast('Servicio finalizado con éxito');
                    this.presentModal();
                  },
                  msg => {
                    this.loading.dismiss();
                    if(msg.status == 400 || msg.status == 401){ 
                      this.storage.set('TRPSV24','');
                      this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                      this.navCtrl.navigateRoot('login');
                    }       
                  }
                );
              }
            });
          }
        });
      }
    });
  }

  GoMap(){
    this.launchNavigator.navigate([this.data.lat, this.data.lng]); 
  }

  whatsapp(){
    var first = this.user.telefono.charAt(0);
    var second = this.user.telefono.charAt(1);
    var third = this.user.telefono.charAt(2);
    if (first == '5' || first == '+') {
      cordova.InAppBrowser.open(" https://wa.me/"+this.user.telefono,"_system");
    } else {
      cordova.InAppBrowser.open(" https://wa.me/507"+this.user.telefono,"_system");
    }
  }


  chatPedidos(id){
    this.chat.usuario_id = this.data.usuario.id;
    this.chat.id = this.data.id;
    this.chat.token_notificacion = this.data.usuario.token_notificacion; 
    this.objService.setExtras(this.chat);
    this.navCtrl.navigateForward('chat-pedidos');
  };

  encamino(){
    this.presentLoading();
    this.http.get(`${environment.api}encamino/`+this.data.id)
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.encaminov = 1;
      this.loading.dismiss();
      this.locationTracker.startTracking();
      this.presentToast('Servicio marcado en camino con éxito');
    },
    msg => {
      console.log(msg);
      this.loading.dismiss();
    }); 
  };

  async presentModal() {
    const modal = await this.modalController.create({
      component: CalificationPage,
      componentProps: { value: this.data },
      cssClass: 'calification-modal-css'
    });
    modal.onDidDismiss().then((close)=> {
      if (close.data == 2) {
        this.refresh.publishFormRefresh('histories');
        this.navCtrl.pop();
      }      
    });
    return await modal.present();
  }

  async presentModal1() {
    const modal = await this.modalController.create({
      component: CancelOrderPage,
      componentProps: { value: this.data.id },
      cssClass: 'cancel-modal-css'
    });
    modal.onDidDismiss().then((close)=> {
      if (close.data == 2) {
        this.refresh.publishFormRefresh('histories');
        this.navCtrl.pop();
      }      
    });
    return await modal.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 15000,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2000,
      cssClass: 'toast-scheme'
    });
    toast.present();
  }

  async presentConfirm() {
      const alert = await this.alertController.create({
    message: '¿Está seguro de finalizar la solicitud #'+ this.data.id +'?',
    buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.finish();
            }
          }
        ]
    });
    await alert.present();
  }

  async presentConfirm1(item) {
    const alert = await this.alertController.create({
    header: 'Llamar',
    message: item,
    buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.callClient(item);
            }
          }
        ]
    });
    await alert.present();
  }

  callClient(item){
    this.callNumber.callNumber(item, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
}