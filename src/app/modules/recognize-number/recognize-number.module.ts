import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImgPreviewComponent } from './img-preview/img-preview.component';
import { RecognizeNumberTrainComponent } from './recognize-number-train/recognize-number-train.component';

@NgModule({
  declarations: [
    ImgPreviewComponent,
    RecognizeNumberTrainComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RecognizeNumberModule { }
