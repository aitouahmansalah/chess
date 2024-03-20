/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Colors } from 'src/app/models/colors.enum';
import { PreviewService } from 'src/app/services/preview.service';

@Component({
  selector: 'jv-game-preview-tabs',
  templateUrl: './game-preview-tabs.component.html',
  styleUrls: ['./game-preview-tabs.component.scss'],
})
export class GamePreviewTabsComponent implements OnInit{ 

  pgn : {whiteMove:string,blackMove:string}[] = [];

  index!: number;

  color!: Colors|undefined;


  constructor( private gameService:PreviewService,private route:ActivatedRoute) {}

ngOnInit(): void {
  this.gameService.gameStateSubject.subscribe(game => {
    this.pgn = this.gameService.pgn;
  });
  this.gameService.index.subscribe(index => {
    this.index = index;
    let state = this.gameService.gameStateSubject.value.history[index];
    this.color = state.state.get(state.to)?.[1];
    console.log(this.color,this.index);
  });
  this.route.paramMap.subscribe(params => {
    const gameId = params.get('game-id')!;
    this.gameService.getGame(gameId);
  })
}


  back(){
    
    const index = this.gameService.index.value -1 ;
    if(  index >= 0){
    this.gameService.index.next(index);
    this.gameService.playMoveSound();
    }
  }

  forward(){
    const index = this.gameService.index.value + 1;
    if(this.gameService.gameStateSubject.value.history.length > index){
    this.gameService.index.next(index);
    this.gameService.playMoveSound();
    }
  }

  calculateAbsDifference(index: number, i: number): boolean {
    return index + 1 == (i +1) * 2 || index + 1 == (i +1) * 2 + 1;
  }



}
