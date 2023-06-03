import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from '../../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient, public storage: StorageService) { }

  /* GET estado proveedor */
  getStatus(id,token): Observable<any>{
    return this.http.get(`${environment.api}repartidores/`+id+'?token='+token);
  }

  /* PUT estado proveedor */
  setStatus(id,token,data): Observable<any>{
    return this.http.put(`${environment.api}repartidores/`+id+'?token='+token,data);
  }

  /* PUT datos de usuario */
  setUser(id,token,data): Observable<any>{
    return this.http.put(`${environment.api}repartidores/`+id+'?token='+token, data);
  }

  /* PUT datos de usuario */
  setUsuario(id,token,data): Observable<any>{
    return this.http.put(`${environment.api}usuarios/`+id+'?token='+token, data);
  }

  /* GET datos contacto */
  getContact(pais): Observable<any>{
    return this.http.get(`${environment.api}sistema/contacto?pais_id=`+pais);
  }

  /* GET id de chat con soporte */
  getId(id,token,ciudad): Observable<any>{
    return this.http.get(`${environment.api}chats/repartidores/michat/`+id+'?ciudad_id='+ciudad+'&token='+token);
  }

  /* POST pre-registro */
  setPreRegister(token,data): Observable<any>{
    return this.http.post(`${environment.api}registro?token=`+token, data);
  }

  /* PUT pre-registro */
  putPreRegister(token,data,id): Observable<any>{
    return this.http.put(`${environment.api}registro/`+id+`?token=`+token, data);
  }

  /* GET planes */
  getPlans(token,id): Observable<any>{
    return this.http.get(`${environment.api}planes?pais_id=`+id+`&token=`+token);
  }  

  /* POST contrato */
  postContrat(nombre,ci,direccion,telefono,usuario_id,plan,token,data,pais): Observable<any>{
    return this.http.post(`${environment.api}con_contratos?nombre=`+nombre+`&ci=`+ci+`&direccion=`+direccion+`&telefono=`+telefono+`&usuario_id=`+usuario_id+`&plan=`+plan+`&firma=`+null+`&pais_id=`+pais+`&token=`+token, data);
  }

  /* GET planes */
  getContrat(id,token): Observable<any>{
    return this.http.get(`${environment.api}con_contratos/`+id+`?token=`+token);
  }

  /* GET notificaciones */
  getCity(id,token): Observable<any>{
    return this.http.get(`${environment.api}usuario_zona/`+id+`?token=`+token);
  }

  /* GET notificaciones */
  getNotifications(ciudad_id,token,user_id): Observable<any>{
    return this.http.get(`${environment.api}notificaciones_generales_t3?ciudad_id=`+ciudad_id+`&usuario_id=`+user_id+`&token=`+token);
  }

  /* GET pagos */
  getPayment(id,token): Observable<any>{
    return this.http.get(`${environment.api}cobros/`+id+`?token=`+token);
  }

  /* GET terminos */
  getTerminos(id,token): Observable<any>{
    return this.http.get(`${environment.api}sistema/terminos?pais_id=`+id+`&token=`+token);
  }

  /* GET avisos */
  getPolice(id,token): Observable<any>{
    return this.http.get(`${environment.api}sistema/aviso?pais_id=`+id+`&token=`+token);
  }

  /* GET cerraSeccion */
  logout(id,token): Observable<any>{
    return this.http.get(`${environment.api}cerrar_sesion/`+id+`&token=`+token);
  }

}
