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
import { EndgameDialogComponent } from '../components/endgame-dialog/endgame-dialog.component';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ComputerGameService {
  
  gameStarted : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  gameEnded : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;

  pgn : {whiteMove:string,blackMove:string}[] = [];

  color : Colors = Colors.White

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

  constructor(private dialog: Dialog,private auth:AuthService,private http:HttpClient) {


    this.playerColor = Colors.White;
    this.gameStarted.next(true);

  
    this.index.subscribe(index => {
      const board = this.gameStateSubject.value.history[index].state;
      const game = {...this.gameStateSubject.value,board}
      this.gameStateSubject.next(game);
    })

    this.activeColor$.subscribe(color => {
      if(color != this.color){
        this.playMoveSound();
        this.color = color;
      }
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
    this.isCheckmate();
    if(!this.gameStateSubject.value.selectedSquare ){
    console.log(this.gameStateSubject.value);
    this.sendMove();}
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
  

  playMoveSound() {
    const audio = new Audio();
    audio.src = 'assets/sounds/play.mp3'; 
    audio.load();
    audio.play();
  }

  playMessageSound() {
    const audio = new Audio();
    audio.src = 'assets/sounds/message.mp3'; 
    audio.load();
    audio.play();
  }
  

  MapToObject(gameState:GameState){
    const boardObject: { [key: number]: [Pieces, Colors] } = Object.fromEntries(gameState.board);
    
    const state: { [key: number]: string } = Object.fromEntries(
      gameState.history.map((entry, index) => [index, JSON.stringify(Array.from(entry.state.entries()))])
    );
    return {state,boardObject,gameState};
  }

  getPlayerGames(id: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3333/api/game/user/${id}`);
  }

  
  convertToFEN(gameState: GameState): string {
    let fen = '';

    for (let rank = 1; rank <= 8; rank++) {
      let emptyCount = 0;
      for (let file = 1; file <= 8; file++) {
        const piece = gameState.board.get(squareNumber(rank, file));
        console.log(squareNumber(rank, file),rank,file)
        if (!piece) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += this.encodePiece(piece[0], piece[1]);
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if ( rank < 8) {
        fen += '/';
      }
    }

    
    fen += ' b' ;

    
    fen += ' - - 0 1';

    return fen;
  }

  private encodePiece(piece: Pieces, color: Colors): string {
    const pieceMap: { [key in Pieces]: string } = {
      [Pieces.Pawn]: 'p',
      [Pieces.Knight]: 'n',
      [Pieces.Bishop]: 'b',
      [Pieces.Rook]: 'r',
      [Pieces.Queen]: 'q',
      [Pieces.King]: 'k',
    };
    return color === Colors.White ? pieceMap[piece].toUpperCase() : pieceMap[piece];
  }
  makeMoveFromResponse(response: any, gameState: GameState): GameState {
    if (response.success && response.bestmove) {
      const bestMoveString = response.bestmove.split(' ')[1]; 
      const [fromSquare, toSquare] = this.splitMoveString(bestMoveString)!;
      const fromsquare = this.squareNumberFromCoordinates(fromSquare)!;
      const tosquare = this.squareNumberFromCoordinates(toSquare)!;
      const action:boolean = !!gameState.board.get(tosquare)!;
      const activated = rankAndFile(fromsquare)!;
      const game = {...this.gameStateSubject.value}
      game.board.set(tosquare,game.board.get(fromsquare)!);
      game.board.delete(fromsquare);
      game.active = game.active == Colors.Black ? Colors.White : Colors.Black;
      const history:HistoryMove = {from:fromsquare,to:tosquare,action: action ? MoveActions.Capture : MoveActions.Move,state:game.board,count:game.history.length - 1};
      game.history.push(history) ;
      console.log(game);
      return game;
    } else {
      
      return gameState;
    }
  }

  sendMove() {
    const fen = this.convertToFEN(this.gameStateSubject.value);
    this.http.get(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=15`).subscribe(res =>{
      console.log(res);
      this.gameStateSubject.next(this.makeMoveFromResponse(res,this.gameStateSubject.value)) ;
    })
  }

  squareNumberFromCoordinates(coordinates: string): number | null {
    const file = coordinates.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const rank = 8 - parseInt(coordinates.charAt(1)) + 1;
    console.log(squareNumber(rank,file));
    
    if (file < 1 || file > 8 || rank < 1 || rank > 8) {
        return null; 
    }

    return squareNumber(rank,file);
}

splitMoveString(moveString: string): [string, string] | null {
  

  const fromSquare = moveString.substr(0, 2); // Extract the first two characters
  const toSquare = moveString.substr(2, 2);   // Extract the last two characters

  return [fromSquare, toSquare];
}


async calculateMove(fen:string){
  const url = 'https://chess-stockfish-16-api.p.rapidapi.com/chess/api';
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': '16dbe67ee5msh9692a7577fd6fbcp1ade46jsn767f1b86b9af',
		'X-RapidAPI-Host': 'chess-stockfish-16-api.p.rapidapi.com'
	},
	body: new URLSearchParams({
		fen: fen
	})
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
  const res = JSON.parse(result);
  console.log(res);
  return res;
	
} catch (error) {
	console.error(error);
}
}
}
