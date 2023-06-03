import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { UserService } from '../../services/user/user.service';
import { StorageService } from '../../services/storage/storage.service';
import { RefreshService } from '../../services/refresh/refresh.service';
import { Subscription } from 'rxjs';
//declare var CollectCheckout;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  public datos: any;
  public datos1: any;
  public pendiente: any;
  public pagado: any;
  public showEmpty1: boolean = false;
  public showEmpty2: boolean = false;
  public type: string = 'track';
  private subscription: Subscription;

  constructor(
  	public modalCtrl: ModalController,
    public userService: UserService, 
    private storage: StorageService, 
    public refresh: RefreshService,
  ) { 
    this.subscription = this.refresh.formRefreshSource$.subscribe((msg:any) => {
      this.getPayment();
    });
    this.getPayment();
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getPayment(){
      this.storage.getObject('userRPSV24').then(items => {
      if (items) {
        this.storage.get('TRPSV24').then(items2 => {
          if (items2) {
            this.userService.getPayment(items.id,items2).subscribe(
            data => {
              console.log(data)
              this.datos = data;
              this.pendiente = this.datos.por_pagar;
              this.pagado = this.datos.pagados;
              if (this.pendiente.length == 0) {
                this.showEmpty1 = true;
              }
              if (this.pagado.length == 0) {
                this.showEmpty2 = true;
              }
              console.log(this.pendiente)
            },
            msg => {
              this.showEmpty1 = true;
              this.showEmpty2 = true;
              this.pendiente = [];
              this.pagado = [];
            });
          }
        });
      }
    });  
  }

  pay(){
  /*  CollectCheckout.redirectToCheckout({
        lineItems: [{
            sku: "plan1",
            quantity: 1
        }],
        type: "auth",
        collectShippingInfo: true,
        customerVault: {
            addCustomer: true
        },
        successUrl: "https://service24.app/receipt/?transid={TRANSACTION_ID}",
        cancelUrl: "https://service24.app",
        receipt: {
            showReceipt: true,
            redirectToSuccessUrl: true
        }
    }).then((error) => {
        console.log(error);
    });*/
  }

}
