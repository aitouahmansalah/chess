/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { Colors } from 'src/app/models/colors.enum';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-play-tab',
  templateUrl: './play-tab.component.html',
  styleUrls: ['./play-tab.component.scss'],
})
export class PlayTabComponent implements OnInit {
  pgn : {whiteMove:string,blackMove:string}[] = [];

  index!: number;

  color!: Colors|undefined;

  constructor(private gameService:OnlineGameService) {}

  ngOnInit(): void {
    this.gameService.gameStateSubject.subscribe(game => {
      this.pgn = this.gameService.pgn;
    });
    this.gameService.index.subscribe(index => {
      this.index = index;
      let state = this.gameService.gameStateSubject.value.history[index];
      this.color = state.state.get(state.to)?.[1];
      console.log(this.color,this.index);
    })
  }

  resign(){
    this.gameService.endgame('resign');
  }

  back(){
    
    const index = this.gameService.index.value -1 ;
    if(  index > 0)
    this.gameService.index.next(index);
  }

  forward(){
    const index = this.gameService.index.value + 1;
    if(this.gameService.gameStateSubject.value.history.length > index)
    this.gameService.index.next(index);
  }

  calculateAbsDifference(index: number, i: number): boolean {
    return index + 1 == (i +1) * 2 || index + 1 == (i +1) * 2 + 1;
  }

}
