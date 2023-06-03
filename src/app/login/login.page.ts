import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController, Platform, ModalController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { TutorialPage } from '../tutorial/tutorial.page';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: any = {};
  private apiResponse;
  public datos;
  public response;
  public loading;
  public loginUserForm: FormGroup;
  public apiuser = {
    nombre: '',
    email: null,
    imagen: 'https://service24.app/alinstanteAPI/public/images_uploads/app/profile_general.png',
    telefono: '',
    id_facebook: null,
    id_twitter: null,
    id_instagram: null,
    tipo_registro: 0,
    token_notificacion: null
  };
  public subscription: any;
  public btnApple: boolean = false;

  constructor(
    public nav: NavController, 
    private loadingController: LoadingController,  
    private builder: FormBuilder, 
    public alertController: AlertController, 
    public storage: StorageService,
    public auth: AuthService, 
    private oneSignal: OneSignal,
    private toastController: ToastController,
    private objService: ObjectserviceService,
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    private platform: Platform,
    public modalController: ModalController,
    private signInWithApple: SignInWithApple
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.storage.get('TUTORIALPV').then(val => {
      if (val == null || val == 'undefined') {
        this.openTutorialPopover();
      }
    });
    if (this.platform.is('ios')) {
      this.btnApple = true;
    }
  }

  ionViewDidEnter(){
      this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
      });
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

  initForm() {
    this.loginUserForm = this.builder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      token_notificacion: ['']
    });
  }

  //LOGIN
  login(){
    if (this.loginUserForm.valid) {
      this.presentLoading();
      //this.oneSignal.getIds().then((ids) => {
        //if (ids.userId != null && ids.userId != '') {
          //this.storage.set('notify_RPSV24',ids.userId);
          //this.loginUserForm.patchValue({token_notificacion: ids.userId});
          this.auth.login(this.loginUserForm.value).subscribe(allowed => {
            if (allowed) {
              this.loading.dismiss();       
              this.nav.navigateRoot('/tabs/tab1');
            } else {
              this.loading.dismiss();
              this.presentToast("Accesso Denegado.");
            }
          },
          error => {
            this.loading.dismiss();
            this.presentToast(error.error);
          });
       // };
      //});
    } else {
      this.presentToast("Por favor, verifica los datos.");
    }
  }

  //LOGIN Apple
  loginApple(){
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      this.presentLoading();
      this.user = res;
      if (this.user.fullName.givenName != null && this.user.fullName.familyName != null) {
        this.apiuser.nombre = this.user.fullName.givenName + ' ' + this.user.fullName.familyName;
      }
      if (this.user.email != null || this.user.email != '') {
        this.apiuser.email = this.user.email;
      }
      if (this.user.user != null || this.user.user != '') {
        this.apiuser.id_twitter = this.user.user;
      }
      this.apiuser.tipo_registro = 4;
      this.oneSignal.getIds().then((ids) => {
        this.storage.set('notify_RPSV24',ids.userId);
        this.apiuser.token_notificacion = ids.userId;
        this.auth.loginSocial(this.apiuser).subscribe(allowed => {
          if (allowed) {
            this.loading.dismiss();
            this.nav.navigateRoot('/tabs/tab1');
          } else {
            this.loading.dismiss();
            this.presentToast("Accesso Denegado.");
          }
        },
        error => {
          this.loading.dismiss();
          this.apiuser.token_notificacion = ids.userId;
          this.objService.setExtras(this.apiuser);
          this.nav.navigateForward('confirm-info');
        });
      });
      console.log(res);
    })
    .catch((error: AppleSignInErrorResponse) => {
      this.presentToast('Versión de IOS no soportada para inicio de sesión con Apple')
      console.error(error);
    });
  }

  // LOGIN FACEBOOK
  loginFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      this.presentLoading();
      if(rta.status == 'connected'){
        this.getInfoFacebook();
      };
    })
    .catch(error =>{
      this.presentToast('Ha ocurrido un error al iniciar sesión con Facebook.')
    });
  }

  getInfoFacebook(){
    this.facebook.api('/me?fields=id,name,email,picture.type(large)',['public_profile','email'])
    .then(data=>{     
      this.user = data;
      if (this.user.name != null || this.user.name != '') {
        this.apiuser.nombre = this.user.name;
      }
      if (this.user.email != null || this.user.email != '') {
        this.apiuser.email = this.user.email;
      }
      if (this.user.picture != null || this.user.picture != '') {
        this.apiuser.imagen = this.user.picture.data.url;
      }
      if (this.user.id != null || this.user.id != '') {
        this.apiuser.id_facebook = this.user.id;
      }
      this.apiuser.tipo_registro = 2;
      this.oneSignal.getIds().then((ids) => {
        this.storage.set('notify_RPSV24',ids.userId);
        this.apiuser.token_notificacion = ids.userId;
        this.auth.loginSocial(this.apiuser).subscribe(allowed => {
          if (allowed) {
            this.loading.dismiss();
            this.nav.navigateRoot('/tabs/tab1');
          } else {
            this.loading.dismiss();
            this.presentToast("Accesso Denegado.");
          }
        },
        error => {
          this.loading.dismiss();
          this.apiuser.token_notificacion = ids.userId;
          this.objService.setExtras(this.apiuser);
          this.nav.navigateForward('confirm-info');
        });
      });
    })
    .catch(error =>{
      this.loading.dismiss();
      this.presentToast('Ha ocurrido un error al iniciar sesión con Facebook.')
    });
  }

  async doGoogleLogin(){
    this.presentLoading();
    this.googlePlus.login({
      'scopes': 'https://www.googleapis.com/auth/plus.login',
      'webClientId': '883867864317-9r3nt71r2lfi9psrga51oo74at67t3gk.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': false // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
    .then(user =>{
      this.user = user;
      if (this.user.displayName != null || this.user.displayName != '') {
        this.apiuser.nombre = this.user.displayName;
      }
      if (this.user.email != null || this.user.email != '') {
        this.apiuser.email = this.user.email;
      }
      if (this.user.imageUrl != null || this.user.imageUrl != '') {
        this.apiuser.imagen = this.user.imageUrl;
      }
      if (this.user.userId != null || this.user.userId != '') {
        this.apiuser.id_twitter = this.user.userId;
      }
      this.apiuser.tipo_registro = 3;
      this.oneSignal.getIds().then((ids) => {
        this.storage.set('notify_RPSV24',ids.userId);
        this.apiuser.token_notificacion = ids.userId;
        this.auth.loginSocial(this.apiuser).subscribe(allowed => {
          if (allowed) {
            this.loading.dismiss();
            this.nav.navigateRoot('/tabs/tab1');
          } else {
            this.loading.dismiss();
            this.presentToast("Accesso Denegado.");
          }
        },
        error => {
          this.loading.dismiss();
          this.apiuser.token_notificacion = ids.userId;
          this.objService.setExtras(this.apiuser);
          this.nav.navigateForward('confirm-info');
        });
      });
    }, err =>{
      this.loading.dismiss();
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 25000,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      cssClass: 'toast-scheme'
    });
    toast.present();
  }

  register(){
  	this.nav.navigateForward('register');
  }

  resetPassword(){
    this.nav.navigateForward('email-password');
  }

  goBack(){
    this.nav.pop();
  }

  async openTutorialPopover() {
    const modal = await this.modalController.create({
      component: TutorialPage,
      backdropDismiss: false,
      cssClass: 'tutorial-modal-css'
    });
    return await modal.present();
  }
}
