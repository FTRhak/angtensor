import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImgPreviewComponent } from './img-preview/img-preview.component';
import { RecognizaWithUndefinedComponent } from './recogniza-with-undefined/recogniza-with-undefined.component';

@NgModule({
  declarations: [
    ImgPreviewComponent,
    RecognizaWithUndefinedComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RecognizaWithUndefinedModule { }
