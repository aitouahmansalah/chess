import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[jvZoom]'
})
export class ZoomDirective {

  @Input() zoomScale: number = 1.2;

  @Input() zoomMax: number = 30;

  @Input() zoomMin: number = 15;

  @Input('appZoom') zoomDirection: 'in' | 'out' = 'in'; 

  @Input() zoomTarget!:ElementRef;




  constructor(private elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    if(this.zoomDirection == 'in' && this.zoomMax > this.zoomScale)
    this.zoomScale += 4;
    if(this.zoomDirection == 'out' && this.zoomMin < this.zoomScale)
    this.zoomScale -= 4;
    this.zoom(this.zoomScale);
  }

  private zoom(scale: number) {
    this.zoomTarget.nativeElement.style.transform = `scale(${scale})`;
  }

}
