import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { RecognizeNumberModule } from './modules/recognize-number/recognize-number.module';
import { RecognizaWithUndefinedModule } from './modules/recogniza-with-undefined/recogniza-with-undefined.module';
import { RecognizeByConvModule } from './modules/recognize-by-conv/recognize-by-conv.module';
import { HandMaskModule } from './modules/hand-mask/hand-mask.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RecognizeNumberModule,
    RecognizaWithUndefinedModule,
    RecognizeByConvModule,
    HandMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
