import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandMaskComponent } from './hand-mask/hand-mask.component';



@NgModule({
  declarations: [
    HandMaskComponent
  ],
  exports: [
    HandMaskComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HandMaskModule { }
