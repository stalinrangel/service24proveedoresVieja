import { Component, OnInit } from '@angular/core';
import { NavController, NavParams,  ModalController, Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-zones-service',
  templateUrl: './zones-service.page.html',
  styleUrls: ['./zones-service.page.scss'],
})
export class ZonesServicePage implements OnInit {

	zones: any;
	selectZone: any[] = [];
	allSelected: boolean = false;

  constructor(
  	public nav: NavParams,
  	private modalCtrl:ModalController,
  ) { 
  	this.zones = nav.get('data');
  	this.zones = this.sortByKey(this.zones, 'nombre');
  	let band = 0;
  	for (var i = 0; i < this.zones.length; ++i) {
  		if (this.zones[i].isChecked) {
  			this.selectZone.push(this.zones[i]);
  			band += 1;
  		}
  	}
  	if (band == this.zones.length) {
  		this.allSelected = true;
  	}
  }

  ngOnInit() {
  }

  toggleSelectAll(){
  	this.selectZone = [];
  	if (!this.allSelected) {
  		for (var i = 0; i < this.zones.length; ++i) {
	  		this.zones[i].isChecked = false;
	  	}
  	} else {
  		for (var i = 0; i < this.zones.length; ++i) {
	  		this.zones[i].isChecked = true;
	  		this.selectZone.push(this.zones[i]);
	  	}
  	}
  	
  }

  	changeZone(item){
  		let index = this.selectZone.findIndex((item1) => item1.id === item.id);
  		console.log(index)
		if(index !== -1){
			this.selectZone.splice(index, 1);
			console.log(this.selectZone);
		} else {
			this.selectZone.push(item);
			console.log(this.selectZone);
		}
  	}

  SaveModal() {
  	this.modalCtrl.dismiss(this.selectZone);
  }

  closeModal() {
  	this.modalCtrl.dismiss(null);
  }

  	public sortByKey(array, key) {
	    return array.sort(function (a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
	    });
	}

}
