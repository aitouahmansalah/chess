import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-profile-grid',
  templateUrl: './profile-grid.component.html',
  styleUrls: ['./profile-grid.component.scss']
})
export class ProfileGridComponent implements OnInit {

  user !: User ;
  isMe!:boolean
  constructor(private auth:AuthService,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      const  username = params.get('username')!;
       this.auth.getUserFromName(username).subscribe(user =>{
        this.user = user;
        this.isMe = this.user.id == this.auth.user.id;
       })
    });
  }
 
}


