import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelativeTimePipe } from './relative-time.pipe';

const routes: Routes = [
  {
    path: '',
    component: RelativeTimePipe
  }
];

@NgModule({
  imports: [CommonModule],
  declarations: [RelativeTimePipe],
  exports: [RelativeTimePipe]
})
export class RelativeTimePipeModule {}
