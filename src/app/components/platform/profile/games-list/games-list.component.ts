import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'jv-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  games:any = [];

  @Input() user!: User;

  constructor(private game:OnlineGameService,private auth:AuthService,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      const  username = params.get('username')!;
       this.auth.getUserFromName(username).subscribe(user =>{
      this.user = user;
      this.game.getPlayerGames(this.user.id).subscribe(games => {
      this.games = games;
      console.log(games);
    })
       })
    });
    
  }


}
