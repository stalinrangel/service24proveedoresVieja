import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { OrdersService } from '../../services/orders/orders.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { NavigationEnd, Router } from '@angular/router';
import { CalificationPage } from '../calification/calification.page';
import { LocationTrackerService } from '../../services/location-tracker/location-tracker.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { RefreshService } from '../../services/refresh/refresh.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

	history: any;

	public myDate:string = moment().format();
  public myDate1:string = moment().format();
	public DateNow: string;
	public DateCut: any;
  public DateNow1: string;
  public DateCut1: any;
	public month: string;
	public year: string;
	public datos: any;
	public pedidos: any;
	public loading;
	public showHistory: number = 0;
	public count_notify: any;
  public type: string = "track";
  public orders: any;
  private subscription: Subscription;
  public calificate = {
    calificate: false,
    usuario_id: '',
  }
  public id: any = null;
  public data: any;
  public band = 0;
  public show_notify: boolean = false;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;

  constructor(
  	public navCtrl: NavController,
  	public storage: StorageService, 
  	private loadingCtrl: LoadingController, 
  	private toastCtrl: ToastController, 
  	public refresh: RefreshService,
  	public orderService: OrdersService,
    private objService: ObjectserviceService,
    public modalController: ModalController,
    private router: Router,
    public locationTracker: LocationTrackerService,
    private zone: NgZone
  ) {
  }

  ionViewWillEnter() {
    this.initOrder();
    this.storage.get('notifyGPROVSV24').then(items => {
      if (items == '1') {
        this.show_notify = true;
      } else {
        this.show_notify = false;
      }
    });
    this.subscription1 = this.refresh.formRefreshSource$.subscribe((msg:any) => {
      this.type = msg;
      this.initOrder();
    }); 
    this.subscription2 = this.refresh.formRefreshSource1$.subscribe((msg:any) => {
      this.zone.run(()=>{
        this.id = msg;
        this.DateNow = this.myDate.split('T')[0];
        this.DateCut = this.DateNow.split('-');
        this.month = this.DateCut[1];
        this.DateNow1 = this.myDate1.split('T')[0];
        this.DateCut1 = this.DateNow1.split('-');
        this.year = this.DateCut1[0];
        this.type = 'histories';
        this.initHistory(this.month,this.year);  
      }); 
    }); 
    this.subscription3 = this.refresh.formRefreshSource2$.subscribe((msg:any) => {
      this.zone.run(()=>{
        this.type = 'histories';
      })    
    });
    this.subscription4 = this.refresh.formRefreshSource3$.subscribe((msg:any) => {
     this.show_notify = true;
    });  
  }

  ionPageWillLeave() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
  
  initOrder(){
  	this.DateNow = this.myDate.split('T')[0];
  	this.DateCut = this.DateNow.split('-');
  	this.month = this.DateCut[1];
    this.DateNow1 = this.myDate1.split('T')[0];
    this.DateCut1 = this.DateNow1.split('-');
  	this.year = this.DateCut1[0];
  	this.getTracking();
  };

  getTracking(){
    this.storage.get('idRPSV24').then(items => {
      if (items != '' && items != null) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2 != '' && items2 != null) {
            this.orderService.getTracking(items,items2).subscribe(
              data => {
              this.datos = data;
              this.orders = this.datos.pedido;
              for (var i = 0; i < this.orders.length; ++i) {
                this.orders[i].tiempo = moment(this.orders[i].tiempo).format('DD/MM/YYYY');
              }
              this.orders = this.sortByKey(this.orders,'id');
              this.initHistory(this.month,this.year);      
              },
              msg => {
                this.initHistory(this.month,this.year);
                if(msg.status == 400 || msg.status == 401){ 
                    this.storage.set('TRPSV24',''); 
                    this.navCtrl.navigateForward('login');
                } else if (msg.status == 404){
                  this.orders = [];
                }      
              }
            );
          }
        });
      } else {
        this.orders = [];
        this.initHistory(this.month,this.year);
      }
    });
  }

  stopGeo(){
    this.locationTracker.stopT();
  }

  initHistory(month,year){
  	this.storage.getObject('userRPSV24').then(items => {
  		if (items) {
  			this.storage.get('TRPSV24').then(items2 => {
    			if (items2) {
    				this.orderService.getHistory(items.repartidor.id,month,year,items2).subscribe(
  		      data => {
              this.datos = data;
              this.history = this.datos.pedidos;
              for (var i = 0; i < this.history.length; ++i) {
                this.history[i].tiempo = moment(this.history[i].tiempo).format('DD/MM/YYYY');
                if (this.history[i].calificacion) {
                  let index1 = this.history[i].calificacion.findIndex((item1) => item1.usuario_id === items.id);
                  if(index1 !== -1){
                    this.history[i].califico = true;
                    this.history[i].puntaje = this.history[i].calificacion[index1].puntaje;
                  } else {
                    this.history[i].califico = false;
                    if (this.history[i].id == this.id) {
                      this.data = this.history[i];
                      this.presentModal();
                    }
                  }
                }
              }
              this.history = this.sortByKey(this.history,'id');
  			    },
  			    msg => {
              console.log(msg)
  			      if(msg.status == 400 || msg.status == 401){
                this.storage.set('TRPSV24',''); 
  			        this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
  			        this.navCtrl.navigateRoot('login');
  			      } else if (msg.status == 404) {
  			      	this.history = [];
  			      }
  			    });
    			}
  	    });
  		}
    });	
  }

  setDateP1(event){
  	this.DateNow = event.detail.value.split('T')[0];
  	this.DateCut = this.DateNow.split('-');
  	this.month = this.DateCut[1];
    this.presentLoading();
    this.storage.getObject('userRPSV24').then(items => {
		if (items) {
			this.storage.get('TRPSV24').then(items2 => {
	  			if (items2) {
	  				this.orderService.getHistory(items.repartidor.id,this.month,this.year,items2).subscribe(
			        data => {
				      this.loading.dismiss();
              this.datos = data;
              this.history = this.datos.pedidos;
              for (var i = 0; i < this.history.length; ++i) {
                this.history[i].tiempo = moment(this.history[i].tiempo).format('DD/MM/YYYY');
                if (this.history[i].calificacion) {
                  let index1 = this.history[i].calificacion.findIndex((item1) => item1.usuario_id === items.id);
                  if(index1 !== -1){
                    this.history[i].califico = true;
                    this.history[i].puntaje = this.history[i].calificacion[index1].puntaje;
                  } else {
                    this.history[i].califico = false;
                  }
                }
              }
              this.history = this.sortByKey(this.history,'id')
				    },
				    msg => {
				      this.loading.dismiss();
				      if(msg.status == 400 || msg.status == 401){ 
				        this.storage.set('TRPSV24','');
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
				        this.navCtrl.navigateRoot('login');
				      } else if (msg.status == 404) {
                this.presentToast(msg.error.error);
				      	this.history = [];
				      }
				    });
	  			}
		    });
		}
    });	
  }

  setDateP2(event){
    this.DateNow1 = event.detail.value.split('T')[0];
    this.DateCut1 = this.DateNow1.split('-');
    this.year = this.DateCut1[0];
    this.presentLoading();
    this.storage.getObject('userRPSV24').then(items => {
    if (items) {
      this.storage.get('TRPSV24').then(items2 => {
          if (items2) {
            this.orderService.getHistory(items.repartidor.id,this.month,this.year,items2).subscribe(
              data => {
              this.loading.dismiss();
              this.datos = data;
              this.history = this.datos.pedidos;
              for (var i = 0; i < this.history.length; ++i) {
                this.history[i].tiempo = moment(this.history[i].tiempo).format('DD/MM/YYYY');
                if (this.history[i].calificacion) {
                  let index1 = this.history[i].calificacion.findIndex((item1) => item1.usuario_id === items.id);
                  if(index1 !== -1){
                    this.history[i].califico = true;
                    this.history[i].puntaje = this.history[i].calificacion[index1].puntaje;
                  } else {
                    this.history[i].califico = false;
                  }
                }
              }
              this.history = this.sortByKey(this.history,'id')
            },
            msg => {
              this.loading.dismiss();
              if(msg.status == 400 || msg.status == 401){ 
                this.storage.set('TRPSV24','');
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                this.navCtrl.navigateRoot('login');
              } else if (msg.status == 404) {
                this.presentToast(msg.error.error);
                this.history = [];
              }
            });
          }
        });
    }
    });  
  };

  doRefresh(event) {
    this.getTracking();
    setTimeout(()=> {
      event.target.complete();
    },300);
  }

  viewDetails(item){
    this.objService.setExtras(item);
    this.navCtrl.navigateForward('detail-tracking');
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 4000,
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

  async viewNotification() {
    const modal = await this.modalController.create({
      component: NotificationsComponent
    });
    modal.onDidDismiss().then((close)=> { 
      this.show_notify = false;   
    });
    return await modal.present();  
  }

  async presentModal() {
    if (this.band == 0) {
      this.id = null;
      this.band = 1;
      const modal = await this.modalController.create({
        component: CalificationPage,
        componentProps: { value: this.data },
        cssClass: 'calification-modal-css'
      });
      modal.onDidDismiss().then((close)=> {
        if (close.data == 2) {
          this.subscription2.unsubscribe();
          this.id = null;
          this.initHistory(this.month,this.year); 
        }     
      });
      return await modal.present();
    }   
  }

  public sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 0 : 1));
    });
  }
}
