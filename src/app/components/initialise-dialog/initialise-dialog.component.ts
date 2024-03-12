import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-initialise-dialog',
  templateUrl: './initialise-dialog.component.html',
  styleUrls: ['./initialise-dialog.component.scss']
})
export class InitialiseDialogComponent implements OnInit {

  constructor(private dialogRef: DialogRef)
    {}


onNoClick(){
 this.dialogRef.close();
}

  ngOnInit(): void {
   
  }

}
