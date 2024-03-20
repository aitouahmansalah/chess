import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { BehaviorSubject, map, Observable, pluck } from 'rxjs';

import { BoardMap, GameState } from '../models/game-state.model';
import { Colors } from '../models/colors.enum';
import { Pieces } from '../models/pieces.enum';
import { HistoryMove, Move, MoveActions } from '../models/move.model';
import {
  PromoteDialogComponent,
} from '../components/promote-dialog/promote-dialog.component';
import { boardInitialPosition, squareNumber } from '../utils/board';
import { calculateLegalMoves, makeMove, promote } from '../utils/moves';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  index = new BehaviorSubject<number>(0);

  pgn : {whiteMove:string,blackMove:string}[] = [];

   gameStateSubject = new BehaviorSubject<GameState>({
    board: boardInitialPosition,
    active: Colors.White,
    history: [{
      count: 0,
      from: 0,
      to: 0,
      action: null as unknown as MoveActions,
      state: boardInitialPosition,
    }],
    availableMoves: [],
    piecesTakenByWhite: [], 
    piecesTakenByBlack: [],
  });

  constructor(private auth:AuthService,private http:HttpClient) {
    this.index.subscribe(index => {
      const board = this.gameStateSubject.value.history[index].state;
      const game = {...this.gameStateSubject.value,board}
      this.gameStateSubject.next(game);
    });

  }

  get activeColor$(): Observable<Colors> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('active'));
  }

  get availableMoves$(): Observable<Move[]> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('availableMoves'));
  }

  get selectedSquare$()
    : Observable<{ rank: number, file: number } | null | undefined> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('selectedSquare'));
  }

  get piecesTakenByBlack$(): Observable<(Pieces[]|undefined)> {
    return this.gameStateSubject.asObservable()
      .pipe(
        map(gameState => gameState.piecesTakenByBlack)
      );
  }

  get piecesTakenByWhite$(): Observable<(Pieces[]|undefined)> {
    return this.gameStateSubject.asObservable()
      .pipe(
        map(gameState => gameState.piecesTakenByWhite)
      );
  }

  getCurrentPlayer(){
    return this.gameStateSubject.value.active
  }

  getPieceInSquare$(rank: number, file: number)
    : Observable<[Pieces, Colors] | undefined> {
    const square = squareNumber(rank, file);

    return this.gameStateSubject.asObservable()
      .pipe(map(({ board }) => board.get(square)));
  }

  init(png:any,gameState:GameState){
    this.pgn = png;
    this.gameStateSubject.next(gameState);
  }

  getGame(id:string){
    this.http.get('http://localhost:3333/api/game/'+id).subscribe((game:any) => {
      const gameState = game.gameState
      console.log(game);
      const boardEntries: [number, [Pieces, Colors]][] = Object.entries(gameState.boardObject)
        .map(([key, value]): [number, [Pieces, Colors]] => [parseInt(key), value as [Pieces, Colors]]);
      const board = new Map(boardEntries);
      const originalStates: Map<number, Map<number, [Pieces, Colors]>> = new Map<number, Map<number, [Pieces, Colors]>>();
      Object.entries(gameState.state).forEach(([index, jsonString]) => {
      if (typeof jsonString === 'string') {
      const stateMap = new Map<number, [Pieces, Colors]>(JSON.parse(jsonString));
      originalStates.set(parseInt(index), stateMap);
      }})
    
      const updatedGameState = { ...gameState.gameState, board };
      updatedGameState.history.forEach((entry:HistoryMove) => {
      const index = entry.count;
      if (originalStates.has(index)) {
        entry.state = originalStates.get(index) as BoardMap;
      }
    });
    this.gameStateSubject.next(updatedGameState);
    console.log(updatedGameState)
    this.historyToPgn(updatedGameState.history);
      this.index.next(updatedGameState.history.length -1 );
  })}

  historyToPgn(history: HistoryMove[]) {
    this.pgn = [];

    history.forEach((move, index) => {
            let whiteMove : string ;
            let blackMove : string;
            let piece = move.state.get(move.to)?.[0]
            let color = move.state.get(move.to)?.[1]
        if (move.action === MoveActions.Move ) {
          if( color == Colors.White && !(piece==Pieces.Pawn && move.to <8))  {
            whiteMove = this.getPieceAcronym(piece) + this.squareNumberToAlgebraic(move.from) + this.squareNumberToAlgebraic(move.to);
            this.pgn.push({whiteMove,blackMove:''})
          } 
          if (color == Colors.Black && !(piece==Pieces.Pawn && move.to >58)){
            blackMove = this.getPieceAcronym(piece) + this.squareNumberToAlgebraic(move.from) + this.squareNumberToAlgebraic(move.to);
            this.pgn[this.pgn.length - 1].blackMove = blackMove ;
          }  
        } else if (move.action === MoveActions.Capture ) {

          if(color == Colors.White && !(piece==Pieces.Pawn && move.to <8))  {
            whiteMove = this.getPieceAcronym(piece) + this.squareNumberToAlgebraic(move.from) + 'x' + this.squareNumberToAlgebraic(move.to);
            this.pgn.push({whiteMove,blackMove:''})
          } 
          if (color == Colors.Black && !(piece==Pieces.Pawn && move.to >58)){
            blackMove = this.getPieceAcronym(piece) + this.squareNumberToAlgebraic(move.from) + 'x' + this.squareNumberToAlgebraic(move.to);
            this.pgn[this.pgn.length - 1].blackMove = blackMove ;
          }  
        }  else if (move.action === MoveActions.Promote) {
             
             if(color == Colors.White  )  {
              whiteMove = this.squareNumberToAlgebraic(move.to) + '=' + this.getPieceAcronym(piece);
              this.pgn.push({whiteMove,blackMove:''})
            } 
            if (color == Colors.Black){
              blackMove = this.squareNumberToAlgebraic(move.to) + '=' + this.getPieceAcronym(piece);
              this.pgn[this.pgn.length - 1].blackMove = blackMove ;
            }  
            
        }else if (move.action === MoveActions.ShortCastle) {

          if(color == Colors.White)  {
            whiteMove = "O-O";
            this.pgn.push({whiteMove,blackMove:''})
          } 
          if (color == Colors.Black){
            blackMove = "O-O";
            this.pgn[this.pgn.length - 1].blackMove = blackMove ;
          } 
        }else if (move.action === MoveActions.LongCastle) {

          if(color == Colors.White)  {
            whiteMove = "O-O-O";
            this.pgn.push({whiteMove,blackMove:''})
          } 
          if (color == Colors.Black){
            blackMove = "O-O-O";
            this.pgn[this.pgn.length - 1].blackMove = blackMove ;
          } 
        }
        
    });
    
      if(this.gameStateSubject.value.winner == Colors.White)  {
        this.pgn[this.pgn.length - 1].whiteMove += '#' ;
      } 
      if (this.gameStateSubject.value.winner == Colors.Black){
      
        this.pgn[this.pgn.length - 1].blackMove += '#' ;
      } 
    
}

squareNumberToAlgebraic(squareNum: number): string {
    const rank = 8 - Math.floor((squareNum - 1) / 8);
    const file = String.fromCharCode(97 + ((squareNum - 1) % 8));
    return file + rank;
}



getPieceAcronym(piece: Pieces | undefined): string {
  switch (piece) {
    case Pieces.Knight:
      return 'N';
    case Pieces.Bishop:
      return 'B';
    case Pieces.Rook:
      return 'R';
    case Pieces.Queen:
      return 'Q';
    case Pieces.King:
      return 'K';
    default:
      return ''; 
  }
}


playMoveSound() {
  const audio = new Audio();
  audio.src = 'assets/sounds/play.mp3'; 
  audio.load();
  audio.play();
}

  
}
