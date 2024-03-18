import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[jvZoom]'
})
export class ZoomDirective {

  @Input() zoomScale: number = 1.2;

  @Input('appZoom') zoomDirection: 'in' | 'out' = 'in'; 


  constructor(private elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    if(this.zoomDirection == 'in')
    this.zoomScale += 4;
    if(this.zoomDirection == 'out')
    this.zoomScale -= 4;
    this.zoom(this.zoomScale);
  }

  private zoom(scale: number) {
    this.elementRef.nativeElement.style.transform = `scale(${scale})`;
  }

}
