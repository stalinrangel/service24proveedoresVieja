import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { RefreshService } from '../../services/refresh/refresh.service';

@Component({
  selector: 'app-info-profile',
  templateUrl: './info-profile.page.html',
  styleUrls: ['./info-profile.page.scss'],
})
export class InfoProfilePage implements OnInit {

  public subscription: any;

  constructor(
  	private nav: NavController,
    private modalCtrl:ModalController,
    private platform: Platform,
    public refresh: RefreshService,
  ) { }

  ngOnInit() {
  }

  goBack(){
    this.nav.pop();
  }

  ionViewDidEnter() {
    this.setUIBackButtonAction();
  }

  ionPageWillLeave(){
    this.subscription.unsubscribe();
  }

  setUIBackButtonAction() {
    this.subscription = this.platform.backButton.subscribeWithPriority(0, () => {
      this.nav.pop();
    });
  }

   takePicture() {
    this.refresh.publishFormRefresh4('file://');
    this.nav.pop();
  }

}
