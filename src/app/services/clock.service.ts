import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from './game.service';
import { Colors } from '../models/colors.enum';
import { OnlineGameService } from './online-game.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  private interval$: Observable<number>;
  private destroy$ = new Subject<void>();

  private gameEnded:boolean = false;

  private whiteTimeSubject = new BehaviorSubject<number>(0);
  private blackTimeSubject = new BehaviorSubject<number>(0);

  public whiteTime$: Observable<number> = this.whiteTimeSubject.asObservable();
  public blackTime$: Observable<number> = this.blackTimeSubject.asObservable();

  constructor(private gameSerivce:GameService,
              private onlineGameService:OnlineGameService,
              private socket:SocketService) {
    this.interval$ = interval(1000); 
    this.onlineGameService.gameEnded.subscribe(ended =>{
      this.gameEnded = ended;
    })
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
      });
     
      if(this.whiteTimeSubject.value == 0 || this.blackTimeSubject.value == 0)
      this.destroy$.next();
      
  }

  startClocksOnline(): void {
    this.whiteTimeSubject.next(600000);
    this.blackTimeSubject.next(600000);
   if(this.onlineGameService.playerColor == Colors.White){
    this.interval$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

        if(this.gameEnded)
        this.pauseClocks();
        
        let currentPlayer = this.onlineGameService.getCurrentPlayer()
        if(currentPlayer == Colors.White)
          this.whiteTimeSubject.next(this.whiteTimeSubject.value - 500);
        if(currentPlayer == Colors.Black)  
          this.blackTimeSubject.next(this.blackTimeSubject.value - 500);

        this.socket.emitTime(this.whiteTimeSubject.value,this.blackTimeSubject.value);  
          
        if(this.whiteTimeSubject.value <= 0 || this.blackTimeSubject.value <= 0){
          this.pauseClocks();  
          this.onlineGameService.endgame('time out');}
      });}
      else{
        this.socket.onTime().subscribe(time =>{
          this.whiteTimeSubject.next(time.whiteTime);
          this.blackTimeSubject.next(time.blackTime);
        })
      }
      
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
