import { Component, ViewChild } from '@angular/core';
import { IonTabs, Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

	public currentTab: string = "tab1";
	@ViewChild(IonTabs) public tabs: IonTabs;
	public subscription: any;

	constructor(private platform: Platform,public navCtrl: NavController,public router: Router){}
	
	setTab() {
    	this.currentTab = this.tabs.getSelected();
	}

	ionViewDidEnter(){
	    this.subscription = this.platform.backButton.subscribe(()=>{
	        if (this.router.url == '/tabs/tab1' || this.router.url == '/tabs/tab2' || this.router.url == '/tabs/tab3') {
			    navigator['app'].exitApp();
		    }
	    });
	}

	ionPageWillLeave(){
		this.subscription.unsubscribe();
	}

	async openTab(tab: string, evt: MouseEvent) {
	    const tabSelected = this.tabs.getSelected();
	    evt.stopImmediatePropagation();
	    evt.preventDefault();
	    return tabSelected !== tab
	      ? await this.navCtrl.navigateRoot(this.tabs.outlet.tabsPrefix + '/' + tab)
	      : this.tabs.select(tab);
	}
}