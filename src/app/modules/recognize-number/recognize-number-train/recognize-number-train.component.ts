import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { SimbolImageGeneratorService } from 'src/app/services/simbol-image-generator.service';

@Component({
  selector: 'app-recognize-number-train',
  templateUrl: './recognize-number-train.component.html',
  styleUrls: ['./recognize-number-train.component.css']
})
export class RecognizeNumberTrainComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private canvasRef: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  public inputData = [];
  public outputData = [];

  public showGeneratedItems = true;

  public generatedItems = 500;
  public itemsForValidation = 50;
  public epochs = 500;
  public batchSize = 20;

  private model: tf.Sequential;

  inputNumber: string;

  constructor(
    private simbolImageGeneratorService: SimbolImageGeneratorService
  ) {}

  ngOnInit(): void {
    this.initCanvas();
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

  onGenerateDataForTraining(): void {
    for (let k = 0; k < this.generatedItems; k++) {
      let num = Math.floor(Math.random() * 10);
      if (num === 10) {
        num = 9;
      }
      const inputDataImg = this.simbolImageGeneratorService.getImageData(num);
      this.inputData.push(inputDataImg);
      const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      outPut[num] = 1;
      this.outputData.push(outPut);
    }
  }

  initTFModel(): void {
    this.model = tf.sequential();
    // 'elu' | 'hardSigmoid' | 'linear' | 'relu' | 'relu6' | 'selu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'tanh'
    this.model.add(tf.layers.dense(
      { units: 25, inputShape: [100], /*batchInputShape: [ 100, 1], */ /*inputDim: 1,*/ activation: 'relu' }
    ));
    // this.model.add(tf.layers.dense({ units: 16, activation: 'tanh' }));
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
    const inputList = [...this.inputData];
    const outputList = [...this.outputData];
    const countTest = this.itemsForValidation;
    const countExamples = inputList.length - countTest;

    const xs = tf.tensor2d(inputList.splice(0, countExamples), [countExamples, 100], 'float32');
    const ys = tf.tensor2d(outputList.splice(0, countExamples), [countExamples, 10], 'float32');

    const xsTest = tf.tensor2d(inputList, [countTest, 100], 'float32');
    const ysTest = tf.tensor2d(outputList, [countTest, 10], 'float32');

    console.log('----------------Start Training-----------------');
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
  }

  onGo(): void {
    const img = this.loadImage();
    const xs = tf.tensor2d([img], [1, 100], 'float32');
    const res = this.model.predict(xs).toString();
    console.log('RESULT:', res);
  }

  onGoInput(): void {
    const value = this.inputNumber;
    const data = this.simbolImageGeneratorService.getImageData(value, true);
    const xs = tf.tensor2d([data], [1, 100], 'float32');
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
