import { Component, OnInit } from '@angular/core';
import { Pieces } from 'src/app/models/pieces.enum';
import { GameService } from 'src/app/services/game.service';

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

  constructor(private gameService:GameService) { }

  ngOnInit(): void {
    this.gameService.piecesTakenByBlack$.subscribe(pieces => {
        this.piecesTakenByBlack = pieces ;
        this.calculatePointsDiffrence()
    });

    this.gameService.piecesTakenByWhite$.subscribe(pieces => {
      this.piecesTakenByWhite = pieces ;
      this.calculatePointsDiffrence()
  });
    
  }

  calculatePointsDiffrence(){
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
