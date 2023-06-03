import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
})
export class ContrasenaPage implements OnInit {

	password_type1: string = 'password';
  	password_type2: string = 'password';
  	public registerUserForm: FormGroup;
	public datos: any;
	public loading;
	public id: any;
	formErrors = {
		'password': '',
		'rpassword': ''
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
		this.id = this.objService.getExtras();
	}

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.registerUserForm = this.builder.group({
		  password: ['', [Validators.required]],
		  rpassword: ['', [Validators.required]],
		  token: ['']
		});
		this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
	}

	togglePasswordMode1() {   
	   this.password_type1 = this.password_type1 === 'text' ? 'password' : 'text';
	}

	togglePasswordMode2() {   
	   this.password_type2 = this.password_type2 === 'text' ? 'password' : 'text';
	}

	updatePassword(){
		if (this.registerUserForm.valid) {
	    	if (this.registerUserForm.value.password !== this.registerUserForm.value.rpassword) {
		      this.presentToast("Contraseñas no coinciden")
		    } else {
				this.presentLoading();
				this.registerUserForm.patchValue({token: this.id.token});
				this.auth.updatePassword(this.id.cliente_id,this.registerUserForm.value,this.id.token).subscribe(
		        data => {
			      	this.loading.dismiss();
	    			this.navCtrl.navigateRoot('login');
			    },
			    msg => {
		      		let err = msg.error;
    				this.loading.dismiss();
    				this.presentToast(err.error);
			    });
		    }
	    } else {
	      this.validateAllFormFields(this.registerUserForm);
	    }
	}

	goBack(){
    	this.navCtrl.pop();
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
