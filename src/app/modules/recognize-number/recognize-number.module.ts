import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecognizeNumberTrainComponent } from './recognize-number-train/recognize-number-train.component';

@NgModule({
  declarations: [
    RecognizeNumberTrainComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class RecognizeNumberModule { }
