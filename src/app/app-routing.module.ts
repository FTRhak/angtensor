import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecognizaWithUndefinedComponent } from './modules/recogniza-with-undefined/recogniza-with-undefined/recogniza-with-undefined.component';
import { RecognizeByConvComponent } from './modules/recognize-by-conv/recognize-by-conv-train/recognize-by-conv.component';
import { RecognizeNumberTrainComponent } from './modules/recognize-number/recognize-number-train/recognize-number-train.component';

const routes: Routes = [
  {
    path: 'number',
    component: RecognizeNumberTrainComponent
  },
  {
    path: 'number-undefined',
    component: RecognizaWithUndefinedComponent
  },
  {
    path: 'number-conv',
    component: RecognizeByConvComponent
  },
  {
    path: '',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
