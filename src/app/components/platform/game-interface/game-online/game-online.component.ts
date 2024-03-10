/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { EndGameModalComponent } from '../end-game-modal/end-game-modal.component';

@Component({
  selector: 'jv-game-online',
  templateUrl: './game-online.component.html',
  styleUrls: ['./game-online.component.scss'],
  
})
export class GameOnlineComponent implements OnInit {
  constructor(public dialog:MatDialog){}
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  openDialog(){
    this.dialog.open(EndGameModalComponent,{
      width:'350px',
      height:'270px',
      data: "right click",
      panelClass: 'dialog',
    })
  }

  ngOnInit(): void {}
}
