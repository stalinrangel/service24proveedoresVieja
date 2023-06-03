import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { StorageService } from '../../services/storage/storage.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

export class ChatMessage {
  id: string;
  emisor_id: number;
  userAvatar: string;
  receptor_id: number;
  created_at: number | string;
  msg: string;
  status: number;
}

export class UserInfo {
  id: any;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ChatServiceService {

	public datos: any;
	public mensajes: any = [];

	constructor(public http: HttpClient, public storage: StorageService) {
		console.log('Hello ChatServiceProvider Provider');
	}

	mockNewMsg(msg) {
	    const mockMsg: ChatMessage = {
	      id: moment().format(),
	      emisor_id: 2329382,
	      userAvatar: msg.toUserAvatar,
	      receptor_id: 232323,
	      created_at: moment().format(),
	      msg: msg.message,
	      status: 1
	    };
	}

	getMsgList(chat_id): Observable<ChatMessage[]> {
		return Observable.create(observer => {
			this.storage.get('TRPSV24').then(items => {
	  			if (items != '' && items != null) {
	  				this.http.get(`${environment.api}chats/repartidores/`+chat_id+`?token=`+items)
				    .toPromise()
				    .then(
					data => {
						this.datos = data;
						this.mensajes = this.datos.chat.mensajes;
						for (var i = 0; i < this.mensajes.length; ++i) {
							this.mensajes[i].userAvatar = this.mensajes[i].emisor.imagen;
						}
						observer.next(this.mensajes);
						observer.complete();
					},
					msg => {
						observer.error(msg.error);
						observer.complete();
					}); 
			  	};
			});
 		});
	}

	getMsgListP(chat_id): Observable<ChatMessage[]> {
		console.log(chat_id); 
		return Observable.create(observer => {
			this.storage.get('TRPSV24').then(items => {
	  			if (items != '' && items != null) {
	  				this.http.get(`${environment.api}chats/pedidos/`+chat_id+`?token=`+items)
				    .toPromise()
				    .then(
					data => {
						this.datos = data;
						this.mensajes = this.datos.chat.mensajes;
						console.log(this.mensajes); 
						for (var i = 0; i < this.mensajes.length; ++i) {
							this.mensajes[i].userAvatar = this.mensajes[i].emisor.imagen;
						}
						observer.next(this.mensajes);
						observer.complete();
					},
					msg => {
						observer.error(msg.error);
						observer.complete();
					}); 
			  	};
			});
 		});
	}

	sendMsg(msg: ChatMessage) {
		return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
		.then(() => this.mockNewMsg(msg));
	}

	getUserInfo(usuario): Promise<UserInfo> {
		const userInfo: UserInfo = {
		  id: usuario.id,
		  avatar: usuario.imagen
		};
		return new Promise(resolve => resolve(userInfo));
	}
}