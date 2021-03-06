import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecognizaWithUndefinedComponent } from './recogniza-with-undefined/recogniza-with-undefined.component';

@NgModule({
  declarations: [
    RecognizaWithUndefinedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class RecognizaWithUndefinedModule { }
