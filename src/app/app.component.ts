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
    if (this.inputNumber < 0 || this.inputNumber > 9 ) {
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
    let line = [];
    const outPut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const inputDataImg = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const img = cnt.getImageData(j, i, 1, 1).data;
        const pixel = img[3]; // > 0 ? 1 : 0;
        line.push(pixel / 255);
      }
      inputDataImg.push(line);
      line = [];
    }
    // console.table(inputDataImg);
    cn.remove();
    outPut[this.inputNumber] = 1;

    this.inputData.push(inputDataImg);
    this.outputData.push(outPut);
  }

  onSave(): void {
    const inputToString = JSON.stringify(this.inputData);
    const outputToString = JSON.stringify(this.outputData);
    window.localStorage.setItem('input', inputToString);
    window.localStorage.setItem('output', outputToString);
  }

  onLoad(): void {
    const input = window.localStorage.getItem('input');
    const output = window.localStorage.getItem('output');
    this.inputData = JSON.parse(input);
    this.outputData = JSON.parse(output);
  }

  onTryTrain(): void {
    console.log('inputData:', this.inputData);
    console.log('outputData:', this.outputData);
    const countExamples = this.inputData.length;

    // const t = tf.layers.conv2d({kernelSize: [10, 10], filters: 1});
    const xs = [];
    const ys = [];
    this.inputData.forEach((el, index) => {
      xs.push(tf.tensor2d(this.inputData[index], [10, 10], 'float32'));
      ys.push(tf.tensor1d(this.outputData[index], 'float32'));
    });
    console.log('Train');
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
      { units: 100, inputShape: [10, 10], batchInputShape: [10, 10], inputDim: 10, activation: 'relu' }
    ));
    this.model.add(tf.layers.dense({ units: 10, batchInputShape: [1, 10] }));

    this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    console.log('RRRR', this.model.summary());
    // Generate some synthetic data for training.
    //const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    //const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // Train the model using the data.
    //this.model.fit(xs, ys, { epochs: 10 }).then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
    //  const res = this.model.predict(tf.tensor2d([5], [1, 1])).toString();
    //  console.log('RES:', res);
      // Open the browser devtools to see the output
    //});
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