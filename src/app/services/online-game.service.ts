/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

import { BehaviorSubject, map, Observable, pluck } from 'rxjs';

import { BoardMap, GameState } from '../models/game-state.model';
import { Colors } from '../models/colors.enum';
import { Pieces } from '../models/pieces.enum';
import { HistoryMove, Move, MoveActions } from '../models/move.model';
import {
  PromoteDialogComponent,
} from '../components/promote-dialog/promote-dialog.component';
import { boardInitialPosition, rankAndFile, squareNumber } from '../utils/board';
import { calculateLegalMoves, makeMove, promote } from '../utils/moves';
import { SocketService } from './socket.service';
import { EndgameDialogComponent } from '../components/endgame-dialog/endgame-dialog.component';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineGameService {
  gameStarted : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  gameEnded : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  pgn : {whiteMove:string,blackMove:string}[] = [];

  opposetUser !: User ;

  checkDialog !: DialogRef<unknown, EndgameDialogComponent>;

  playerColor !: Colors;

  index = new BehaviorSubject<number>(0);

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

  constructor(private dialog: Dialog,private socket:SocketService) {

    this.socket.onjoinedRoom().subscribe(obj =>{
       this.gameStarted.next(true) ;
       this.playerColor = (obj.player == 1) ? Colors.White : Colors.Black ;
    });

    this.socket.onDesconnect().subscribe(des => {
      this.endgame('resign');
    })

    this.socket.onGameStateUpdate().subscribe(gameState => {
      const boardEntries: [number, [Pieces, Colors]][] = Object.entries(gameState.boardObject)
        .map(([key, value]): [number, [Pieces, Colors]] => [parseInt(key), value as [Pieces, Colors]]);
      const board = new Map(boardEntries);
      const updatedGameState = { ...gameState.gameState, board };
      
      const originalStates: Map<number, Map<number, [Pieces, Colors]>> = new Map<number, Map<number, [Pieces, Colors]>>();
      Object.entries(gameState.state).forEach(([index, jsonString]) => {
      if (typeof jsonString === 'string') {
      const stateMap = new Map<number, [Pieces, Colors]>(JSON.parse(jsonString));
      originalStates.set(parseInt(index), stateMap);
    }
    });
    updatedGameState.history.forEach((entry:HistoryMove) => {
      const index = entry.count;
      if (originalStates.has(index)) {
        entry.state = originalStates.get(index) as BoardMap;
      }
    });

      console.log((originalStates));
      this.gameStateSubject.next(updatedGameState);
      if(updatedGameState.gameEnded) {this.gameended();console.log("test11")};
      this.historyToPgn(updatedGameState.history);
      this.index.next(updatedGameState.history.length -1 );
    });
  
    this.index.subscribe(index => {
      const board = this.gameStateSubject.value.history[index].state;
      const game = {...this.gameStateSubject.value,board}
      this.gameStateSubject.next(game);
    })
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

  get gameEnded$(): Observable<(boolean|undefined)> {
    return this.gameStateSubject.asObservable()
      .pipe(
        map(gameState => gameState.gameEnded),
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

  selectSquare(rank: number, file: number): void {
    let {
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
    } = this.gameStateSubject.value;
    const squareNum = squareNumber(rank, file);

    if (availableMoves.some(move => move.square === squareNum)) {
      const isPawnPromoting = this.checkIsPawnPromoting(
        board,
        squareNumber(selectedSquare!.rank, selectedSquare!.file),
        squareNum,
      );
      if (isPawnPromoting) {
        const dialog = this.dialog.open<Pieces>(
          PromoteDialogComponent,
          {
            disableClose: true,
            data: {
              color: active,
            },
          },
        );

        dialog.closed
          .subscribe(piece => {
            const {
              board,
              active,
              history,
            } = this.gameStateSubject.value;

            const { board: newBoard, entry } = promote(
              board,
              history,
              squareNum,
              piece!,
            );

            this.gameStateSubject.next({
              board: newBoard,
              active,
              history: [...history, entry],
              availableMoves: [],
              selectedSquare: null,
            });

            this.socket.emitGameState({
              board: newBoard,
              active,
              history: [...history, entry],
              availableMoves: [],
              selectedSquare: null,
            });
          });

          
      }

      const { board: newBoard, entry, capturedPiece } = makeMove(
        board,
        availableMoves,
        history,
        active,
        squareNum,
        selectedSquare!,
      );
      board = newBoard;
      history = [...history, entry];
      active = active === Colors.White ? Colors.Black : Colors.White;

        if(active === Colors.Black && capturedPiece)
          this.gameStateSubject.value.piecesTakenByWhite?.push(capturedPiece)
        if(active === Colors.White && capturedPiece)
          this.gameStateSubject.value.piecesTakenByBlack?.push(capturedPiece)

          
  

      availableMoves = [];
      selectedSquare = null;
    } else if (board.get(squareNum)?.[1] === active) {
      selectedSquare = { rank, file };
      availableMoves = calculateLegalMoves(board, history, rank, file);
     
    } else {
      selectedSquare = null;
      availableMoves = [];
      
    }

    this.gameStateSubject.next({
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
      piecesTakenByBlack : this.gameStateSubject.value.piecesTakenByBlack,
      piecesTakenByWhite : this.gameStateSubject.value.piecesTakenByWhite
    });
  if(history[history.length-1].action)
    this.socket.emitGameState({
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
      piecesTakenByBlack : this.gameStateSubject.value.piecesTakenByBlack,
      piecesTakenByWhite : this.gameStateSubject.value.piecesTakenByWhite
    });
    
      this.index.next(history.length - 1);
      this.historyToPgn(history);
   this.isCheckmate()
  } 

  private checkIsPawnPromoting(board: BoardMap,
                               selectedSquareNum: number,
                               toSelectSquareNum: number): boolean {
    return ((toSelectSquareNum >= 1 && toSelectSquareNum <= 8)
      || (toSelectSquareNum >= 57 && toSelectSquareNum <= 64))
      && board.get(selectedSquareNum)?.[0] === Pieces.Pawn;
  }

  endgame(winnerBy:string = ''){
    const winner = this.gameStateSubject.value.active == Colors.Black ? Colors.White : Colors.Black;
    const gameEnded = true;
    const game = {...this.gameStateSubject.value,winner,gameEnded,winnerBy} 
    this.gameStateSubject.next(game);
    this.socket.emitGameState(game);
    this.gameEnded.next(true);
    if(!this.checkDialog)
    this.checkDialog = this.dialog.open(EndgameDialogComponent,{
      data: {
        winner,
        winnerBy
      },
    })
  }

  gameended(){
    let {winner , winnerBy} = this.gameStateSubject.value;
    this.gameEnded.next(true);
    if(!this.checkDialog)
    this.checkDialog = this.dialog.open(EndgameDialogComponent,{
      data: {
        winner,
        winnerBy
      },
    })
  }

  isCheckmate() {
    const {
      board,
      active,
      history,
    } = this.gameStateSubject.value;
  
    for (const [key, [piece, color]] of board.entries()) {
      if (color === active) {
        const { rank, file } = rankAndFile(key)!;
        const legalMoves = calculateLegalMoves(board, history, rank, file);
        if (legalMoves.length > 0) {
          return  
        }
      }
    }
    console.log('checkmate');
    this.endgame('checkmate');
  }


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
      if(this.gameEnded){
        if(this.gameStateSubject.value.winner == Colors.White)  {
          this.pgn[this.pgn.length - 1].whiteMove += '#' ;
        } 
        if (this.gameStateSubject.value.winner == Colors.Black){
        
          this.pgn[this.pgn.length - 1].blackMove += '#' ;
        } 
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
  
  

}
