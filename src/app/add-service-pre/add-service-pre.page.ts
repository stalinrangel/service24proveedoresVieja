import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, ToastController, ActionSheetController, IonSlides, IonContent } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import { OrdersService } from '../../services/orders/orders.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';

declare var cordova: any;

@Component({
  selector: 'app-add-service-pre',
  templateUrl: './add-service-pre.page.html',
  styleUrls: ['./add-service-pre.page.scss'],
})
export class AddServicePrePage implements OnInit {

	@ViewChild(IonSlides) slides: IonSlides;
	@ViewChild(IonContent) content: IonContent;
	public registerServiceForm: FormGroup;
	public datos: any;
	public datosU: any;
	public datosE: any;
	public categories: any = [];
	public categoriesAux: any = [];
	public categories_principal: any = [];
	public subcategories: any = [];
	public loading;
	formErrors = {
	'nombre': '',
	'precio': '',
	'imagen': '',
	'descripcion': '',
	'subcategoria_id': '',
	'categoria_id': '',
	'categoriaP_id': '',
	'anos_experiencia': '',
	'idoneidad': '',
	'zona': ''
	};
	public lastImage: string = null;
	public image_user: string = 'assets/imagen-servicio.png';
	public image_uploads = {
		imagen: '',
		token: ''
	};

	customActionSheetOptions1: any = {
	    header: 'Seleccione una categoría'
	};

	customActionSheetOptions2: any = {
	    header: 'Seleccione una sub categoría'
	};
	public typeUser = '1';
	public years: any = [];
	public idRegister: any;

	slideOpts = {
	    initialSlide: 0
	};
	images_services: any = [];
	images_upload: any = [];

	public datos1: any;
	public datos2: any;
	public zones: any = [];
	public selecZones: any = [];
	public cities: any = [];

	constructor(
    public navCtrl: NavController,  
    private alertController: AlertController, 
    private loadingController: LoadingController, 
    private builder: FormBuilder, 
    private toastController: ToastController,
    public actionSheetController: ActionSheetController, 
    public storage: StorageService,
    public orderService: OrdersService,
    private camera: Camera,
	private filePath: FilePath,
	private file: File,
	private platform: Platform,
	private transfer: FileTransfer,
	private objService: ObjectserviceService,
	private zone: NgZone
  	) {
  		this.typeUser = this.objService.getExtras();
  		this.idRegister = this.objService.getCat();
  		for (var i = 1; i < 51; ++i) {
			this.years.push(i);
		}	  
	}

	ngOnInit() {
		this.initForm();
		this.getSubcategories(); 
	}

	initForm() {
		this.registerServiceForm = this.builder.group({
		  nombre: ['', [Validators.required]],
		  precio: ['0'],
		  imagen: ['https://service24.app/alinstanteAPI/public/images_uploads/app/imagen-proveedor.png'],
		  estado: ['OFF'],
	      descripcion: ['', [Validators.required]],
	      subcategoria_id: ['', [Validators.required]],
	      categoria_id: ['', [Validators.required]],
	      categoriaP_id: ['', [Validators.required]],
	      establecimiento_id: [''],
	      anos_experiencia: [''],
	      idoneidad: ['Si'],
	      fotos: [''],
	      ciudad: [''],
	      zona: [''],
	      zona_id: ['']
		});
		this.registerServiceForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
		this.registerServiceForm.controls['categoria_id'].valueChanges.subscribe(
	      (selectedValue) => {
	        for (var i = 0; i < this.categoriesAux.length; ++i) {
	        	if (this.categoriesAux[i].id == selectedValue) {
	        		this.subcategories = this.categoriesAux[i].subcategorias;
	        		this.subcategories = this.sortByKey(this.subcategories,'nombre');
	        	}
	        }
	      }
	    );
	    this.registerServiceForm.controls['categoriaP_id'].valueChanges.subscribe(
	      (selectedValue) => {
	      	this.categories = [];
	      	this.subcategories = [];
	      	this.registerServiceForm.patchValue({categoria_id: ''});
	      	this.registerServiceForm.patchValue({subcategoria_id: ''});
	        for (var j = 0; j < this.categoriesAux.length; ++j) {
    			if (this.categoriesAux[j].catprincipales_id == selectedValue) {
	        		this.categories.push(this.categoriesAux[j]);
	        		this.categories = this.sortByKey(this.categories,'nombre');
	        	}
    		}
	      }
	    );
	    this.registerServiceForm.controls['ciudad'].valueChanges.subscribe(
	      (selectedValue) => {
	        this.zone.run(()=>{
	        	this.zones = [];
	        	this.registerServiceForm.patchValue({zona: ''});
	        	this.zones = selectedValue.zonas;     
	        })
	      }
	    );
	    this.registerServiceForm.controls['zona'].valueChanges.subscribe(
	      (selectedValue) => {
	        for (var i = 0; i < selectedValue.length; ++i) {
	        	this.selecZones.push({id: selectedValue[i].id, nombre: this.registerServiceForm.value.ciudad.nombre + ' - '+ selectedValue[i].nombre});
	        }
	        
	      } 
	    );
	}

	getSubcategories(){
		this.storage.get('TRPSV24').then(items => {
  			if (items) {
  				this.storage.getObject('userRPSV24').then(items1 => {
		  			if (items1) {
		  				this.presentLoading();
		  				this.orderService.getCategoriesP(items,items1.ciudad).subscribe(
				        data => {
					      this.datosE = data;
					      this.categories_principal = this.datosE.categorias;
					      this.categories_principal = this.sortByKey(this.categories_principal,'nombre');
					      this.orderService.getSubcategories(items,items1.ciudad).subscribe(
					        data => {
						      this.datos = data;
						      this.categoriesAux = this.datos.categoria;
						      this.loading.dismiss();
						      this.getCity(items1.pais_id);
						    },
						    msg => {
						      this.loading.dismiss();
						      this.getCity(items1.pais_id);
						      if(msg.status == 400 || msg.status == 401){ 
						      	this.storage.set('TRPSV24','');
						        this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
						        this.navCtrl.navigateRoot('login');
						      }
						  });
					    },
					    msg => {
					      this.getCity(items1.pais_id);
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
   
	getCity(pais_id){
		this.orderService.getCity(pais_id).subscribe(
		  resp => {
		    this.datos2 = resp;
		    this.cities = this.datos2.coordenadas;
		    this.cities = this.sortByKey(this.cities,'nombre');
		  },
		  error => {       
		    console.log(error);
		  }
		); 
	}


	deleteLanguage(item){
		let index = this.selecZones.findIndex((item1) => item1.id === item.id);
		if(index !== -1){
			this.selecZones.splice(index, 1);
			console.log(this.selecZones);
		}
	}

	next(){
		this.slides.slideNext();
		setTimeout(()=>{
			this.content.scrollToTop();
		},300);	
	}

	async presentActionSheet(type) {
	    const actionSheet = await this.actionSheetController.create({
	      header: 'Seleccione una Imagen',
	      buttons: [{
	        text: 'Cargar de Librería',
	        icon: 'images',
	        handler: () => {
	          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
	        }
	      }, {
	        text: 'Usar Camara',
	        icon: 'camera',
	        handler: () => {
	          this.takePicture(this.camera.PictureSourceType.CAMERA, type);
	        }
	      }, {
	        text: 'Cancelar',
	        icon: 'close',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      }]
	    });
	    await actionSheet.present();
	}

	public takePicture(sourceType, type) {
	  // Create options for the Camera Dialog
	  	const options: CameraOptions = {
	      quality: 25,
	      targetWidth: 400,
	      targetHeight: 400,
	      sourceType: sourceType,
	      destinationType: this.camera.DestinationType.FILE_URI,
	      saveToPhotoAlbum: false,
	      allowEdit: true
	    }
	 
	  // Get the data of an image
	  this.camera.getPicture(options).then((imagePath) => {
	    // Special handling for Android library
	    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	      	this.filePath.resolveNativePath(imagePath)
	        .then(filePath => {
	          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
	          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
	          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);
	        });
	    } else {
	      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
	      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
	      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);
	    }
	  }, (err) => {
	    this.presentToast('Error al seleccionar la imagen');
	  });
	}

	// Create a new name for the image
	private createFileName() {
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
	}
	 
	// Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName, type) {
	  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
	    this.lastImage = newFileName;
	    if (type == '1') {
	    	this.uploadImage();
	    } else {
	    	this.uploadImage1();
	    }
	  }, error => {
	    this.presentToast('Error al guardar la imagen');
	  });
	}
	 
	// Always get the accurate path to your apps folder
	public pathForImage(img) {
	  if (img === null) {
	    return '';
	  } else {
	    return cordova.file.dataDirectory + img;
	  }
	}

	public uploadImage() {
	  // Destination URL
	  var url = "https://service24.app/alinstanteAPI/public/images_uploads/uploadproductos.php";
	 
	  // File for Upload
	  var targetPath = this.pathForImage(this.lastImage);
	 
	  // File name only
	  var filename = this.lastImage;
	 
	  var options = {
	    fileKey: "file",
	    fileName: filename,
	    chunkedMode: false,
	    mimeType: "multipart/form-data",
	    params : {'fileName': filename},
	    headers : {
           Connection: "close"
        }
	  };
	 
	  const fileTransfer: FileTransferObject = this.transfer.create();
	 
	  this.presentLoading();
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(data => {
	    this.loading.dismiss();
	    this.image_user = data.response;
	    this.registerServiceForm.patchValue({imagen: data.response});
	    this.image_uploads.imagen = data.response;
	  }, err => {
	    this.loading.dismiss();
	    this.presentToast('Error al subir la imagen');
	    this.image_user = 'assets/imagen-servicio.png';
	  });
	}

	public uploadImage1() {
	  // Destination URL
	  var url = "https://service24.app/alinstanteAPI/public/images_uploads/uploadproductosfotos.php";
	 
	  // File for Upload
	  var targetPath = this.pathForImage(this.lastImage);
	 
	  // File name only
	  var filename = this.lastImage;
	 
	  var options = {
	    fileKey: "file",
	    fileName: filename,
	    chunkedMode: false,
	    mimeType: "multipart/form-data",
	    params : {'fileName': filename},
	    headers : {
           Connection: "close"
        }
	  };
	 
	  const fileTransfer: FileTransferObject = this.transfer.create();
	 
	  this.presentLoading();
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(data => {
	    this.loading.dismiss();
	    this.image_user = data.response;
	    this.images_upload.push({url: data.response});
	  }, err => {
	    this.loading.dismiss();
	    this.presentToast('Error al subir la imagen');
	    this.image_user = 'assets/imagen-servicio.png';
	  });
	}

	register(){
		if (this.registerServiceForm.valid) {
			if (this.images_upload.length > 0) {
				this.registerServiceForm.patchValue({fotos: JSON.stringify(this.images_upload)});
				this.presentLoading();
				this.registerServiceForm.patchValue({establecimiento_id: this.idRegister});
				let band = 0;
				for (var i = 0; i < this.selecZones.length; ++i) {
					this.registerServiceForm.patchValue({zona_id: this.selecZones[i].id});
					this.orderService.addService(this.registerServiceForm.value).subscribe(
			        data => {
			        	band += 1;
			        	if (band == this.selecZones.length) {
			        		this.loading.dismiss();
							//this.event.publish('servicePreSV24', 'serviceSV');
							this.presentToast('Servicio añadido con éxito');
							this.navCtrl.navigateBack('complete-register');
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
				};
			} else {
				this.presentToast('Debe agregar al menos una imagen de tu servicio.');
			}
		} else {
			this.validateAllFormFields(this.registerServiceForm);
			this.presentToast('Debe completar todos los campos');
		}
	}

	delete_image(item){
		let index = this.images_upload.findIndex((itemN) => itemN.url === item.url);
		if(index !== -1){
			this.images_upload.splice(index, 1);
		}
	}

  onValueChanged(data?: any) {
    if (!this.registerServiceForm) { return; }
    const form = this.registerServiceForm;
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

  async presentConfirmDelete(item) {
	    const alert = await this.alertController.create({
		message: '¿Desea eliminar la imagen?',
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
	          	this.delete_image(item);
	          }
	        }
	      ]
		});
		await alert.present();
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

    public sortByKey(array, key) {
	    return array.sort(function (a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
	    });
	}
}
