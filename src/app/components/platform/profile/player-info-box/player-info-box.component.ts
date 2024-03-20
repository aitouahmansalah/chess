import { Component, OnInit,Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'jv-player-info-box',
  templateUrl: './player-info-box.component.html',
  styleUrls: ['./player-info-box.component.scss']
})
export class PlayerInfoBoxComponent implements OnInit {

  @Input() user!:User

  @Input() isMe!:boolean

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Process the selected file
      console.log('Selected file:', file);
      // You can also upload the file to your server here
    }
  }

}
