import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from "@angular/core";
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { timer, Subscription } from "rxjs";
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.page.html',
  styleUrls: ['./verify-number.page.scss'],
})
export class VerifyNumberPage implements OnInit {

	public close: number = 0;
  public number: string = '';
  public loading: any;
  public data: any;
  public code: string = '';
  public codeInp: string = '';
  public registerUserForm: FormGroup;
  formErrors = {
    'code': ''
  };
  public step: number = 1;
  public number_count: number = 0;
  countDown: Subscription;
  counter = 120;
  tick = 1000;
  intent = 0;
  dataC = {
    codigo: ''
  }

  constructor(
  	private modalCtrl:ModalController,
    private auth: AuthService, 
    private builder: FormBuilder, 
    private loadingController: LoadingController, 
    private toastController: ToastController, 
    private navP: NavParams,
    private objService: ObjectserviceService,
    public storage: StorageService,
  ) { 
    this.number = this.navP.get('value');   
  }

  ngOnInit() {
    this.registerUserForm = this.builder.group({
      code: ['', [Validators.required]],
    });
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.storage.get('timmerVerSV24PROV').then(items => {
      if (items != '' && items != null) {
        this.step = 2;
        this.counter = items;
        this.countDown = timer(0, this.tick).subscribe(() => {
          if (this.counter > 0) {
            --this.counter;
          } else {
            this.storage.set('timmerVerSV24PROV', '');
            this.countDown.unsubscribe();
          }
        });
      }
    });
    this.storage.get('CODEVERSV24PR0V').then(items => {
      if (items != '' && items != null) {
        this.step = 2;
        this.code = items;
        this.dataC.codigo = items;
      }
    });
    this.storage.get('INTENTSV24PR0V').then(items => {
      if (items != '' && items != null) {
        this.intent = items;
      }
    });
  }

  sendR(){
    if (this.number) {
      this.step = 2;
      this.countDown = timer(0, this.tick).subscribe(() => {
        if (this.counter > 0) {
          --this.counter;
        } else {
          this.storage.set('timmerVerSV24PROV', '');
          this.countDown.unsubscribe();
        }
      });
      this.auth.verifySms(this.number, this.data).subscribe(
        success => {
          this.data = success;
          this.code = this.data.codigo;
          this.dataC.codigo = this.data.codigo;
          this.storage.set('CODEVERSV24PR0V', this.code);
          this.intent = this.intent + 1;
          this.storage.set('INTENTSV24PR0V', this.intent);
        },
        error => {
          this.presentToast(error.error);
          this.intent = this.intent + 1;
          this.storage.set('INTENTSV24PR0V', this.intent);
        }
      );
    } else {
      this.presentToast('Debe ingresar un número de teléfono');
      this.closeModal(20);
    }
  }

   send1R(){
    if (this.intent > 1) {
      this.presentToast('Ha superado el intento de verificación, registrando usuario');
      this.closeModal(2);
    } else {
      if (this.number) {
        this.counter = 120;
        this.step = 2;
        this.countDown = timer(0, this.tick).subscribe(() => {
          if (this.counter > 0) {
            --this.counter;
          } else {
            this.storage.set('timmerVerSV24PROV', '');
            this.countDown.unsubscribe();
          }
        });
        this.auth.verifySms(this.number, this.data).subscribe(
          success => {
            this.data = success;
            this.code = this.data.codigo;
            this.dataC.codigo = this.data.codigo;
            this.intent = this.intent + 1;
            this.storage.set('INTENTSV24PR0V', this.intent);
          },
          error => {
            this.presentToast(error.error);
            this.intent = this.intent + 1;
            this.storage.set('INTENTSV24PR0V', this.intent);
          }
        );
      } else {
        this.presentToast('Debe ingresar un número de teléfono');
        this.closeModal(20);
      }
    }
  }

  saveR(){
    if (this.registerUserForm.valid) {
      if (this.registerUserForm.value.code === this.code) {
        this.closeModal(1);
      } else {
        this.presentToast('El código no coincide con el enviado por SMS')
      }
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.presentToast('Debe ingresar el código enviado a su número de teléfono');
    }
  }


  closeModal(id) {
    this.close = id;
    if (this.countDown) {
      this.countDown.unsubscribe();
    }
    if (this.counter < 120 && this.counter > 0) {
      this.storage.set('timmerVerSV24PROV', this.counter);
    }
    this.modalCtrl.dismiss(this.close);
  }

  closeModal1() {
    this.close = 20;
    if (this.countDown) {
      this.countDown.unsubscribe();
    }
    if (this.counter < 120 && this.counter > 0) {
      this.storage.set('timmerVerSV24PROV', this.counter);
    }
    this.modalCtrl.dismiss(this.close);
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


@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
