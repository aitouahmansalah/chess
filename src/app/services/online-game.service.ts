import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { BehaviorSubject, map, Observable, pluck } from 'rxjs';

import { BoardMap, GameState } from '../models/game-state.model';
import { Colors } from '../models/colors.enum';
import { Pieces } from '../models/pieces.enum';
import { Move, MoveActions } from '../models/move.model';
import {
  PromoteDialogComponent,
} from '../components/promote-dialog/promote-dialog.component';
import { boardInitialPosition, rankAndFile, squareNumber } from '../utils/board';
import { calculateLegalMoves, makeMove, promote } from '../utils/moves';
import { SocketService } from './socket.service';
import { EndgameDialogComponent } from '../components/endgame-dialog/endgame-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class OnlineGameService {

  gameStarted : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  gameEnded : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  playerColor !: Colors;

  private gameStateSubject = new BehaviorSubject<GameState>({
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

    this.socket.onGameStateUpdate().subscribe(gameState => {
      const boardEntries: [number, [Pieces, Colors]][] = Object.entries(gameState.boardObject)
        .map(([key, value]): [number, [Pieces, Colors]] => [parseInt(key), value as [Pieces, Colors]]);
      const board = new Map(boardEntries);
      const updatedGameState = { ...gameState.gameState, board };
      this.gameStateSubject.next(updatedGameState);
      console.log(updatedGameState);
      if(updatedGameState.gameEnded) {this.gameended();console.log("test11")};
    });
    
    this.socket.onboard().subscribe(s =>{
      console.log(s);
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
        map(gameState => gameState.gameEnded)
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
  
    this.socket.emitGameState({
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
      piecesTakenByBlack : this.gameStateSubject.value.piecesTakenByBlack,
      piecesTakenByWhite : this.gameStateSubject.value.piecesTakenByWhite
    });
    
      
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
    this.dialog.open(EndgameDialogComponent,{
      data: {
        winner,
        winnerBy
      },
    })
  }

  gameended(){
    let {winner , winnerBy} = this.gameStateSubject.value;
    this.gameEnded.next(true);
    this.dialog.open(EndgameDialogComponent,{
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
  

}
