import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, ToastController, ActionSheetController, IonSlides, IonContent, IonBackButtonDelegate, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import { OrdersService } from '../../services/orders/orders.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ZonesServicePage } from '../zones-service/zones-service.page';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { RefreshService } from '../../services/refresh/refresh.service';

declare var cordova: any;

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  styleUrls: ['./add-service.page.scss'],
})
export class AddServicePage implements OnInit {

	@ViewChild(IonSlides) slides: IonSlides;
	@ViewChild(IonContent) content: IonContent;
	@ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
	
	public registerServiceForm: FormGroup;
	public datos: any;
	public datosU: any;
	public datosE: any;
	public categories: any = [];
	public categoriesAux: any = [];
	public categories_principal: any = [];
	public subcategories: any = [];
	public loading = null;
	public subscription: any;
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
	'zona': '',
	'ciudad_id': '',
	'zona_id': ''
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
	public years: any = [];
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

	public searchTerm: string = '';
  	public items: any = [];
  	public items1: any = [];
  	public imageResponse: any = [];
  	public band: any = 0;

	constructor(
    public navCtrl: NavController,  
    private alertController: AlertController, 
    private loadingController: LoadingController, 
    private builder: FormBuilder, 
    private toastController: ToastController,
    public actionSheetController: ActionSheetController, 
    public storage: StorageService,
    public refresh: RefreshService,
    public orderService: OrdersService,
    private camera: Camera,
	private filePath: FilePath,
	private file: File,
	private platform: Platform,
	private transfer: FileTransfer,
	private zone: NgZone,
	public modalController: ModalController,
	private crop: Crop,
	private imagePicker: ImagePicker,
	private change: ChangeDetectorRef
  	) {	
  		for (var i = 1; i < 51; ++i) {
			this.years.push(i);
		} 
	}

	ngOnInit() {
		this.initForm();
		this.getSubcategories();
		//cordova.plugins.backgroundMode.setDefaults({ silent: true });
		//cordova.plugins.backgroundMode.enable();
	}

	ionViewDidEnter() {
		this.setUIBackButtonAction();
	}

	ionViewWillLeave(){
		if (cordova.plugins.backgroundMode.isEnabled()) {
			cordova.plugins.backgroundMode.disable();
		}
		this.subscription.unsubscribe();
	}

	setUIBackButtonAction() {
	    this.backButton.onClick = () => {    	
	    	this.slides.getActiveIndex().then(index => {
			   	if (index != 0) {
					this.slides.lockSwipeToPrev(false);
					this.slides.slidePrev();
				} else {
					this.navCtrl.navigateForward('list-services');
				}
			});
	    };
	    this.subscription = this.platform.backButton.subscribeWithPriority(0, () => {
		    this.slides.getActiveIndex().then(index => {
			   	if (index != 0) {
					this.slides.lockSwipeToPrev(false);
					this.slides.slidePrev();
				} else {
					this.navCtrl.navigateForward('list-services');
				}
			});
		});    
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
	      zona_id: ['', [Validators.required]]
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
	    this.registerServiceForm.controls['nombre'].valueChanges.subscribe(
	      (selectedValue) => {
	        this.registerServiceForm.patchValue({nombre: this.capitalizeFirstLetter(selectedValue)});
	      }
	    );
	    this.registerServiceForm.controls['descripcion'].valueChanges.subscribe(
	      (selectedValue) => {
	        this.registerServiceForm.patchValue({descripcion: this.capitalizeFirstLetter(selectedValue)});
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
						      this.dismiss();
						      this.getCity(items1.pais_id);
						    },
						    msg => {
						      this.dismiss();
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
					      this.dismiss();
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

	setFilteredItems() {
		this.items1 = [];
		this.items = this.categoriesAux; 
		let val = this.removeDiacritics(this.searchTerm);
		if (val && val.trim() != '') {
			//1
			for (var i = 0; i < this.categories_principal.length; ++i) {
				this.categories_principal[i].nombre1 = this.removeDiacritics(this.categories_principal[i].nombre);
				if (this.categories_principal[i].nombre1.toLowerCase().indexOf(val.toLowerCase()) > -1) {
					for (var j = 0; j < this.items.length; ++j) {
						if (this.categories_principal[i].id == this.items[j].catprincipales_id) {
							for (var m = 0; m < this.items[j].subcategorias.length; ++m) {
								let index = this.items1.findIndex((item2) => item2.subcategoria_id === this.items[j].subcategorias[m].id);
								if(index == -1){
									this.items1.push({categoriap_id: this.categories_principal[i].id, categoriap_nombre: this.categories_principal[i].nombre,
									categoria_id: this.items[j].id, categoria_nombre: this.items[j].nombre, subcategoria_id: this.items[j].subcategorias[m].id,
									subcategoriap_id: this.items[j].subcategorias[m].nombre});
								}	
							}
						}			
					}
				}
			}
			//2
			for (var i = 0; i < this.categories_principal.length; ++i) {
				for (var j = 0; j < this.items.length; ++j) {
					if (this.categories_principal[i].id == this.items[j].catprincipales_id) {
						this.items[j].nombre1 = this.removeDiacritics(this.items[j].nombre);
						if (this.items[j].nombre1.toLowerCase().indexOf(val.toLowerCase()) > -1) {
							for (var m = 0; m < this.items[j].subcategorias.length; ++m) {
								let index = this.items1.findIndex((item2) => item2.subcategoria_id === this.items[j].subcategorias[m].id);
								if(index == -1){
									this.items1.push({categoriap_id: this.categories_principal[i].id, categoriap_nombre: this.categories_principal[i].nombre,
									categoria_id: this.items[j].id, categoria_nombre: this.items[j].nombre, subcategoria_id: this.items[j].subcategorias[m].id,
									subcategoriap_id: this.items[j].subcategorias[m].nombre});
								}	
							}
						}
					}	
				}
			}
			//3
			for (var i = 0; i < this.categories_principal.length; ++i) {
				for (var j = 0; j < this.items.length; ++j) {
					if (this.categories_principal[i].id == this.items[j].catprincipales_id) {
						for (var m = 0; m < this.items[j].subcategorias.length; ++m) {
							this.items[j].subcategorias[m].nombre1 = this.removeDiacritics(this.items[j].subcategorias[m].nombre);
							if (this.items[j].subcategorias[m].nombre1.toLowerCase().indexOf(val.toLowerCase()) > -1) {
								let index = this.items1.findIndex((item2) => item2.subcategoria_id === this.items[j].subcategorias[m].id);
								if(index == -1){
									this.items1.push({categoriap_id: this.categories_principal[i].id, categoriap_nombre: this.categories_principal[i].nombre,
									categoria_id: this.items[j].id, categoria_nombre: this.items[j].nombre, subcategoria_id: this.items[j].subcategorias[m].id,
									subcategoriap_id: this.items[j].subcategorias[m].nombre});
								}
							}
						}
					}		
				}
			}
		}
	}

	selectService(item){
		this.zone.run(()=>{
			this.registerServiceForm.patchValue({categoriaP_id: item.categoriap_id});
			this.registerServiceForm.patchValue({categoria_id: item.categoria_id});
			this.registerServiceForm.patchValue({subcategoria_id: item.subcategoria_id});
			this.items1 = []; 
			this.searchTerm = '';
			this.change.detectChanges();
		})
	}

	deleteLanguage(item){
		let index = this.selecZones.findIndex((item1) => item1.id === item.id);
		if(index !== -1){
			this.selecZones.splice(index, 1);
			for (var i = 0; i < this.zones.length; ++i) {
				if (this.zones[i].id == item.id) {
					this.zones[i].isChecked = false;
				}
			}
		}
	}

	async selectZone() {
	    const modal = await this.modalController.create({
	      component: ZonesServicePage,
	      componentProps: {data: this.zones}
	    });
	    modal.onDidDismiss().then((close)=> {
	    	console.log(close.data)
	      if (close.data != null) {
	        this.selecZones = close.data;
	      }
	    });
	    return await modal.present();
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
	        	if (type == '1') {
	          		this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
	      		} else {
	      			if (this.images_upload.length < 10) {
	      				this.multiplePicture(type)
	      			} else {
	      				this.presentToast('Puedes agregar un máximo de 10 imagenes por servicio');
	      			}
	      		}
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

	multiplePicture(type){
		let options = {
	      maximumImagesCount: 10,
	      width: 400,
	      quality: 75,
	      outputType: 0
	    };

	    this.imagePicker.getPictures(options).then(results => {
	    	this.imageResponse = results;
	        for (var i = 0; i < results.length; i++) {
	        	this.copyFileToLocalDir1(results[i], type);
	        	this.band = 1; 
	        }     
	      }
	    );
	}

	copyFileToLocalDir1(fullPath, type) {
	    let myPath = fullPath;
	    if (fullPath.indexOf('file://') < 0) {
	      myPath = 'file://' + fullPath;
	    }
	 
	    var currentName = myPath.substr(myPath.lastIndexOf('/') + 1);
	    var correctPath = myPath.substr(0, myPath.lastIndexOf('/') + 1);

	    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);
	}

	public takePicture(sourceType, type) {
	  // Create options for the Camera Dialog
	  const options: CameraOptions = {
	      quality: 75,
	      targetWidth: 400,
	      targetHeight: 400,
	      destinationType: this.camera.DestinationType.FILE_URI,
	      sourceType: sourceType,
	      saveToPhotoAlbum: false,
	      allowEdit: true,
	      correctOrientation: true
	    }
	 
	  // Get the data of an image
	  this.camera.getPicture(options).then((imagePath) => {
	    // Special handling for Android library
	    //this.backgroundMode.disable();
	    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	      	
	    	//this.crop.crop(imagePath, {quality: 75})
			//.then((imagePath) => { 
				this.filePath.resolveNativePath(imagePath)
		        .then(filePath => {
		          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
		          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
		          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);
		        });
			//},
			  //  error => console.log(JSON.stringify(error))
			//);

			
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
	    this.dismiss();
	    this.image_user = data.response;
	    this.registerServiceForm.patchValue({imagen: data.response});
	    this.image_uploads.imagen = data.response;
	  }, err => {
	    this.dismiss();
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

	  	if (this.loading == null) {
	    	this.presentLoading();
	    }
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(data => {
	    if (this.loading != null) {
	    	this.dismiss();
	    }
	    if (this.images_upload.length < 10) {
	    	this.image_user = data.response;
	    	this.images_upload.push({url: data.response});
	    }   
	  }, err => {
	    if (this.loading != null) {
	    	this.dismiss();
	    }
	    this.presentToast('Error al subir la imagen');
	    this.image_user = 'assets/imagen-servicio.png';
	  });
	}

	register(){
		if (this.selecZones.length > 0) {
			this.registerServiceForm.patchValue({zona_id: JSON.stringify(this.selecZones)});
		}
		if (this.registerServiceForm.valid) {
			if (this.images_upload.length > 0) {
				this.registerServiceForm.patchValue({fotos: JSON.stringify(this.images_upload)});
				this.presentLoading();
				this.storage.get('userRPSV24').then(items => {
		  			if (items) {
						this.storage.get('TRPSV24').then(items2 => {
				  			if (items2) {
				  				let id = JSON.parse(items).establecimiento.id;
				  				this.registerServiceForm.patchValue({establecimiento_id: id});
								
								console.log(this.registerServiceForm.value)
								this.orderService.addService(this.registerServiceForm.value,items2).subscribe(
						        data => {
						        	this.dismiss();
								    this.presentToast1('¡Servicio añadido con éxito! Te notificaremos cuando éste sea aprobado');
								    this.navCtrl.pop();
							    },
							    msg => {
							      this.dismiss();
							      if(msg.status == 400 || msg.status == 401){ 
							      	this.storage.set('TRPSV24','');
							        this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
							        this.navCtrl.navigateRoot('login');
							      } else {
							      	this.presentToast(msg.error);
							      }
							    });
				  			} 
					    });
				    }
			    });
			} else {
				this.presentToast('Debe agregar al menos una imagen de tu servicio.');
			};
		} else {
			this.validateAllFormFields(this.registerServiceForm);
			this.presentToast('Debe completar todos los campos');
		};
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

   async dismiss() {
        if (this.loading != null) {
            await this.loadingController.dismiss();
            this.loading = null;
        }
        return;
    }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2500,
      cssClass: 'toast-scheme'
    });
    toast.present();
  }

	async presentToast1(text) {
	    const toast = await this.toastController.create({
	      message: text,
	      duration: 4000,
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

	removeDiacritics (str) {

    var defaultDiacriticsRemovalMap = [
      {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
      {'base':'AA','letters':/[\uA732]/g},
      {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
      {'base':'AO','letters':/[\uA734]/g},
      {'base':'AU','letters':/[\uA736]/g},
      {'base':'AV','letters':/[\uA738\uA73A]/g},
      {'base':'AY','letters':/[\uA73C]/g},
      {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
      {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
      {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
      {'base':'DZ','letters':/[\u01F1\u01C4]/g},
      {'base':'Dz','letters':/[\u01F2\u01C5]/g},
      {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
      {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
      {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
      {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
      {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
      {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
      {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
      {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
      {'base':'LJ','letters':/[\u01C7]/g},
      {'base':'Lj','letters':/[\u01C8]/g},
      {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
      {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
      {'base':'NJ','letters':/[\u01CA]/g},
      {'base':'Nj','letters':/[\u01CB]/g},
      {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
      {'base':'OI','letters':/[\u01A2]/g},
      {'base':'OO','letters':/[\uA74E]/g},
      {'base':'OU','letters':/[\u0222]/g},
      {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
      {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
      {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
      {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
      {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
      {'base':'TZ','letters':/[\uA728]/g},
      {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
      {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
      {'base':'VY','letters':/[\uA760]/g},
      {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
      {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
      {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
      {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
      {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
      {'base':'aa','letters':/[\uA733]/g},
      {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
      {'base':'ao','letters':/[\uA735]/g},
      {'base':'au','letters':/[\uA737]/g},
      {'base':'av','letters':/[\uA739\uA73B]/g},
      {'base':'ay','letters':/[\uA73D]/g},
      {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
      {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
      {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
      {'base':'dz','letters':/[\u01F3\u01C6]/g},
      {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
      {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
      {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
      {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
      {'base':'hv','letters':/[\u0195]/g},
      {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
      {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
      {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
      {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
      {'base':'lj','letters':/[\u01C9]/g},
      {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
      {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
      {'base':'nj','letters':/[\u01CC]/g},
      {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
      {'base':'oi','letters':/[\u01A3]/g},
      {'base':'ou','letters':/[\u0223]/g},
      {'base':'oo','letters':/[\uA74F]/g},
      {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
      {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
      {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
      {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
      {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
      {'base':'tz','letters':/[\uA729]/g},
      {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
      {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
      {'base':'vy','letters':/[\uA761]/g},
      {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
      {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
      {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
      {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];

    for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
      str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }

    return str;
  }

  	capitalizeFirstLetter(string) {
  		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
