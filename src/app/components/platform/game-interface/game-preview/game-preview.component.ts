/* eslint-disable max-len */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EndgameDialogComponent } from 'src/app/components/endgame-dialog/endgame-dialog.component';
import { InitialiseDialogComponent } from 'src/app/components/initialise-dialog/initialise-dialog.component';
import { Colors } from 'src/app/models/colors.enum';
import { Pieces } from 'src/app/models/pieces.enum';
import { User } from 'src/app/models/user.model';
import { OnlineGameService } from 'src/app/services/online-game.service';
import { PreviewService } from 'src/app/services/preview.service';

@Component({
  selector: 'jv-game-preview',
  templateUrl: './game-preview.component.html',
  styleUrls: ['./game-preview.component.scss'],
})
export class GamePreviewComponent implements OnInit {

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

  playerColor !: Colors

  opisatePlayerColor !: Colors;

  playeIsWhite !: boolean;

  user!:User ;

  opposetUser!:User ;


  constructor(private gameService:PreviewService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const gameId = params.get('game-id')!;
      this.gameService.getGame(gameId);
      
    })

    this.gameService.started.subscribe(started => {
      if(started){
        this.user = this.gameService.user;
      this.opposetUser = this.gameService.oppostPlayer;
      this.opisatePlayerColor = this.gameService.gameStateSubject.value.winner == Colors.White ? Colors.Black : Colors.White
      this.playerColor = this.gameService.gameStateSubject.value.winner == Colors.White ? Colors.White : Colors.Black
      this.playeIsWhite = this.playerColor == Colors.White
      this.piecesTakenByBlack = this.gameService.gameStateSubject.value.piecesTakenByBlack
      this.piecesTakenByWhite = this.gameService.gameStateSubject.value.piecesTakenByWhite
      console.log(this.opposetUser)
      this.calculatePointsDiffrence();
      }
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