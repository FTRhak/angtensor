import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { from } from 'rxjs';

@Component({
  selector: 'app-hand-mask',
  templateUrl: './hand-mask.component.html',
  styleUrls: ['./hand-mask.component.css']
})
export class HandMaskComponent implements OnInit {
  input: File[] = [];
  output: File[] = [];

  inputMatrix = [];
  outputMatrix = [];

  public size = 400;
  public generatedItems = 1;
  public itemsForValidation = 1;
  public epochs = 20;
  public batchSize = 1;

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

  inputFileToMatrix(item: File, size: number): Promise<number[][]> {
    return new Promise(resolve => {
      const matrix = [];

      const cn = document.createElement('canvas');
      // document.body.appendChild(cn);
      cn.width = size;
      cn.height = size;
      const cnt = cn.getContext('2d');

      const url = URL.createObjectURL(item);
      const img = new Image();
      img.onload = () => {
        cnt.drawImage(img, 0, 0, this.size, this.size);

        // const imagedata = cnt.createImageData(size, size);
        for (let i = 0; i < size; i++) {
          const line = [];
          for (let j = 0; j < size; j++) {
            const imgData = cnt.getImageData(j, i, 1, 1).data;
            const pixelColor = Math.round((imgData[0] + imgData[1] + imgData[2]) / 3);
            line.push([pixelColor / 255]);

            /*
            const pixelindex = (i * size + j) * 4;
            imagedata.data[pixelindex] = pixelColor;
            imagedata.data[pixelindex + 1] = pixelColor;
            imagedata.data[pixelindex + 2] = pixelColor;
            imagedata.data[pixelindex + 3] = 255;
            /**/
          }
          matrix.push(line);
        }
        // cnt.putImageData(imagedata, 0, 0);
        resolve(matrix);
      };
      img.src = url;
    });
  }

  outputFileToMatrix(item: File, size: number): Promise<number[][]> {
    return new Promise(resolve => {
      const matrix = [];

      const cn = document.createElement('canvas');
      // document.body.appendChild(cn);
      cn.width = size;
      cn.height = size;
      const cnt = cn.getContext('2d');

      const url = URL.createObjectURL(item);
      const img = new Image();
      img.onload = () => {
        cnt.drawImage(img, 0, 0, this.size, this.size);

        // const imagedata = cnt.createImageData(size, size);
        for (let i = 0; i < size; i++) {
          const line = [];
          for (let j = 0; j < size; j++) {
            const imgData = cnt.getImageData(j, i, 1, 1).data;
            const pixelColor = Math.round((imgData[0] + imgData[1] + imgData[2]) / 3);
            line.push([pixelColor < 10 ? 0 : 1]);

            /*
            const pixelindex = (i * size + j) * 4;
            imagedata.data[pixelindex] = pixelColor;
            imagedata.data[pixelindex + 1] = pixelColor;
            imagedata.data[pixelindex + 2] = pixelColor;
            imagedata.data[pixelindex + 3] = 255;
            /* */
          }
          matrix.push(line);
        }
        // cnt.putImageData(imagedata, 0, 0);
        resolve(matrix);
      };
      img.src = url;
    });
  }

  loadData(): void {
    const size = this.size;
    Promise.all(
      Array.from(this.input).map((item: File) => this.inputFileToMatrix(item, size))
    ).then(res => {
      console.log('====RES INPUT====');
      this.inputMatrix = res;
    });

    Promise.all(
      Array.from(this.output).map((item: File) => this.outputFileToMatrix(item, size))
    ).then(res => {
      console.log('====RES OUTPUT====');
      this.outputMatrix = res;
    });
  }

  initTFModel(): void {
    const size = this.size;
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
    this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });
    console.log('Summary:: ', this.model.summary());
  }

  startTrain(): void {
    this.initTFModel();
    const size = this.size;
    const inputList = [...this.inputMatrix];
    const outputList = [...this.outputMatrix];
    const countTest = this.itemsForValidation;
    const countExamples = inputList.length - countTest;

    // console.log(inputList);
    // console.log(outputList);

    const xs = tf.tensor4d(inputList, [countExamples, size, size, 1], 'float32');
    const ys = tf.tensor4d(outputList, [countExamples, size, size, 1], 'float32');

    const xsTest = tf.tensor4d(inputList, [countExamples, size, size, 1], 'float32');
    const ysTest = tf.tensor4d(outputList, [countExamples, size, size, 1], 'float32');

    console.log('----------------Start Training-----------------');
    this.model.fit(xs, ys, {
      epochs: this.epochs,
      batchSize: this.batchSize,
      validationData: [xsTest, ysTest],
      // перемішує дані
      // shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          console.log(`Epoch ${epoch}: loss = ${log.loss}  val_loss = ${log.val_loss}  acc = ${log.acc}   val_acc = ${log.val_acc}`);
        },
        onTrainBegin: (qqq) => {
          console.log('--------------TrainBegin:', qqq);
        },
        onTrainEnd: (ttt) => {
          console.log('--------------TrainEnd:', ttt);
        }
      }
    }).then((ev) => {
      console.log('History::', ev);
      console.log('MODEL:', this.model);
      //this.renderLeayrs(this.model, 2, 10, 10); //18432
    });
  }

}
