import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RefreshService } from '../../services/refresh/refresh.service';

@Component({
  selector: 'app-finish-register',
  templateUrl: './finish-register.page.html',
  styleUrls: ['./finish-register.page.scss'],
})
export class FinishRegisterPage implements OnInit {

  constructor(
  	public navCtrl: NavController,
    public refresh: RefreshService,
  ) { }

  ngOnInit() {
  }

  gotopage(){
    this.refresh.publishFormRefresh1('userSV');
    this.navCtrl.navigateRoot('/tabs/tab3');
  }

}
