import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { UserService } from '../../services/user/user.service';
import { OrdersService } from '../../services/orders/orders.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { RefreshService } from '../../services/refresh/refresh.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public active: boolean = false;
  public show_active: boolean = true;
  public status: number = 10;
	public estado = { 
    activo: 2,
    token: null
  };
  public datos:any;
  public repartidor:any;
  public count_notify: any;
  public loading;
  public orders: any;
  public show_notify: boolean = false;
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;

  constructor(
  	public navCtrl: NavController, 
  	public refresh: RefreshService,
  	public storage: StorageService, 
  	private loadingCtrl: LoadingController, 
  	private toastCtrl: ToastController, 
  	public userService: UserService,
  	public orderService: OrdersService,
    private objService: ObjectserviceService,
    public cdr: ChangeDetectorRef,
    private alertController: AlertController,
    public modalController: ModalController,
    private ga: GoogleAnalytics
  	) {
  }

  ngOnInit(){
    this.ga.trackView('Home')
    .then(() => {})
    .catch(e => console.log(e));
  }

  ionPageWillLeave() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }

  ionViewWillEnter() { 
    this.initStatus();
    this.storage.get('notifyGPROVSV24').then(items => {
      if (items == '1') {
        this.show_notify = true;
      } else {
        this.show_notify = false;
      }
    }); 
    this.subscription2 = this.refresh.formRefreshSource2$.subscribe((msg:any) => {
      this.initStatus();
      this.cdr.detectChanges();
    });
    this.subscription3 = this.refresh.formRefreshSource1$.subscribe((msg:any) => {
      this.objService.setExtras(msg);
      this.navCtrl.navigateForward('detail-order');
    });
    this.subscription1 = this.refresh.formRefreshSource$.subscribe((msg:any) => {
      this.getOrders();
    }); 
    this.subscription4 = this.refresh.formRefreshSource3$.subscribe((msg:any) => {
     this.show_notify = true;
    }); 
  }

  initStatus(){
    this.presentLoading();
    this.storage.get('idRPSV24').then(items => {
      if (items) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2) {
            this.userService.getStatus(items,items2).subscribe(
            data => {
              console.log(data);
              this.repartidor = data;
              this.status = this.repartidor.repartidor.activo;
              this.loading.dismiss();
              if (this.repartidor.repartidor.estado === 'OFF') {
                this.status = 0;
              } else {
                if (this.status == 1) {
                  this.active = true;
                  this.getOrders();
                } else {
                  this.orders = [];
                }
              }
            },
            msg => {
              this.loading.dismiss();
              if(msg.status == 400 || msg.status == 401){ 
                this.storage.set('TRPSV24','');
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                this.navCtrl.navigateRoot('login');
              }
            });
          }
        });
      }
    }); 
  }
  
  changeStatus(){
  	this.presentLoading();
    if (this.repartidor.repartidor.estado === 'OFF') {
      this.status = 0;
    } else {
      this.active = !this.active;
      if (this.active) {
        this.estado.activo = 1;
      } else {
        this.estado.activo = 2;
      }
      this.storage.get('idRPSV24').then(items => {
      if (items) {
        this.storage.get('TRPSV24').then(items2 => {
            if (items2) {
              this.estado.token = items2;
              this.userService.setStatus(items,items2,this.estado).subscribe(
                data => {
                this.loading.dismiss();
                this.datos = data;
                if (this.datos.repartidor.activo == 1) {
                  this.active = true;
                  this.presentToast('Servicio Activado');
                } else {
                  this.active = false;
                  this.presentToast('Servicio Desactivado');
                }
              },
              msg => {
                this.loading.dismiss();
                if(msg.status == 400 || msg.status == 401){ 
                  this.storage.set('TRPSV24','');
                  this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                  this.navCtrl.navigateRoot('login');
                }
              });
            }
          });
        }
      });
    }
  }

  getOrders(){
    this.storage.get('idRPSV24').then(items => {
      if (items) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2) {
            this.orderService.getInput(items,items2).subscribe(
            data => {
              this.datos = data;
              this.orders = this.datos.pedido;
              for (var i = 0; i < this.orders.length; ++i) {
                this.orders[i].tiempo = moment(this.orders[i].tiempo).format('DD/MM/YYYY');
              }
              this.orders = this.sortByKey(this.orders,'id');
            },
            msg => {
              if(msg.status == 400 || msg.status == 401){ 
                this.storage.set('TRPSV24','');
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                this.navCtrl.navigateRoot('login');
              } else if(msg.status == 404){
                this.orders = [];
              }
            }); 
          }
        });
      }
    });
  }

  doRefresh(event) {
    this.storage.get('idRPSV24').then(items => {
      if (items) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2) {
            this.orderService.getInput(items,items2).subscribe(
            data => {
              this.datos = data;
              this.orders = this.datos.pedido;
              for (var i = 0; i < this.orders.length; ++i) {
                this.orders[i].tiempo = moment(this.orders[i].tiempo).format('DD/MM/YYYY');
              }
              this.orders = this.sortByKey(this.orders,'id');
              event.target.complete();
            },
            msg => {
              event.target.complete();
              if(msg.status == 400 || msg.status == 401){ 
                this.storage.set('TRPSV24','');
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                this.navCtrl.navigateRoot('login');
              } else if(msg.status == 404){
                this.orders = [];
              }
            }); 
          }
        });
      }
    });
  }

  viewDetails(item){
    this.objService.setExtras(item.id);
    this.navCtrl.navigateForward('detail-order');
  }

  completeRegister(){
    this.navCtrl.navigateForward('complete-register');
  }

  async viewNotification() {
    const modal = await this.modalController.create({
      component: NotificationsComponent
    });
    modal.onDidDismiss().then((close)=> { 
      this.show_notify = false;   
    });
    return await modal.present();  
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
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

  public sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 0 : 1));
    });
  }
}
