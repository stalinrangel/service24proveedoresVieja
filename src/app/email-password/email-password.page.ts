import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.page.html',
  styleUrls: ['./email-password.page.scss'],
})
export class EmailPasswordPage implements OnInit {
  
	public registerUserForm: FormGroup;
	public datos: any;
	public loading;
	formErrors = {
		'email': ''
	};

	constructor(
	    public navCtrl: NavController,  
	    private alertController: AlertController, 
	    private loadingController: LoadingController, 
	    private builder: FormBuilder, 
	    private toastController: ToastController, 
	    public auth: AuthService, 
	    private objService: ObjectserviceService
	) {	  
	}

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.registerUserForm = this.builder.group({
		  email: ['', [Validators.required, Validators.email]]
		});
		this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
	}

	sendPassword(){
		if (this.registerUserForm.valid) {
	    	this.presentLoading();
	    	this.auth.sendCode(this.registerUserForm.value.email).subscribe(allowed => {
	          	this.loading.dismiss(); 				
	            this.presentToast('Código de verificación enviado con éxito al correo electrónico.');
				this.navCtrl.navigateForward('codepassword');
	        },
	        error => {
	        	console.log(error);
	          this.loading.dismiss();
	          this.presentToast(error.error);
	        });
	    } else {
	      this.validateAllFormFields(this.registerUserForm);
	    }
	}

	codepage(){
		this.navCtrl.navigateForward('codepassword');
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

	goBack(){
    	this.navCtrl.pop();
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
}
