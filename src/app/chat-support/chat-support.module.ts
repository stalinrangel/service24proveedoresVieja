import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ChatSupportPage } from './chat-support.page';
import { RelativeTimePipeModule } from '../../pipe/relative-time.pipe.module';

const routes: Routes = [
  {
    path: '',
    component: ChatSupportPage
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
  declarations: [ChatSupportPage]
})
export class ChatSupportPageModule {}
