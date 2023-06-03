import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(public http: HttpClient) { }

  /* Get pedidos en espera */
  getInput(id,token): Observable<any>{
    return this.http.get(`${environment.api}repartidores/`+id+'/pedido/enespera?token='+token);
  }

  /* Get pedidos en curso */
  getTracking(id,token): Observable<any>{
    return this.http.get(`${environment.api}repartidores/`+id+'/pedido/encurso?token='+token);
  }

  /* Get pedidos finalizados */
  getHistory(id,month,year,token): Observable<any>{
    return this.http.get(`${environment.api}repartidores/`+id+`/historial/pedidos?mes=`+month+`&anio=`+year+`&token=`+token);
  }

  /* Get categorias */
  getCategoriesP(token,ciudad): Observable<any>{
    return this.http.get(`${environment.api}catprincipales?ciudad_id=`+ciudad+`&token=`+token);
  }

  /* Get subcategorias */
  getSubcategories(token,ciudad): Observable<any>{
    return this.http.get(`${environment.api}categsub?ciudad_id=`+ciudad+`&token=`+token);
  }

  /* Get detalle de pedido */
  getOrderId(id,token): Observable<any>{
    return this.http.get(`${environment.api}pedidos/`+id+'?token='+token);
  }

  /* Get servicios */
  getServices(id,token?): Observable<any>{
    return this.http.get(`${environment.api}establecimientos/`+id+`/productos?token=`+token);
  }

  /* Post servicios */
  addService(data,token?): Observable<any>{
    return this.http.post(`${environment.api}productos`,data);
  }

  /* Post de imagen de servicios */
  imageService(data,token): Observable<any>{
    return this.http.post(`${environment.api}imagenes?token=`+token,data);
  }

  /* Put aceptar servicios */
  acceptService(id,pedido_id,hora,token): Observable<any>{
    return this.http.put(`${environment.api}notificaciones/`+id+`/aceptar/pedido?pedido_id=`+pedido_id+`&hora_aceptado=`+hora+`&token=`+token,{});
  }

  /* Put finalizar servicios */
  finishService(id,data,token): Observable<any>{
    return this.http.put(`${environment.api}notificaciones/`+id+`/finalizar/pedido?token=`+token,data);
  }

  /* Enviar calificacion del servicio */
  sendCalification(data,token): Observable<any>{
    return this.http.post(`${environment.api}calificaciones?token=`+token,data);
  }

  /* Get subcategorias listas */
  getSubcategoriesID(token): Observable<any>{
    return this.http.get(`${environment.api}subcategorias?token=`+token);
  }

  /* Delete servicios */
  deleteService(id,token?): Observable<any>{
    return this.http.delete(`${environment.api}productos/`+id+`?token=`+token);
  }

  /* Put servicios */
  editService(data,id,token): Observable<any>{
    return this.http.put(`${environment.api}productos/`+id+`?token=`+token,data);
  }

  /* Cancelar servicio */
  cancelOrder(data,id,token): Observable<any>{
    return this.http.post(`${environment.api}cancelar_pedidos/`+id+`?token=`+token,data);
  }

  getZones(): Observable<any>{
    return this.http.get(`${environment.api}zonas`);
  }

  getCity(pais): Observable<any>{
    return this.http.get(`${environment.api}ciudad?pais_id=`+pais);
  }

  getCountries(): Observable<any>{
    return this.http.get(`${environment.api}pais`);
  }

}
