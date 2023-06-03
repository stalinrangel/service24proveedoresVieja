import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { UserService } from '../../services/user/user.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { OrdersService } from '../../services/orders/orders.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { RefreshService } from '../../services/refresh/refresh.service';
import { Subscription } from 'rxjs';
import { LocationTrackerService } from '../../services/location-tracker/location-tracker.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

	public usuario = {
		id: '',
		nombre: 'Usuario',
		imagen:'assets/profile-general.png',
		promedio_calificacion: 0,
		repartidor: {
			activo: 1
		},
		direccion: ''
	};
	public promedio_calificacion: number = 0;
	public datos: any;
	public datos1: any;
	public datos2: any;
	public datos3: any;
	public datos4: any;
	public band_chatSupport: boolean = false;
	public chat_support = {
		admin_id: '',
		chat_id: '',
		token_notificacion: '',
		ciudad_id: ''
	};
	public encurso: number = 0;
	public finalizado: number = 0;
	public direccion: string = '';
	public email: string = '';
	public telefono: string = '';
	public itemsInCart: number;
	public type: string = "track";
	public calificaciones: any;
	public status: number = 0;
	public services: any = [];
	public info: string = 'Debes iniciar sesión para comunicarte con nuestro soporte.';
	public show_notify: boolean = false;
	private subscription1: Subscription;
	private subscription2: Subscription;
	private subscription3: Subscription;

	constructor(
		public navCtrl: NavController, 
		private alertController: AlertController,  
		private storage: StorageService, 
		public userService: UserService, 
		private facebook: Facebook,
		private toastCtrl: ToastController,
		public refresh: RefreshService,
		private objService: ObjectserviceService,
		public orderService: OrdersService,
		public cdr: ChangeDetectorRef,
		public modalController: ModalController,
		public locationTracker: LocationTrackerService,
	) {
		this.getContact();
		//this.initStatus();
	}

	ionViewWillLeave() {
		this.subscription1.unsubscribe();
		this.subscription2.unsubscribe();
		this.subscription3.unsubscribe();
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
	    this.subscription1 = this.refresh.formRefreshSource2$.subscribe((msg:any) => {
			this.initStatus();
			this.cdr.detectChanges();
		})
		this.subscription2 = this.refresh.formRefreshSource1$.subscribe((msg:any) => {
			this.initStatus();
			this.cdr.detectChanges();
		})
		this.subscription3 = this.refresh.formRefreshSource3$.subscribe((msg:any) => {
	    	this.show_notify = true;
	    });
  	}

  	ionViewDidLoad(){
  	}

  	initStatus(){ 
      this.storage.getObject('userRPSV24').then(items => {
	      if (items) {
	      	console.log(items)
	      	this.usuario = items;
			this.promedio_calificacion = this.usuario.promedio_calificacion;
			if (items.registro != null) {
				if (items.registro.tipo == 2 && items.registro.logo) {
					this.usuario.imagen = items.registro.logo;
				}
			}
	        this.storage.get('TRPSV24').then(items2 => {
	          if (items2) {
	            this.userService.getId(this.usuario.id,items2,items.ciudad).subscribe(
		        data => {
		        	console.log(data)   
		        	this.datos = data;
			        this.chat_support.admin_id = this.datos.chat.admin_id;
			        this.chat_support.chat_id = this.datos.chat.id;
			        this.chat_support.token_notificacion = this.datos.admin[0].token_notificacion;
		          	this.chat_support.ciudad_id = this.datos.admin[0].ciudad;
			        this.band_chatSupport = true;    
			        this.promedio_calificacion = this.datos.promedio_calificacion;
			        this.calificaciones = this.datos.calificaciones;
			        this.calificaciones = this.sortByKey1(this.calificaciones,'created_at');
			        this.status = this.datos.activo;
			        if (this.datos.direccion) {
			 			this.usuario.direccion = this.datos.direccion;
			 		}
			        this.getServices();
		        },
		        msg => { 
		        console.log(msg)    
			      	if(msg.status == 404){ 
			 			if (msg.error.admin) {
			 				if (msg.error.admin.length > 0) {
			 					this.band_chatSupport = true;
			          			this.chat_support.admin_id = msg.error.admin[0].id;
			          			this.chat_support.token_notificacion = msg.error.admin[0].token_notificacion;
			          			this.chat_support.ciudad_id = msg.error.admin[0].ciudad;
				      		}
			 			}
			 			this.promedio_calificacion = msg.error.promedio_calificacion;
			 			this.calificaciones = msg.error.calificaciones; 
			 			this.calificaciones = this.sortByKey1(this.calificaciones,'created_at');
			 			this.status = msg.error.activo;
			 			if (msg.error.direccion) {
			 				this.usuario.direccion = msg.error.direccion;
			 			}
			 			this.getServices();
			        } else if(msg.status == 409){
			          	this.band_chatSupport = false;
			          	this.info = msg.error.Error;
			          	this.promedio_calificacion = msg.error.promedio_calificacion;
						this.calificaciones = msg.error.calificaciones; 
						this.calificaciones = this.sortByKey1(this.calificaciones,'created_at');
						this.status = msg.error.activo;
						if (msg.error.direccion) {
							this.usuario.direccion = msg.error.direccion;
						}
			          	this.getServices();
			        }
			        if(msg.status == 400 || msg.status == 401){ 
			        	this.storage.set('TRPSV24','');
			        	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
		                this.navCtrl.navigateForward('login');
		            }  
			    }
		    	);
	          }
	        });
	      }
	    });  
	}

  	getContact(){
  		this.storage.getObject('userRPSV24').then(items => {
			if (items) {
				this.userService.getContact(items.pais_id).subscribe(
			        data => {
			          this.datos4 = data;
				        this.direccion = this.datos4.contacto.direccion;
				        this.email = this.datos4.contacto.correo;
				        this.telefono = this.datos4.contacto.telefono;       
			        },
			        msg => {       
			        	console.log(msg);       
			        }
			    );
			}
	    });	
	};

	getServices(){
	  	this.storage.getObject('userRPSV24').then(items => {
			if (items) {
				this.storage.get('TRPSV24').then(items2 => {
		  			if (items2) {
		  				let id = items.establecimiento.id;
		  				this.orderService.getServices(id,items2).subscribe(
				        data => {
				          this.services = [];
					      this.datos = data;
					      this.services = this.datos.productos;
					      this.services = this.sortByKey(this.services,'nombre');
					    },
					    msg => {
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

	salir(){
		this.facebook.getLoginStatus()
		.then(rta => {
		  if(rta.status == 'connected'){
		  	this.facebook.logout()
		    .then(rta => {
		      this.logout();
		    })
		    .catch(error =>{
		      this.logout();
		    });
		  } else {
		  	this.logout();
		  }
		})
		.catch(error =>{
		  	this.logout();
		});
		this.band_chatSupport = false;	
	}

	logout(){
		this.storage.getObject('userRPSV24').then(items => {
			if (items) {
				this.storage.get('TRPSV24').then(items2 => {
		  			if (items2) {
		  				let id = items.id;
		  				this.userService.logout(id,items2).subscribe(
				        data => {
				          this.storage.set('TRPSV24','');
					      this.storage.setObject('userRPSV24', '');
					      this.storage.set('idRPSV24', '');
					      this.storage.set('notify_RPSV24','');
					      this.usuario.id = '';
					      this.usuario.imagen = 'assets/profile-general.png';
					      this.usuario.nombre = 'Usuario';
					      this.promedio_calificacion = 0;
					      this.storage.remove('formLocalRSV24');
					      this.locationTracker.stopT();
					      this.navCtrl.navigateRoot('login');
					    },
					    msg => {
					      if(msg.status == 400 || msg.status == 401){ 
					      	  this.storage.set('TRPSV24','');
						      this.storage.setObject('userRPSV24', '');
						      this.storage.set('idRPSV24', '');
						      this.storage.set('notify_RPSV24','');
						      this.usuario.id = '';
						      this.usuario.imagen = 'assets/profile-general.png';
						      this.usuario.nombre = 'Usuario';
						      this.promedio_calificacion = 0;
						      this.storage.remove('formLocalRSV24');
						      this.locationTracker.stopT();
						      this.navCtrl.navigateRoot('login');
					      }
					    });
		  			}
			    });
			}
	    });	
	}

	editProfile(){
		this.navCtrl.navigateForward('edit-profile');
	}

	async presentConfirm() {
	    const alert = await this.alertController.create({
		message: '¿Desea cerrar sesión de Service 24 Proveedores?',
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
	          	this.salir();
	          }
	        }
	      ]
		});
		await alert.present();
	}

	async presentAlert() {
	  let alert =  await this.alertController.create({
	    header: 'Contacto',
	    cssClass: 'mail-contact',
	    message: `
        <p>`+this.direccion+`</p>
        <a class="mail-contact" href="mailto:`+this.email+`?subject=Contacto" "contacto">`+this.email+`</a>
        <p class="mail-contact">`+this.telefono+`</p>
      `,
	    buttons: ['Ok']
	  });
	  await alert.present();
	}

	async presentToast(text) {
		const toast = await this.toastCtrl.create({
		  message: text,
		  duration: 2000,
		  cssClass: 'toast-scheme'
		});
		toast.present();
	}

	support(){
		if (this.band_chatSupport) {	
			this.objService.setExtras(this.chat_support);
			this.navCtrl.navigateForward('chat-support');
		} else {
			this.presentToast(this.info);
		}
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

	listService(){
		this.navCtrl.navigateForward('list-services');
	}

	blog(){
		//this.navCtrl.push(ListBlogPage);
	}

	policy(){
		this.navCtrl.navigateForward('privacy-policy');
	}

	terms(){
		this.navCtrl.navigateForward('terms-conditions');
	}

	completeRegister(){
    	this.navCtrl.navigateForward('complete-register');
  	}

  	contrat(){
  		this.navCtrl.navigateForward('view-contrat');
  	}

  	payment(){
  		this.navCtrl.navigateForward('payments');
  	}

  	public sortByKey(array, key) {
	    return array.sort(function (a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
	    });
	}

	public sortByKey1(array, key) {
	    return array.sort(function (a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x > y) ? -1 : ((x < y) ? 0 : 1));
	    });
	}
}
