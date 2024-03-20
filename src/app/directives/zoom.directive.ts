/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[jvZoom]',
})
export class ZoomDirective {
  @Input() zoomScale: number = 15;

  @Input() zoomMax: number = 31;

  @Input() zoomMin: number = 15;

  @Input('appZoom') zoomDirection: 'in' | 'out' = 'in'; 

  @Input() zoomTarget!: HTMLElement;

  constructor(private elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    this.zoomScale = parseInt(this.zoomTarget.style.fontSize) ? parseInt(this.zoomTarget.style.fontSize) : 15
    if(this.zoomDirection == 'in' && this.zoomMax > this.zoomScale)
    this.zoomScale += 2;
    if(this.zoomDirection == 'out' && this.zoomMin < this.zoomScale)
    this.zoomScale -= 2;

    this.zoom(this.zoomScale);
  }

  private zoom(scale: number) {
    this.zoomTarget.style.fontSize = `${scale}px`;
    console.log(scale)
  }
}
