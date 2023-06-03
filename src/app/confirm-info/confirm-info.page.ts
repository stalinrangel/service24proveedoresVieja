import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { ZonesRegisterPage } from '../zones-register/zones-register.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { VerifyNumberPage } from '../verify-number/verify-number.page';
import { RefreshService } from '../../services/refresh/refresh.service';

@Component({
  selector: 'app-confirm-info',
  templateUrl: './confirm-info.page.html',
  styleUrls: ['./confirm-info.page.scss'],
})
export class ConfirmInfoPage implements OnInit {
  
  public registerUserForm: FormGroup;
  public user = {
    nombre: '',
    email: '',
    imagen: 'assets/profile-general.png',
    tipo_registro: '',
    id_facebook: '',
    id_twitter: '',
    id_instagram: '',
    token_notificacion: ''
  };
  public loading;
  formErrors = {
    'nombre': '',
    'telefono': '',
    'email': '',
    'zona': '',
    'code': ''
  }; 

  public codes:any[] = [
    {pais: 1, codigo: '+598', value:'598'},
    {pais: 2, codigo: '+507', value:'507'},
    {pais: 3, codigo: '+58', value:'58'},
    {pais: 4, codigo: '+54', value:'54'}
  ]

  constructor(
  	public navCtrl: NavController, 
  	private auth: AuthService, 
  	private alertController: AlertController, 
  	private loadingController: LoadingController, 
  	private builder: FormBuilder, 
  	private toastController: ToastController, 
  	public storage: StorageService,
  	private objService: ObjectserviceService,
    public refresh: RefreshService,
    public modalController: ModalController,
    private oneSignal: OneSignal
  	) {	
  	this.user = this.objService.getExtras(); 
  }

  ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.registerUserForm = this.builder.group({
		  nombre: [this.user.nombre, [Validators.required]],
		  telefono: ['', [Validators.required]],
      code: ['', [Validators.required]],
		  email: [this.user.email, [Validators.required]],
		  imagen: [this.user.imagen],
      direccion: ['sin direccion'],
      direccion_exacta: ['sin direccion'],
      lat: [''],
      lng: [''],
      estado: ['OFF'],
      ciudad: ['', [Validators.required]],
		  id_facebook: [this.user.id_facebook],
		  id_twitter: [this.user.id_twitter],
		  id_instagram: [this.user.id_instagram],
		  token_notificacion: [this.user.token_notificacion],
      lunes_i: ['00'],
      lunes_f: ['00'],
      martes_i: ['00'],
      martes_f: ['00'],
      miercoles_i: ['00'],
      miercoles_f: ['00'],
      jueves_i: ['00'],
      jueves_f: ['00'],
      viernes_i: ['00'],
      viernes_f: ['00'],
      sabado_i: ['00'],
      sabado_f: ['00'],
      domingo_i: ['00'],
      domingo_f: ['00'],
      tipo_registro: [this.user.tipo_registro],
      zona: ['', [Validators.required]],
      zona_id: ['', [Validators.required]],
      pais_id: ['', [Validators.required]],
      intentos: [0],
      confirmado: ['no']
		});
		this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
	}
 
  async selectZone() {
    const modal = await this.modalController.create({
      component: ZonesRegisterPage
    });
    modal.onDidDismiss().then((close)=> {
      if (close.data) {
        this.registerUserForm.patchValue({pais_id: close.data.pais_id});
        this.registerUserForm.patchValue({ciudad: close.data.ciudad_id});
        this.registerUserForm.patchValue({zona: close.data.nombre});
        this.registerUserForm.patchValue({zona_id: close.data.id});
        for (var i = 0; i < this.codes.length; ++i) {
          if (this.codes[i].pais == close.data.pais_id) {
            this.registerUserForm.patchValue({code: this.codes[i].value});
          }
        }
        if (close.data.pais_id == '2') {
          this.registerUserForm.get('telefono').setValidators([Validators.maxLength(8)]);
          this.registerUserForm.get('telefono').updateValueAndValidity();
        } else {
          this.registerUserForm.get('telefono').clearValidators();
          this.registerUserForm.get('telefono').updateValueAndValidity();
        }
      }
    });
    return await modal.present();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async register() {
    let number = this.registerUserForm.value.code + this.registerUserForm.value.telefono;
    const modal = await this.modalController.create({
      component: VerifyNumberPage,
      componentProps: { value: number },
      cssClass: 'calification-modal-css'
    });
    modal.onDidDismiss().then((close)=> {
      if (close.data == 1) {
        this.registerUserForm.patchValue({confirmado: 'si'});
        this.saveR();
      } else if(close.data == 2){
        this.registerUserForm.patchValue({confirmado: 'no'});
        this.saveR();
      }
    });
    return await modal.present();
  }

  verifyNumber(){
    if (this.registerUserForm.valid) {
      if (this.registerUserForm.value.zona_id != 1000 && this.registerUserForm.value.zona_id != '') {          
          if (this.registerUserForm.value.ciudad != '') {
            this.register();
          } else {
            this.presentToast('Debes seleccionar una ciudad')
          }
        } else {
          this.presentToast('Debes estar en una zona válida')
        }   
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.presentToast('¡Faltan datos para finalizar el registro!');
    }
  } 

  saveR(){
    this.storage.get('INTENTSV24PR0V').then(items => {
      if (items != '' && items != null) {
        this.registerUserForm.patchValue({intentos: items});
        this.oneSignal.getIds().then((ids) => {
          if (ids.userId != null && ids.userId != '') {
            this.storage.set('notify_RPSV24',ids.userId);
            this.registerUserForm.patchValue({token_notificacion: ids.userId});
            this.presentLoading();
            this.registerUserForm.value.telefono = this.registerUserForm.value.code + this.registerUserForm.value.telefono;
            this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
            this.registerUserForm.value.nombre = this.capitalizeFirstLetter(this.registerUserForm.value.nombre); 
            this.auth.registerSocial(this.registerUserForm.value).subscribe(
              success => {
                if (success) {
                  this.login();
                } else {
                  this.loading.dismiss();
                  this.presentToast("Ha ocurrido un error al crear la cuenta.");
                }
              },
              error => {
                this.loading.dismiss();
                this.presentToast(error.error);
              }
            );
          }
        }); 
      } else {
        this.oneSignal.getIds().then((ids) => {
          if (ids.userId != null && ids.userId != '') {
            this.storage.set('notify_RPSV24',ids.userId);
            this.registerUserForm.patchValue({token_notificacion: ids.userId});
            this.presentLoading();
            this.registerUserForm.value.telefono = this.registerUserForm.value.code + this.registerUserForm.value.telefono;
            this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
            this.registerUserForm.value.nombre = this.capitalizeFirstLetter(this.registerUserForm.value.nombre); 
            this.auth.registerSocial(this.registerUserForm.value).subscribe(
              success => {
                if (success) {
                  this.login();
                } else {
                  this.loading.dismiss();
                  this.presentToast("Ha ocurrido un error al crear la cuenta.");
                }
              },
              error => {
                this.loading.dismiss();
                this.presentToast(error.error);
              }
            );
          }
        }); 
      }
    });
  } 

  login(){
    this.auth.login(this.registerUserForm.value).subscribe(allowed => {
      if (allowed) {
        this.loading.dismiss();
        this.presentAlert();
      } else {
        this.loading.dismiss();
        this.presentToast("Accesso Denegado.");
      }
    },
    error => {
    });
  }

  onValueChanged(data?: any) {
    if (!this.registerUserForm) { return; }
    const form = this.registerUserForm;
    for (const field in this.formErrors) { 
      const control = form.get(field);
      this.formErrors[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += true;
          console.log(key);
        }
      } 
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 15000,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Bienvenido a Service 24!',
      message: 'Usuario registrado con éxito.',
      buttons: [
     {
          text: 'OK',
          handler: () => {
            this.storage.remove('INTENTSV24PR0V');
            this.storage.remove('timmerVerSV24PROV');
            this.storage.remove('CODEVERSV24PR0V');
            this.refresh.publishFormRefresh1('userSV');           
            this.navCtrl.navigateRoot('/tabs/tab1');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      cssClass: 'toast-scheme'
    });
    toast.present();
  }
}
