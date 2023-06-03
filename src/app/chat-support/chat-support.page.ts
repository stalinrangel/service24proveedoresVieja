import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, IonContent } from '@ionic/angular';
import { ChatServiceService, ChatMessage, UserInfo } from "../../services/chat-service/chat-service.service";
import { OneSignal } from '@ionic-native/onesignal';
import { StorageService } from '../../services/storage/storage.service';
import { ObjectserviceService } from '../../services/objetcservice/objectservice.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RefreshService } from '../../services/refresh/refresh.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.page.html',
  styleUrls: ['./chat-support.page.scss'],
})
export class ChatSupportPage implements OnInit {

	@ViewChild(IonContent) content: IonContent;
	@ViewChild('chat_input') messageInput: ElementRef;
	msgList: ChatMessage[] = [];
	user: UserInfo;
	toUser: UserInfo;
	editorMsg = '';
	loading: any;
	showEmojiPicker = false;

	public usuario: any;
	public data: any;
	public datos: any;
	public admin_id: string = '';
	public chat_id: string = '';
	public token_notificacion: string = '';
	public send_msg = {
		emisor_id: 0,
	  	receptor_id: 0,
	  	msg: '',
	  	emisor: 'repartidor',
	  	token_notificacion: '',
	  	token: '',
	  	chat_id: '',
	  	ciudad_id: '',
	  	created_at: ''
	}
	private subscription: Subscription;

	constructor(
	public navCtrl: NavController,  
	private storage: StorageService, 
	public refresh: RefreshService,
	private objService: ObjectserviceService,
	public chatService: ChatServiceService,
	public cdr: ChangeDetectorRef,
	public loadingController: LoadingController,
	public http: HttpClient,
	public zone: NgZone
	) { 
		this.data = this.objService.getExtras();
		this.admin_id = this.data.admin_id;
		this.chat_id = this.data.chat_id;
		this.token_notificacion = this.data.token_notificacion;  
		this.storage.getObject('userRPSV24').then(items => {
			if (items != '' && items != null) {
				this.usuario = items;
				this.chatService.getUserInfo(this.usuario)
			    .then((res) => {
			      this.user = res
			    });
			} 
		});
		this.toUser = {
		  id: this.admin_id
		};
	}

	ngOnInit() {
	}

  	ionViewWillLeave() {
		this.subscription.unsubscribe();
	}

	ionViewDidEnter() {
		if (this.chat_id != '') {
			this.msgList = [];
			this.showLoading();
			this.getMsg();
		}		

		this.subscription = this.refresh.formRefreshSource$.subscribe((msg:any) => {
	    	let newMsg: ChatMessage = {
			  id: moment().format(),
			  emisor_id: parseInt(this.toUser.id),
			  userAvatar: msg.userAvatar,
			  receptor_id: parseInt(this.user.id),
			  created_at: moment().format(),
			  msg: msg.msg,
			  status: 2
			};
			this.pushNewMsg(newMsg);
			this.cdr.detectChanges();
	    });		
	}

	getMsg() {
	    return this.chatService.getMsgList(this.chat_id
	    	).subscribe(res => {
	        this.msgList = res;
	        this.scrollToBottom();
	        this.loading.dismiss();
	    });
	}

	onFocus() {
		this.scrollToBottom();
	}

	sendMsg() {
		if (!this.editorMsg.trim()) return;
		
		let newMsg: ChatMessage = {
		  id: moment().format(),
		  emisor_id: parseInt(this.user.id),
		  userAvatar: this.user.avatar,
		  receptor_id: parseInt(this.toUser.id),
		  created_at: moment().format(),
		  msg: this.editorMsg,
		  status: 1
		};

		this.pushNewMsg(newMsg);
		this.chatService.sendMsg(newMsg).then(() => {})
		this.sendMsgServer(this.editorMsg,newMsg.id);
		this.editorMsg = '';		 
	}

	sendMsgServer(msg,id){
		this.send_msg.emisor_id = parseInt(this.usuario.id);
		this.send_msg.receptor_id = parseInt(this.admin_id);
		this.send_msg.msg = msg;
		this.send_msg.token_notificacion = this.token_notificacion;
		this.send_msg.chat_id = this.chat_id;
		this.send_msg.ciudad_id = this.data.ciudad_id;
		this.send_msg.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

		this.storage.get('TRPSV24').then(items => {
  			if (items != '' && items != null) {
  				this.send_msg.token = items;
  				console.log(this.send_msg)
  				this.http.post(`${environment.api}chats/repartidores/mensaje`, this.send_msg)
			    .toPromise()
			    .then(
				data => {
					this.datos = data;
					this.chat_id = this.datos.chat.id;
					this.admin_id = this.datos.chat.admin_id;
					this.token_notificacion = this.datos.msg.token_notificacion;	
					let index = this.getMsgIndexById(id);
					if (index !== -1) {
					  this.msgList[index].status = 2;
					}
				},
				msg => {
					console.log(msg);
					let index = this.getMsgIndexById(id);
					if (index !== -1) {
					  this.msgList[index].status = 2;
					}
				}); 
		  	};
		});
	}

	pushNewMsg(msg: ChatMessage) {
		const userId = parseInt(this.user.id),
		toUserId = parseInt(this.toUser.id);
		
		if (msg.emisor_id === userId && msg.receptor_id === toUserId) {
		  this.msgList.push(msg);
		} else if (msg.receptor_id === userId && msg.emisor_id === toUserId) {
		  this.msgList.push(msg);
		}
		this.scrollToBottom();
	}

	getMsgIndexById(id: string) {
		return this.msgList.findIndex(e => e.id === id)
	}

	scrollToBottom() {
		this.zone.run(() => {
	      setTimeout(() => {
	        this.content.scrollToBottom(300);
	      });
	    });
	}

	private setTextareaScroll() {
		const textarea = this.messageInput.nativeElement;
		textarea.scrollTop = textarea.scrollHeight;
	}

	async showLoading() {
	    this.loading = await this.loadingController.create({
		  spinner: 'dots',
		  duration: 15000,
		  translucent: true,
		  cssClass: 'custom-class custom-loading'
		});
		return await this.loading.present();
	}
}
