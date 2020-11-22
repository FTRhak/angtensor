import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimbolImageGeneratorService {

  constructor() { }

  getImageData(value: any, displayRender = false): number[] {
    const fontsCollection = ['serif', 'Arial', 'Verdana', 'system-ui', 'Verdana'];
    const fCount = fontsCollection.length;
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
    cnt.fillText(value + '', shiftX, 10 - shiftY);
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
}
