// socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import  {io} from 'socket.io-client';
import { BoardMap, GameState } from '../models/game-state.model';
import { Pieces } from '../models/pieces.enum';
import { Colors } from '../models/colors.enum';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3000'); 
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
        console.log('joinedRoom')
      });
    });
  }

  emitTime(whiteTime:number,blackTime:number): void {
    this.socket.emit('time',{whiteTime,blackTime});
  }

  onTime(): Observable<{whiteTime:number,blackTime:number}> {
    return new Observable<{whiteTime:number,blackTime:number}>(observer => {
      this.socket.on('time', (obj: {whiteTime:number,blackTime:number}) => {
        observer.next(obj);
        console.log('time');
      });
    });
  }

  emitBoard(gameState: BoardMap): void {
    // Define the type of gameStateObject
    const gameStateObject: { [key: number]: [Pieces, Colors] } = Object.fromEntries(gameState);

    // Emit the gameStateObject
    this.socket.emit('board', "test");
    console.log(gameState);
  }
  

  onboard(): Observable<BoardMap> {
    return new Observable<BoardMap>(observer => {
      this.socket.on('board', (updatedGameState: BoardMap) => {
        observer.next(updatedGameState);
      });
    });
  }
}
