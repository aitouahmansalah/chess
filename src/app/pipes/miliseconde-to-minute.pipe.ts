import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MilisecondeToMinutePipe'
})
export class MilisecondeToMinutePipe implements PipeTransform {
  transform(milliseconds: number): string {
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutesString}:${secondsString}`;
  }
}
