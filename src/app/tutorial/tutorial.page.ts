import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  
  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  public subscription: any;

  constructor(
    private nav: NavController,
    private platform: Platform,
    public modalController: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  nextSlide(){
  	this.slides.slideNext();
  }

  prevSlide(){
  	this.slides.slidePrev();
  }

  btn_ommit(){
    this.storage.set('TUTORIALPV', 'OK');
    this.modalController.dismiss();
  }

}

