import { Component, Inject ,OnInit} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { Pieces } from '../../models/pieces.enum';
import { Colors } from '../../models/colors.enum';

@Component({
  selector: 'jv-endgame-dialog',
  templateUrl: './endgame-dialog.component.html',
  styleUrls: ['./endgame-dialog.component.scss']
})
export class EndgameDialogComponent implements OnInit {

  winner : Colors;

  winnerBy: string;

  constructor(private dialogRef: DialogRef<Pieces>,
     @Inject(DIALOG_DATA) private data: { winner: Colors ,winnerBy:string })
     {
      this.winner = data.winner;
      this.winnerBy = data.winnerBy;
}


onNoClick(){
  this.dialogRef.close();
}


  ngOnInit(): void {
  }

}
