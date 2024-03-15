/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Colors } from 'src/app/models/colors.enum';
import { Pieces } from 'src/app/models/pieces.enum';
import { ClockService } from 'src/app/services/clock.service';
import { GameService } from 'src/app/services/game.service';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-game-online-board',
  templateUrl: './game-online-board.component.html',
  styleUrls: ['./game-online-board.component.scss'],
})
export class GameOnlineBoardComponent implements OnInit {

  pieceValues: { [key: string]: number } = {
    'Pawn': 1,
    'Knight': 3,
    'Bishop': 3,
    'Rook': 5,
    'Queen': 9
  };

  piecesTakenByWhite !: Pieces[] | undefined

  piecesTakenByBlack !: Pieces[] | undefined

  winnerByPoints !: string | undefined
  
  pointsDiffrence !: number

  wihteTime !: number

  blackTime !: number  

  activeColor !: Colors

  playerColor !: Colors

  opisatePlayerColor !: Colors;

  playeIsWhite !: boolean

  constructor(private gameService:OnlineGameService,
              private clockService:ClockService) { }

  ngOnInit(): void {
    this.gameService.piecesTakenByBlack$.subscribe(pieces => {
        this.piecesTakenByBlack = pieces ;
        this.calculatePointsDiffrence()
    });

    this.gameService.piecesTakenByWhite$.subscribe(pieces => {
      this.piecesTakenByWhite = pieces ;
      this.calculatePointsDiffrence()
  });
    
  this.gameService.gameStarted.subscribe(started =>{
    if (started){
    this.clockService.startClocksOnline();
    this.playerColor = this.gameService.playerColor; 
    this.opisatePlayerColor = this.playerColor == Colors.Black ? Colors.White : Colors.Black;
    this.playeIsWhite = this.playerColor == Colors.White;  
  }
  })
  

  this.clockService.blackTime$.subscribe(time => {
    this.blackTime = time
  });

  this.clockService.whiteTime$.subscribe(time => {
    this.wihteTime = time
  });

  this.gameService.activeColor$.subscribe(activeColor =>{
    this.activeColor = activeColor
  })
  }

  calculatePointsDiffrence():void{
    let whitePoints = 0;
    let blackPoints = 0;
    this.piecesTakenByBlack?.forEach(piece => {
      blackPoints += this.pieceValues[piece.toString()];
    });

    this.piecesTakenByWhite?.forEach(piece => {
      whitePoints += this.pieceValues[piece.toString()];
    });
    
    this.winnerByPoints = (whitePoints > blackPoints) ? 'White' : (whitePoints < blackPoints) ? 'Black' : undefined ;
    this.pointsDiffrence = Math.abs(whitePoints - blackPoints);
  }
}
