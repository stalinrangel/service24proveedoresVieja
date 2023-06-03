import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../services/storage/storage.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {
 
  public watch: any;   
  public lat: number = 0;
  public lng: number = 0;
  public send = {
  	lat: 0,
	lng: 0,
	token: ''
  }
  public repeat_interval: any;
 
  constructor(
  	public zone: NgZone, 
  	public backgroundGeolocation: BackgroundGeolocation, 
  	public geolocation: Geolocation, 
  	public http: HttpClient,  
  	public storage: StorageService, 
  	private toastCtrl: ToastController) {
  }
 
	startTracking() {

    	let config = {
			desiredAccuracy: 10,
			stationaryRadius: 20,
			distanceFilter: 30,
			debug: false,
			stopOnTerminate: true
		};

		this.backgroundGeolocation.configure(config).then(() => {
			this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {

			  	this.zone.run(() => {
					this.send.lat = location.latitude;
					this.send.lng =  location.longitude;
					this.startLocation(this.send);
				});

				this.backgroundGeolocation.finish();
			});
		});

		this.backgroundGeolocation.start();

		this.repeat_interval = setInterval(function() {
		    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
				this.zone.run(() => {
					this.send.lat = resp.coords.latitude;
			      	this.send.lng =  resp.coords.longitude;
			      	this.startLocation(this.send);
				});
			}).catch((error) => {
			  console.log('Error getting location', error);
			});
		}.bind(this), 10000);
	};

	startLocation(position){
		this.storage.getObject('idRPSV24').then(items => {
	      if (items != '' && items != null) {
	        this.storage.get('TRPSV24').then(items2 => {
	          if (items2 != '' && items2 != null) {
	            this.send.token = items2;
	            this.http.post(`${environment.api}repartidores/`+items+`/set/posicion?token=`+items2,position)
			    .toPromise()
			    .then(
			    data => {
			      //this.presentToast('Actualizando ubicación')
			    },
			    msg => { 
			      if(msg.status == 400 || msg.status == 401){ 
			        this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
			      } else {
			        this.presentToast(msg.error.error);
			      }
			    });
	          }
	        });
	      }
	    });
	}

	getLocation(){
		return Observable.create(observer => {
        	this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
				this.zone.run(() => {
					this.send.lat = resp.coords.latitude;
			      	this.send.lng =  resp.coords.longitude;
			      	observer.next(this.send);
            		observer.complete();
				});
			}).catch((error) => {
			  console.log('Error getting location', error);
			  observer.error(error);
              observer.complete();
			});
      	});
	}
 
	public stopTracking() {
		this.backgroundGeolocation.stop();
		clearInterval(this.repeat_interval);
		this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
			this.backgroundGeolocation.finish();
		});
	}

	public stopT() {
		this.backgroundGeolocation.start();
		setTimeout(()=>{
	      this.stopTracking();
	    },2000) 
	}

	public checkStatus() {
		
		return Observable.create(observer => {
			this.backgroundGeolocation.checkStatus().then((status) => {
				observer.next(status);
            	observer.complete();
			});
      	});
	}

	async presentToast(text) {
		const toast = await this.toastCtrl.create({
		  message: text,
		  duration: 2000
		});
		toast.present();
	}
 
}

