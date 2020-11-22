import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { RecognizeNumberModule } from './modules/recognize-number/recognize-number.module';
import { RecognizaWithUndefinedModule } from './modules/recogniza-with-undefined/recogniza-with-undefined.module';

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
    RecognizaWithUndefinedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
