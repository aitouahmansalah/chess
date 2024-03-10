/* eslint-disable max-len */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EndGameModalComponent } from './components/platform/game-interface/end-game-modal/end-game-modal.component';

@Component({
  selector: 'jv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public dialog:MatDialog){}
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  openDialog(){
    this.dialog.open(EndGameModalComponent,{
      width:'250px',
      data: "right click",
    })
  }
}
