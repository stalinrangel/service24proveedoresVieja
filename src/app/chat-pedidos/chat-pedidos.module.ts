import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ChatPedidosPage } from './chat-pedidos.page';
import { RelativeTimePipeModule } from '../../pipe/relative-time.pipe.module';

const routes: Routes = [
  {
    path: '',
    component: ChatPedidosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelativeTimePipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatPedidosPage]
})
export class ChatPedidosPageModule {}
