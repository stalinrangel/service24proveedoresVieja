import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
    	private router: Router, 
    	private storageService: StorageService,
    	private nav: NavController
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
		return this.storageService.get('TRPSV24').then(items => {
		  if (items != '' && items != null) {
		  	console.log('entro guard')
		  	this.nav.navigateRoot('/tabs/tab1');
		  	return Promise.resolve(false);
		  }	else {
		  	return Promise.resolve(true);
		  }
		});
    }
}