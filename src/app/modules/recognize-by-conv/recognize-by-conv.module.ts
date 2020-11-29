import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecognizeByConvComponent } from './recognize-by-conv-train/recognize-by-conv.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    RecognizeByConvComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class RecognizeByConvModule { }
