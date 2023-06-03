import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  
  private formRefreshAnnouncedSource = new Subject();
  public formRefreshSource$ = this.formRefreshAnnouncedSource.asObservable();
  private formRefreshAnnouncedSource1 = new Subject();
  public formRefreshSource1$ = this.formRefreshAnnouncedSource1.asObservable();

  private formRefreshAnnouncedSource2 = new Subject();
  public formRefreshSource2$ = this.formRefreshAnnouncedSource2.asObservable();

  private formRefreshAnnouncedSource3 = new Subject();
  public formRefreshSource3$ = this.formRefreshAnnouncedSource3.asObservable();

  private formRefreshAnnouncedSource4 = new Subject();
  public formRefreshSource4$ = this.formRefreshAnnouncedSource4.asObservable();

  publishFormRefresh(data?){
    this.formRefreshAnnouncedSource.next(data);
  }

  publishFormRefresh1(data?){
    this.formRefreshAnnouncedSource1.next(data);
  }

  publishFormRefresh2(data?){
    this.formRefreshAnnouncedSource2.next(data);
  }

  publishFormRefresh3(data?){
    this.formRefreshAnnouncedSource3.next(data);
  }

  publishFormRefresh4(data?){
    this.formRefreshAnnouncedSource4.next(data);
  }
}
