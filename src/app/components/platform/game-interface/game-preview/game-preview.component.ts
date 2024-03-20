/* eslint-disable max-len */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { EndgameDialogComponent } from 'src/app/components/endgame-dialog/endgame-dialog.component';
import { InitialiseDialogComponent } from 'src/app/components/initialise-dialog/initialise-dialog.component';
import { Colors } from 'src/app/models/colors.enum';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-game-preview',
  templateUrl: './game-preview.component.html',
  styleUrls: ['./game-preview.component.scss'],
})
export class GamePreviewComponent implements OnInit {
  gameStarted:Boolean = false;

  constructor(private gameService:OnlineGameService,
              private Dialog:Dialog) { }

  ngOnInit(): void {
    const dialog = this.Dialog.open(InitialiseDialogComponent);
    
    this.gameService.gameStarted.subscribe(started => {
      this.gameStarted = started ;
    if(started) dialog.close();
    })
  }
}
