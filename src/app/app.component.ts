import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angtensor';
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
    this.initTFModel();
    /**/
  }

  onAdd(): void {
    if (this.inputNumber < 0 || this.inputNumber > 9) {
      return;
    }
    const size = 10;
    const cn = document.createElement('canvas');
    cn.setAttribute('class', 'img-example');
    cn.width = size;
    cn.height = size;
    const cnt = cn.getContext('2d');
    // this.context.save()
    cnt.drawImage(this.canvasRef, 0, 0, size, size);
    document.body.appendChild(cn);
    // let line = [];
    const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const inputDataImg = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const img = cnt.getImageData(j, i, 1, 1).data;
        const pixel = img[3]; // > 0 ? 1 : 0;
        inputDataImg.push(pixel / 255);
      }
    }
    // inputDataImg.push(line);
    // console.table(inputDataImg);
    cn.remove();
    outPut[this.inputNumber] = 1;

    this.inputData.push(inputDataImg);
    this.outputData.push(outPut);
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

  onTryTrain(): void {
    console.log('inputData:', this.inputData);
    console.log('outputData:', this.outputData);
    const countExamples = this.inputData.length;

    // const t = tf.layers.conv2d({kernelSize: [10, 10], filters: 1});
    const xs = [];
    const ys = [];
    this.inputData.forEach((el, index) => {
      xs.push(tf.tensor2d(this.inputData[index], [100, 1], 'float32'));
      ys.push(tf.tensor2d(this.outputData[index], [10, 1], 'float32'));
    });
    console.log('Train');
    // tf.stack(xs)
    this.model.fit(xs, ys, { epochs: 10 }).then((ev) => {
      console.log('+++++++', ev);
      // Use the model to do inference on a data point the model hasn't seen before:
      //  const res = this.model.predict(tf.tensor2d([5], [1, 1])).toString();
      //  console.log('RES:', res);
      // Open the browser devtools to see the output
    });

  }

  initTFModel(): void {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense(
      { units: 20, inputShape: [100, 1], batchInputShape: [100, 1], inputDim: 10, activation: 'relu' }
    ));
    this.model.add(tf.layers.dropout({ rate: 0.5 }));
    // this.model.add(tf.layers.dense({ units: 10, batchInputShape: [1, 10] }));
    this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });
    // this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    console.log('RRRR', this.model.summary());
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