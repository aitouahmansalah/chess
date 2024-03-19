/* eslint-disable max-len */
// socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';
import { BoardMap, GameState } from '../models/game-state.model';
import { Pieces } from '../models/pieces.enum';
import { Colors } from '../models/colors.enum';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private router:Router) {
    const access_token = localStorage.getItem('access_token');
    this.socket = io('http://localhost:3000',{
      query: {
        access_token: access_token
      }
    }); 
  }

  emitGameState(gameState: GameState): void {
    const boardObject: { [key: number]: [Pieces, Colors] } = Object.fromEntries(gameState.board);
    
    const state: { [key: number]: string } = Object.fromEntries(
      gameState.history.map((entry, index) => [index, JSON.stringify(Array.from(entry.state.entries()))])
    );
  
  
    this.socket.emit('move', {gameState,boardObject,state});
  }

  onGameStateUpdate(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('move', (updatedGameState: any) => {
        observer.next(updatedGameState);
        console.log('recived')
      });
    });
  }

  onjoinedRoom(): Observable<{roomId:string,player:number}>{
    return new Observable<{roomId:string,player:number}>(observer => {
      this.socket.on('joinedRoom', (obj: {roomId:string,player:number}) => {
        observer.next(obj);
      });
    });
  }

  emitTime(whiteTime:number,blackTime:number): void {
    this.socket.emit('time',{whiteTime,blackTime});
  }

  emitUser(username : string){
    this.socket.emit('joined',username);
  }

  emitMessage(message : string , user : User){
    const date = new Date();
    this.socket.emit('message',{message , user , date });
  }

  onmessage(): Observable<{message : string , user : User , date : Date}>{
    return new Observable<{message : string , user : User , date : Date}>(observer => {
      this.socket.on('message', (obj: {message : string , user : User , date : Date}) => {
        observer.next(obj);
      });
    });
  }

  onUser():Observable<string>{
    return new Observable<string>(observer => {
      this.socket.on('joined', (obj: string) => {
        observer.next(obj);
      });
    });
  }

  onTime(): Observable<{whiteTime:number,blackTime:number}> {
    return new Observable<{whiteTime:number,blackTime:number}>(observer => {
      this.socket.on('time', (obj: {whiteTime:number,blackTime:number}) => {
        observer.next(obj);
        console.log('time');
      });
    });
  }

  onDesconnect():Observable<string>{
    return new Observable<string>(observer => {
      this.socket.on('disconnect', (obj: string) => {
        observer.next(obj);
        console.log('disconnected');
      });
    });
  }
  

}
