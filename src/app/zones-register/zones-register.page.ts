import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController, Platform, LoadingController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { OrdersService } from '../../services/orders/orders.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-zones-register',
  templateUrl: './zones-register.page.html',
  styleUrls: ['./zones-register.page.scss'],
})
export class ZonesRegisterPage implements OnInit {

	public datos: any;
	public zones: any = [];
	public show: boolean = false;
	public myZone: any = {
    nombre: '',
    id: 1000,
    coordenadas: ''
	}
  myLatLng: any;
  data: any;
  areaTriangle: any = [];
  datosC: any;
  coordenates: any = [];
  triangleCoords = [];
  public inside: boolean;
  public loading: any;
  public countries: any = [];
  public country_id: any;
  
  @Input() value: any;

  constructor(
    private modalCtrl:ModalController,
    public storage: StorageService,
    private objService: ObjectserviceService,
    public order: OrdersService,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    public loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.getCountries(); 
  }

  getCountries(){
   this.presentLoading();
   this.order.getCountries().subscribe(
      resp => {
        this.loading.dismiss();
        this.datos = resp;
        this.countries = this.datos.coordenadas;
        this.countries = this.sortByKey(this.countries,'nombre');
      },
      error => {  
        this.loading.dismiss();     
      }
    ); 
  }

  setCountry(country){
    this.zones = country.ciudad;
    this.zones = this.sortByKey(this.zones,'nombre');
    for (var i = 0; i < this.zones.length; ++i) {
      this.zones[i].show = true;
      this.zones[i].zonas = this.sortByKey(this.zones[i].zonas,'nombre');
    }
  }

  setZone(zone){
    this.storage.setObject('ZONESV24PR', zone);
    this.modalCtrl.dismiss(zone);
  }

  closeModal() {
  	if (this.myZone.id != 1000) {
  		this.modalCtrl.dismiss(this.myZone);
  	} else {
  		this.modalCtrl.dismiss();
  	}
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

  public sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }
}
