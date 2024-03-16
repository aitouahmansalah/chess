import { Component, OnInit } from '@angular/core';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-play-tab',
  templateUrl: './play-tab.component.html',
  styleUrls: ['./play-tab.component.scss']
})
export class PlayTabComponent implements OnInit {

  pgn : {whiteMove:string,blackMove:string}[] = [];

  constructor(private gameService:OnlineGameService) {}

  ngOnInit(): void {
    this.gameService.gameStateSubject.subscribe(game => {
      this.pgn = this.gameService.pgn;
    })
  }

}
