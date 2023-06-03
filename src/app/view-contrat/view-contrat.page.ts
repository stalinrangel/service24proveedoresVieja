import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform } from '@ionic/angular';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../services/storage/storage.service';
import { UserService } from '../../services/user/user.service';
import { SignaturePage } from '../signature/signature.page';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-view-contrat',
  templateUrl: './view-contrat.page.html',
  styleUrls: ['./view-contrat.page.scss'],
})
export class ViewContratPage implements OnInit {

	public data: any;
	public data2: any;
	public contrat_url: any = null;
	public firma: boolean = false;
	public planB: boolean = false;
	public contract1 = {
	    firma: ''
	  }
	  public contract = {
	    nombre: '',
	    ci: '',
	    telefono: '',
	    direccion: '',
	    firma: '',
	    plan: '',
	    usuario_id: ''
	  }
	  public data3: any;
	  public contract_url: any;
	  public plan: any;
	  public plans: any = [];
	  public signature: string = '';
  	  loading: any;
  	  public select_plan: any = '1';
      public estado = { 
			plan: '',
			token: null
		};


  constructor(
  	public navCtrl: NavController,
  	private objService: ObjectserviceService,
  	public sanitizer: DomSanitizer,
  	public storage: StorageService,
  	public userService: UserService,
  	public modalController: ModalController,
    public loadingCtrl: LoadingController,
  ) { 

  }

  ngOnInit() {
  	this.getContrat();
  	this.getPlans();
  }

  getContrat(){
  	this.storage.get('TRPSV24').then(items2 => {
      if (items2 != '' && items2 != null) {
        this.storage.getObject('userRPSV24').then(items3 => {
          if (items3) {
          	//console.log(items3)
            this.userService.getContrat(items3.id,items2).subscribe(
            data => {
              //console.log(data)
              this.data = data;
              if (this.data.Contratos.url != null && this.data.Contratos.url != '') {
              	this.contrat_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.Contratos.url);
              } else {
              	this.contrat_url = null;
              } 
              if (this.data.Contratos.firma == null || this.data.Contratos.firma == '') {
              	this.firma = true;
              }
              if (this.data.Contratos.plan == null || this.data.Contratos.plan == '') {
              	this.planB = true;
              } else {
              	this.plan = this.data.Contratos.plan;
              }       
            },
            msg => {
              if(msg.status == 400 || msg.status == 401){ 
                this.storage.set('TRPSV24','');
                this.navCtrl.navigateRoot('login');
              }
            });
          } 
        });
      }
    });
  }

  gotopage(){
  	this.navCtrl.navigateForward('finish-register');
  }

    async presentModal() {
    const modal = await this.modalController.create({
      component: SignaturePage
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== undefined) {
        this.signature = dataReturned.data;
      }
    });
    return await modal.present();
  }

  exportPdf(){
    this.presentLoading('Enviando Documento...');
    this.uploadImage();
  }


  public uploadImage() {
    this.editSignature();
  }

  editSignature(){
    this.storage.get('idRPSV24').then(items => {
      if (items != '' && items != null) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2 != '' && items2 != null) {
            this.contract1.firma = this.signature;
            this.userService.setUser(items,items2,this.contract1).subscribe(
              data => {
                this.storage.getObject('userRPSV24').then(items3 => {
                  if (items3) {
                  	if (items3.registro.tipo == '1') {
                      	this.contract.nombre = items3.nombre;
	                    this.contract.ci = items3.registro.cedula;
	                    this.contract.direccion = items3.registro.direccion;
	                    this.contract.telefono = items3.telefono;
	                    this.contract.usuario_id = items3.id;
	                    this.contract.plan = this.plan;
	                    this.contract.firma = null;
	                    this.userService.postContrat(items3.nombre,items3.registro.cedula,items3.registro.direccion,items3.telefono,items3.id,this.plan,items2,this.contract,items3.pais_id).subscribe(
	                    data => {
	                      this.loading.dismiss();
	                      this.firma = false;
	                      this.getContrat();
	                    },
	                    msg => {
	                      this.loading.dismiss();
	                      if(msg.status == 400 || msg.status == 401){ 
	                        this.storage.set('TRPSV24','');
	                        this.navCtrl.navigateRoot('login');
	                      }
	                    });
                    } else {
                      	this.contract.nombre = items3.registro.contacto_nombre;
	                    this.contract.ci = items3.registro.contacto_cedula;
	                    this.contract.direccion = items3.registro.direccion;
	                    this.contract.telefono = items3.telefono;
	                    this.contract.usuario_id = items3.id;
	                    this.contract.plan = this.plan;
	                    this.contract.firma = null;
	                    this.userService.postContrat(items3.registro.contacto_nombre,items3.registro.contacto_cedula,items3.registro.direccion,items3.telefono,items3.id,this.plan,items2,this.contract,items3.pais_id).subscribe(
	                    data => {
	                      this.loading.dismiss();
	                      this.firma = false;
	                      this.getContrat();
	                    },
	                    msg => {
	                      this.loading.dismiss();
	                      if(msg.status == 400 || msg.status == 401){ 
	                        this.storage.set('TRPSV24','');
	                        this.navCtrl.navigateRoot('login');
	                      }
	                    });
                    }
                  } 
                });
              },
              msg => {
                this.loading.dismiss();
                if(msg.status == 400 || msg.status == 401){ 
                  this.storage.set('TRPSV24','');
                  //this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                  this.navCtrl.navigateRoot('login');
                }
            });
          }
        });
      }
    });
  }

  	getPlans(){
		this.storage.getObject('userRPSV24').then(items1 => {
  			if (items1) {
  				this.storage.get('TRPSV24').then(items => {
		  			if (items) {
		  				this.userService.getPlans(items, items1.pais_id).subscribe(
					        data => {
					       		this.data2 = data;
					       		this.plans = this.data2.Planes;
					       		for (var i = 0; i < this.plans.length; ++i) {
					       			this.plans[i].descripcion = JSON.parse(this.plans[i].descripcion);
					       			this.plans[i].show = false; 
					       		}
					        },
					        msg => {  
					        	console.log(msg);
					        	//this.loading.dismiss();
					        	//this.presentToast(msg.error.error);
						    }
					    );
		  			}
			    });
  			}
	    });  
	}

	selectPlan(plan){
		this.select_plan = plan.id;
	}

	setPlan(){
		this.storage.get('idRPSV24').then(items => {
	      if (items) {
	        this.storage.get('TRPSV24').then(items2 => {
	            if (items2) {
	              for (var i = 0; i < this.plans.length; ++i) {
	              	if (this.plans[i].id == this.select_plan) {
	              		this.presentLoading('Seleccionando plan...');
	              		this.estado.plan = JSON.stringify(this.plans[i]);
	              		this.userService.setUser(items,items2,this.estado).subscribe(
			                data => {
			                	this.storage.getObject('userRPSV24').then(items3 => {
	      							if (items3) {
	      								if (items3.registro.tipo == '1') {
					                      	this.contract.nombre = items3.nombre;
						                    this.contract.ci = items3.registro.cedula;
						                    this.contract.direccion = items3.registro.direccion;
						                    this.contract.telefono = items3.telefono;
						                    this.contract.usuario_id = items3.id;
						                    this.contract.plan = this.plan;
						                    this.contract.firma = null;
							            	this.plan = this.estado.plan;
							            	//console.log(this.contract);
							              	this.userService.postContrat(items3.nombre,items3.registro.cedula,items3.registro.direccion,items3.telefono,items3.id,this.plan,items2,this.contract,items3.pais_id).subscribe(
								                data => {
								                	this.data3 = data;
								                	this.planB = false;
								                	this.firma = true;
									                this.loading.dismiss();
									                this.getContrat();
								              	},
								              	msg => {
								                	this.loading.dismiss();
									                if(msg.status == 400 || msg.status == 401){ 
									                  this.storage.set('TRPSV24','');
									                  this.navCtrl.navigateRoot('login');
									                }
								            });
					                    } else {
					                      	this.contract.nombre = items3.registro.contacto_nombre;
						                    this.contract.ci = items3.registro.contacto_cedula;
						                    this.contract.direccion = items3.registro.direccion;
						                    this.contract.telefono = items3.telefono;
						                    this.contract.usuario_id = items3.id;
						                    this.contract.plan = this.plan;
						                    this.contract.firma = null;
							            	this.plan = this.estado.plan;
							            	//console.log(this.contract);
							              	this.userService.postContrat(items3.registro.contacto_nombre,items3.registro.contacto_cedula,items3.registro.direccion,items3.telefono,items3.id,this.plan,items2,this.contract,items3.pais_id).subscribe(
								                data => {
								                	this.data3 = data;
								                	this.planB = false;
								                	this.firma = true;
									                this.loading.dismiss();
									                this.getContrat();
								              	},
								              	msg => {
								                	this.loading.dismiss();
									                if(msg.status == 400 || msg.status == 401){ 
									                  this.storage.set('TRPSV24','');
									                  this.navCtrl.navigateRoot('login');
									                }
								            });
					                    }
	      							}
	      						});
			            	},
			              msg => {
			                this.loading.dismiss();
			                if(msg.status == 400 || msg.status == 401){ 
			                  this.storage.set('TRPSV24','');
			                  //this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
			                  this.navCtrl.navigateRoot('login');
			                }
			            });
	              	}
	              }
	            }
	        });
	      }
	    });
	}

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      spinner: 'dots',
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

}
