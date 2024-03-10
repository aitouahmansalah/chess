import { Component, OnInit } from '@angular/core';
import { Colors } from 'src/app/models/colors.enum';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-online-board',
  templateUrl: './online-board.component.html',
  styleUrls: ['./online-board.component.scss']
})
export class OnlineBoardComponent implements OnInit {

   boardDirectionArray = new Array(8).fill(0).map((_, i) => i + 1);

  playerColor !: string;

  constructor(private gameService:OnlineGameService) { }

  ngOnInit(): void {
    this.gameService.gameStarted.subscribe(started =>{
      if(started && this.gameService.playerColor == Colors.Black){
          this.playerColor = this.gameService.playerColor;
          this.boardDirectionArray = new Array(8).fill(0).map((_, i) => 8 - i) ;
      }
    })
  }

}
