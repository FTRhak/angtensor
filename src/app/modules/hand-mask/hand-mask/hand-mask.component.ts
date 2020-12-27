import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-hand-mask',
  templateUrl: './hand-mask.component.html',
  styleUrls: ['./hand-mask.component.css']
})
export class HandMaskComponent implements OnInit {
  input: File[] = [];
  output: File[] = null;

  private model: tf.Sequential;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeInput(ev: Event): void {
    this.input = (ev.target as any).files;
  }

  onChangeOutput(ev: Event): void {
    this.output = (ev.target as any).files;
  }

  initTFModel(): void {
    const size = 400;
    this.model = tf.sequential();
    this.model.add(tf.layers.conv2d({
      filters: 32,
      kernelSize: [3, 3],
      activation: 'relu',
      inputShape: [size, size, 1]
    }));
    this.model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: 'relu'
    }));
    this.model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    this.model.add(tf.layers.dropout({ rate: 0.25 }));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense(
      { units: 128, activation: 'relu' }
    ));
    this.model.add(tf.layers.dropout({ rate: 0.5 }));
    this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });
    console.log('Summary:: ', this.model.summary());
  }


  startTrain(): void {
    console.log('INPUT:', this.input);
    console.log('OUTPUT:', this.output);


  }

}
