import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { SimbolImageGeneratorService } from 'src/app/services/simbol-image-generator.service';

@Component({
  selector: 'app-recogniza-with-undefined',
  templateUrl: './recogniza-with-undefined.component.html',
  styleUrls: ['./recogniza-with-undefined.component.css']
})
export class RecognizaWithUndefinedComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private canvasRef: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  public inputData = [];
  public outputData = [];

  public showGeneratedItems = false;

  public generatedItems = 5000;
  public itemsForValidation = 500;
  public epochs = 400;
  public batchSize = 100;

  private model: tf.Sequential;

  inputNumber: number;

  constructor(
    private simbolImageGeneratorService: SimbolImageGeneratorService
  ) {}


  ngOnInit(): void {
    this.initCanvas();
  }

  onGenerateDataForTraining(): void {
    const undefinedItems = ['a', 'd', 't', '+', 'y', '-', 'f', 'w', 'v', '=', 'z', 'x', 's', '.', '^', 'r'];
    console.log('Start generating data');
    for (let k = 0; k < this.generatedItems; k++) {
      let num: any = Math.floor(Math.random() * 13);
      let answer = num;
      if (num >= 10) {
        const index = Math.round(Math.random() * (undefinedItems.length - 1));
        num = undefinedItems[index];
        answer = 10;
      }
      const inputDataImg = this.simbolImageGeneratorService.getImageData(num);
      this.inputData.push(inputDataImg);
      const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      outPut[num] = 1;
      this.outputData.push(outPut);
    }
    console.log('Completed generating data');
  }

  exportString(content: string, file: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', file);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  initTFModel(): void {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense(
      { units: 25, inputShape: [100], /*batchInputShape: [ 100, 1], */ /*inputDim: 1,*/ activation: 'relu' }
    ));
    // this.model.add(tf.layers.dense({ units: 15, activation: 'relu' }));
    this.model.add(tf.layers.dropout({ rate: 0.5}));
    this.model.add(tf.layers.dense({ units: 11, activation: 'softmax' }));

    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });
    console.log('Summary:: ', this.model.summary());
  }

  onTryTrain(): void {
    this.initTFModel();
    const inputList = [...this.inputData];
    const outputList = [...this.outputData];
    const countTest = this.itemsForValidation;
    const countExamples = inputList.length - countTest;

    const xs = tf.tensor2d(inputList.splice(0, countExamples), [countExamples, 100], 'float32');
    const ys = tf.tensor2d(outputList.splice(0, countExamples), [countExamples, 11], 'float32');

    const xsTest = tf.tensor2d(inputList, [countTest, 100], 'float32');
    const ysTest = tf.tensor2d(outputList, [countTest, 11], 'float32');
    console.log('-----Train-----');
    this.model.fit(xs, ys, {
      epochs: this.epochs,
      batchSize: this.batchSize,
      validationData: [xsTest, ysTest],
      callbacks: {
        onEpochEnd: (epoch, log) => {
          console.log(`Epoch ${epoch}: loss = ${log.loss}  val_loss = ${log.val_loss}  acc = ${log.acc}   val_acc = ${log.val_acc}`);
        }
      }
    }).then((ev) => {
      console.log('History::', ev);
    });

    // const score = this.model.evaluate(xsTest, ysTest, {verbose: 0 });
    // console.log('SCORE:', score);
  }

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
    const res: any = this.model.predict(xs);
    const resArray = res.arraySync();
    let output = -1;
    let vl = 0;
    for (let i = 0; i < resArray[0].length; i++) {
      if (resArray[0][i] > vl) {
        vl = resArray[0][i];
        output = i;
      }
    }
    console.log('RESULT OUTPUT:', output);
  }

  onGoInput(): void {
    const value = this.inputNumber;
    const data = this.simbolImageGeneratorService.getImageData(value, true);
    const xs = tf.tensor2d([data], [1, 100], 'float32');
    const res: any = this.model.predict(xs);
    const resArray = res.arraySync();
    console.log('RESULT: ', resArray);
    let output = -1;
    let vl = 0;
    for (let i = 0; i < resArray[0].length; i++) {
      if (resArray[0][i] > vl) {
        vl = resArray[0][i];
        output = i;
      }
    }
    console.log('INPUT: ', value, '    OUTPUT: ', output);
  }
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
