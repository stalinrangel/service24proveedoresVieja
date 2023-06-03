import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {

	signature = '';
  isDrawing = false;
 
  @ViewChild(SignaturePad, {static: false}) signaturePad: SignaturePad;
	public signaturePadOptions: Object = {
		'minWidth': 2,
		'canvasWidht': 400,
		'canvasHeight': 200,
		'penColor': '#000000'
	};

  constructor(
  	private modalCtrl:ModalController
  ) { 
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
   this.canvasResize();
  }
 
  drawComplete() {
    this.isDrawing = false;
  }
 
  drawStart() {
    this.isDrawing = true;
  }

  canvasResize() { 
  	let canvas = document.querySelector('canvas');
  	var ratio = Math.max(window.devicePixelRatio || 1, 1);
  	canvas.width = (canvas.clientWidth * ratio);
  	this.signaturePad.clear();
  }
 
  async savePad() {
    this.signature = this.signaturePad.toDataURL();
    this.signaturePad.clear();
    await this.modalCtrl.dismiss(this.signature);
  }
 
  clearPad() {
    this.signaturePad.clear();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
