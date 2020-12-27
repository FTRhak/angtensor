import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimbolImageGeneratorService {

  constructor() { }

  getImageData(value: any, displayRender = false, size = 10): number[] {
    const fontsCollection = ['serif', 'Arial', 'Verdana', 'system-ui', 'Verdana'];
    const fCount = fontsCollection.length;
    const shiftX = Math.floor(Math.random() * 2);
    const shiftY = Math.floor(Math.random() * 2);

    const cn = document.createElement('canvas');
    cn.setAttribute('class', 'img-example');
    cn.width = size;
    cn.height = size;
    const cnt = cn.getContext('2d');

    const font = fontsCollection[Math.round(Math.random() * fCount)];
    cnt.font = size + 'px ' + font;
    cnt.fillText(value + '', shiftX, size - shiftY);
    document.body.appendChild(cn);

    const inputDataImg = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const img = cnt.getImageData(j, i, 1, 1).data;
        const pixel = img[3]; // > 0 ? 1 : 0;
        inputDataImg.push(pixel / 255);
      }
    }
    if (!displayRender) {
      cn.remove();
    }
    return inputDataImg;
  }

  getImageData3D(value: any, displayRender = false, size = 10): number[][][] {
    const fontsCollection = ['serif', 'Arial', 'Verdana', 'system-ui', 'Verdana', 'Comic Sans MS'];
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    const fCount = fontsCollection.length;
    const shiftX = Math.floor(Math.random() * 2);
    const shiftY = Math.floor(Math.random() * 2);

    const cn = document.createElement('canvas');
    cn.setAttribute('class', 'img-example');
    cn.width = size;
    cn.height = size;
    const cnt = cn.getContext('2d');

    const font = fontsCollection[Math.round(Math.random() * fCount)];
    cnt.font = size + 'px ' + font;
    cnt.fillText(value + '', shiftX, size - shiftY);
    cnt.fillStyle = colors[Math.round(Math.random() * colors.length)];
    document.body.appendChild(cn);

    const inputDataImg = [];
    let line;
    for (let i = 0; i < size; i++) {
      line = [];
      for (let j = 0; j < size; j++) {
        const img = cnt.getImageData(j, i, 1, 1).data;
        const pixel = img[3]; // > 0 ? 1 : 0;
        line.push([pixel / 255]);
      }
      inputDataImg.push(line);
    }
    if (!displayRender) {
      cn.remove();
    }
    return inputDataImg;
  }

  renderImage(value: number[], sizeW = 0, sizeH = 0) {
    const cn = document.createElement('canvas');
    cn.setAttribute('class', 'img-example image-size-' + sizeW + '-' + sizeH);
    cn.width = sizeW;
    cn.height = sizeH;
    const cnt = cn.getContext('2d');
    document.body.appendChild(cn);
    const imagedata = cnt.createImageData(sizeW, sizeH);
    const min = Math.min(...value);
    const max = 1 / Math.max(...value);

    for (let i = 0; i < sizeW * sizeH; i++) {
      const pixelindex = i * 4;
      imagedata.data[pixelindex] = ((value[i] - min) * max) * 255;
      imagedata.data[pixelindex + 1] = 10;
      imagedata.data[pixelindex + 2] = 12;
      imagedata.data[pixelindex + 3] = 255;
    }
    cnt.putImageData(imagedata, 0, 0);
  }
}
