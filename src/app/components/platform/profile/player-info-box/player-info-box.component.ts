import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'jv-player-info-box',
  templateUrl: './player-info-box.component.html',
  styleUrls: ['./player-info-box.component.scss']
})
export class PlayerInfoBoxComponent implements OnInit {

  @Input() user!:User

  @Input() isMe!:boolean

  constructor(private http : HttpClient,private auth:AuthService) { }

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

  follow(){
    const id = this.auth.user.id;
    this.http.patch(`http://localhost:3333/api/users/${this.user.username}/follow`,{id}).subscribe((user:any) => {
      console.log(user.message);
    })
  }

}
