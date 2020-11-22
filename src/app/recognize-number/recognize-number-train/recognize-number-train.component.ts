import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

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

  private model: tf.Sequential;

  inputNumber: number;

  ngOnInit(): void {
    this.initCanvas();

    /**/
  }

  private loadImage(): number[]  {
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

  onAdd(): void {
    if (this.inputNumber < 0 || this.inputNumber > 9) {
      return;
    }

    const inputDataImg = this.loadImage();
    const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    outPut[this.inputNumber] = 1;

    this.inputData.push(inputDataImg);
    this.outputData.push(outPut);
  }

  onGenerate(): void {
    const fontsCollection = ['serif', 'Arial', 'Verdana', 'system-ui', 'Verdana'];
    const fCount = fontsCollection.length;

    for (let k = 0; k < 5000; k++) {
      let num = Math.floor(Math.random() * 10);
      if (num === 10) {
        num = 9;
      }
      const shiftX = Math.floor(Math.random() * 2);
      const shiftY = Math.floor(Math.random() * 2);

      const size = 10;
      const cn = document.createElement('canvas');
      cn.setAttribute('class', 'img-example');
      cn.width = size;
      cn.height = size;
      const cnt = cn.getContext('2d');

      const font = fontsCollection[Math.round(Math.random() * fCount)];
      cnt.font = '10px ' + font;
      cnt.fillText(num + '', shiftX, 10 - shiftY);
      document.body.appendChild(cn);

      const inputDataImg = [];
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const img = cnt.getImageData(j, i, 1, 1).data;
          const pixel = img[3]; // > 0 ? 1 : 0;
          inputDataImg.push(pixel / 255);
        }
      }
      this.inputData.push(inputDataImg);
      const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      outPut[num] = 1;
      this.outputData.push(outPut);
      cn.remove();
    }
  }

  onSave(): void {
    const inputToString = JSON.stringify(this.inputData);
    const outputToString = JSON.stringify(this.outputData);
    if (inputToString) {
      window.localStorage.setItem('input', inputToString);
      window.localStorage.setItem('output', outputToString);
    }
  }

  onLoad(): void {
    const input = window.localStorage.getItem('input');
    const output = window.localStorage.getItem('output');
    this.inputData = JSON.parse(input);
    this.outputData = JSON.parse(output);
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
  onExport(): void {
    const input = window.localStorage.getItem('input');
    const output = window.localStorage.getItem('output');
    this.exportString(input, 'input.txt');
    this.exportString(output, 'output.txt');
  }

  onImport(): void {

  }

  initTFModel(): void {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense(
      { units: 25, inputShape: [100], /*batchInputShape: [ 100, 1], */ /*inputDim: 1,*/ activation: 'relu' }
    ));
    // this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    this.model.add(tf.layers.dropout({ rate: 0.5 }));
    this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });
    console.log('RRRR', this.model.summary());
  }

  onTryTrain(): void {
    this.initTFModel();
    const inputList = [...this.inputData];
    const outputList = [...this.outputData];
    const countTest = 50;
    const countExamples = inputList.length - countTest;

    const xs = tf.tensor2d(inputList.splice(0, countExamples), [countExamples, 100], 'float32');
    const ys = tf.tensor2d(outputList.splice(0, countExamples), [countExamples, 10], 'float32');

    const xsTest = tf.tensor2d(inputList, [countTest, 100], 'float32');
    const ysTest = tf.tensor2d(outputList, [countTest, 10], 'float32');
    console.log('-----Train-----');
    this.model.fit(xs, ys, {
      epochs: 2500,
      batchSize: 100,
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

  onGo(): void {
    const img = this.loadImage();
    const xs = tf.tensor2d([img], [1, 100], 'float32');
    const res = this.model.predict(xs).toString();
    console.log('RESULT:', res);
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

  onDo(): void {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 100, activation: 'relu', inputShape: [10] }));
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    const xs = tf.randomNormal([100, 10]);
    const ys = tf.randomNormal([100, 1]);
    console.log('RR:', xs.print());
    console.log('TT', ys.print());
    return;
    model.fit(xs, ys, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
      }
    });
  }

}
