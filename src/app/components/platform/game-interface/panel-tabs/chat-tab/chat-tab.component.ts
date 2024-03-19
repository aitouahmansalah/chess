import { Component, OnInit ,Input} from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'jv-chat-tab',
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.scss']
})
export class ChatTabComponent implements OnInit {

  user !: User

  oppositrUser !: User

  @Input() messages : {message : string , user : User , date : Date}[] = [];

  input : string = '';

  constructor(private auth:AuthService,private socket:SocketService) { }

  ngOnInit(): void {   
    this.user = this.auth.user;
}

send(){
  const user = this.auth.user;
  if(this.input){
  this.socket.emitMessage(this.input,user);
  this.input = '';
  
  }
}
}
