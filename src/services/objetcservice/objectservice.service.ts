import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectserviceService {

	extras: any;
	category: any;
	id: any;
	plans: any;
	type: any;

	constructor() { }

	public setExtras(data){
		this.extras = data;
	}

	public getExtras(){
		return this.extras;
	}

	public setCat(data){
		this.category = data;
	}

	public getCat(){
		return this.category;
	}

	public setId(data){
		this.id = data;
	}

	public getId(){
		return this.id;
	}

	public setPlans(data){
		this.plans = data;
	}

	public getPlans(){
		return this.plans;
	}

	public setType(data){
		this.type = data;
	}

	public getType(){
		return this.type;
	}
}
