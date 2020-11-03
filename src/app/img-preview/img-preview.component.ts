import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.css']
})
export class ImgPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('cnv') cn: ElementRef;
  private size = 10;
  public answer: number = null;
  @Input() data: number[][] = [];
  @Input() set value(val: number[]) {
    val.forEach((el, index) => {
      if (el === 1) {
        this.answer = index;
      }
    });
  }
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const cn: HTMLCanvasElement = this.cn.nativeElement;
    cn.setAttribute('class', 'img-example');
    cn.width = this.size;
    cn.height = this.size;
    const context = cn.getContext('2d');
    context.lineCap = 'round';
    context.lineWidth = 1;

    const imagedata = context.createImageData(this.size, this.size);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const pixelindex = (i * this.size + j) * 4;
        const pixel = this.data[i][j];
        imagedata.data[pixelindex] = 0;
        imagedata.data[pixelindex + 1] = 0;
        imagedata.data[pixelindex + 2] = 0;
        imagedata.data[pixelindex + 3] = Math.round(pixel * 255);
      }
    }
    context.putImageData(imagedata as any, 0, 0);
  }

}
