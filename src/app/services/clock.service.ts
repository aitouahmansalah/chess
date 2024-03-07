import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from './game.service';
import { Colors } from '../models/colors.enum';

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  private interval$: Observable<number>;
  private destroy$ = new Subject<void>();

  private whiteTimeSubject = new BehaviorSubject<number>(0);
  private blackTimeSubject = new BehaviorSubject<number>(0);

  public whiteTime$: Observable<number> = this.whiteTimeSubject.asObservable();
  public blackTime$: Observable<number> = this.blackTimeSubject.asObservable();

  constructor(private gameSerivce:GameService) {
    this.interval$ = interval(1000); // Update every second
  }

  startClocks(): void {
    this.whiteTimeSubject.next(600000);
    this.blackTimeSubject.next(600000);

    this.interval$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        let currentPlayer = this.gameSerivce.getCurrentPlayer()
        if(currentPlayer == Colors.White)
          this.whiteTimeSubject.next(this.whiteTimeSubject.value - 1000);
        if(currentPlayer == Colors.Black)  
          this.blackTimeSubject.next(this.blackTimeSubject.value - 1000);
          console.log(this.blackTimeSubject.value)
      });
      
  }

  pauseClocks(): void {
    this.destroy$.next();
  }

  resetClocks(): void {
    this.destroy$.next();
    this.whiteTimeSubject.next(0);
    this.blackTimeSubject.next(0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
