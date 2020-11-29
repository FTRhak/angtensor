import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPreviewComponent } from './img-preview/img-preview.component';



@NgModule({
  declarations: [
    ImgPreviewComponent
  ],
  exports: [
    ImgPreviewComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
