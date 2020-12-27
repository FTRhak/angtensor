import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { SimbolImageGeneratorService } from '../../../services/simbol-image-generator.service';

@Component({
  selector: 'app-recognize-by-conv',
  templateUrl: './recognize-by-conv.component.html',
  styleUrls: ['./recognize-by-conv.component.css']
})
export class RecognizeByConvComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private canvasRef: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  public inputData = [];
  public outputData = [];

  public showGeneratedItems = false;

  public generatedItems = 500;
  public itemsForValidation = 100;
  public epochs = 20;
  public batchSize = 20;

  public imgSize = 28;

  private model: tf.Sequential;

  inputNumber: string;

  constructor(
    private simbolImageGeneratorService: SimbolImageGeneratorService
  ) { }

  ngOnInit(): void {
  }

  onGenerateDataForTraining(): void {
    console.log('Start generating data');
    for (let k = 0; k < this.generatedItems; k++) {
      let num = Math.floor(Math.random() * 10);
      if (num === 10) {
        num = 9;
      }
      const inputDataImg = this.simbolImageGeneratorService.getImageData3D(num, false, this.imgSize);
      this.inputData.push(inputDataImg);
      const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      outPut[num] = 1;
      this.outputData.push(outPut);
    }
    console.log('Completed generating data');
  }

  initTFModel(): void {
    const size = this.imgSize;
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

  onTryTrain(): void {
    this.initTFModel();
    const size = this.imgSize;
    const inputList = [...this.inputData];
    const outputList = [...this.outputData];
    const countTest = this.itemsForValidation;
    const countExamples = inputList.length - countTest;

    // console.log(inputList);
    // console.log(outputList);
    const xs = tf.tensor4d(inputList.splice(0, countExamples), [countExamples, size, size, 1], 'float32');
    const ys = tf.tensor2d(outputList.splice(0, countExamples), [countExamples, 10], 'float32');

    const xsTest = tf.tensor4d(inputList, [countTest, size, size, 1], 'float32');
    const ysTest = tf.tensor2d(outputList, [countTest, 10], 'float32');

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
      this.renderLeayrs(this.model, 0, 32, 9);
      this.renderLeayrs(this.model, 1, 8, 4);
      //this.renderLeayrs(this.model, 2, 10, 10); //18432
    });
  }

  private renderLeayrs(model, lNum = 0, sizeW: number, sizeH: number) {
    model.getWeights()[lNum].data().then(res => {
      console.log('NUM', lNum);
      console.log(res);
      this.simbolImageGeneratorService.renderImage(res, sizeW, sizeH);
    })
  }

  // ================RESULT======================
  private loadImage(): number[] {
    const size = 10;
    const cn = document.createElement('canvas');
    cn.setAttribute('class', 'img-example');
    cn.width = size;
    cn.height = size;
    const cnt = cn.getContext('2d');

    cnt.drawImage(this.canvasRef, 0, 0, size, size);
    document.body.appendChild(cn);
    const inputDataImg = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const img = cnt.getImageData(j, i, 1, 1).data;
        const pixel = img[3]; // > 0 ? 1 : 0;
        inputDataImg.push(pixel / 255);
      }
    }
    cn.remove();
    return inputDataImg;
  }

  onGo(): void {
    const img = this.loadImage();
    const xs = tf.tensor2d([img], [1, 100], 'float32');
    const res = this.model.predict(xs).toString();
    console.log('RESULT:', res);
  }

  onGoInput(): void {
    const value = this.inputNumber;
    const data = this.simbolImageGeneratorService.getImageData3D(value, true, 28);
    const xs = tf.tensor4d([data], [1, 28, 28, 1], 'float32');
    const res: any = this.model.predict(xs);
    const resArray = res.arraySync();
    console.log('RESULT: ', resArray);
    let output = 0;
    let vl = 0;
    for (let i = 0; i < resArray[0].length; i++) {
      if (resArray[0][i] > vl) {
        vl = resArray[0][i];
        output = i;
      }
    }
    console.log('INPUT: ', value, '    OUTPUT: ', output);
  }


  // ===========CANVAS===========
  initCanvas(): void {
    this.canvasRef = this.canvas.nativeElement;
    this.context = this.canvasRef.getContext('2d');
    this.context.lineCap = 'round';
    this.context.lineWidth = 10;
  }

  onCanvasMMove(e): void {
    const x = e.offsetX;
    const y = e.offsetY;
    const dx = e.movementX;
    const dy = e.movementY;

    // Проверяем зажата ли какая-нибудь кнопка мыши
    // Если да, то рисуем
    if (e.buttons > 0) {
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x - dx, y - dy);
      this.context.stroke();
      this.context.closePath();
    }
  }

  onClear(): void {
    this.context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
  }

}
