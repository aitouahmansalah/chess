/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogModule } from '@angular/cdk/dialog';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SquareComponent } from './components/square/square.component';
import { SquareColorPipe } from './pipes/square-color.pipe';
import { PromoteDialogComponent } from './components/promote-dialog/promote-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexComponent } from './components/platform/dashboard/index/index.component';
import { SidebarComponent } from './components/platform/dashboard/sidebar/sidebar.component';
import { SigninComponent } from './components/platform/signin/signin.component';
import { GameOnlineComponent } from './components/platform/game-interface/game-online/game-online.component';
import { MainComponent } from './components/platform/dashboard/main/main.component';
import { GameOnlineBoardComponent } from './components/platform/game-interface/game-online/game-online-board/game-online-board.component';
import { MilisecondeToMinutePipe } from './pipes/miliseconde-to-minute.pipe';
import { OnlineSquareComponent } from './components/online-square/online-square.component';
import { OnlineBoardComponent } from './components/online-board/online-board.component';
import { EndgameDialogComponent } from './components/endgame-dialog/endgame-dialog.component';
import { InitialiseDialogComponent } from './components/initialise-dialog/initialise-dialog.component';
import { PanelTabsComponent } from './components/platform/game-interface/panel-tabs/panel-tabs.component';
import { PlayTabComponent } from './components/platform/game-interface/panel-tabs/play-tab/play-tab.component';
import { ChatTabComponent } from './components/platform/game-interface/panel-tabs/chat-tab/chat-tab.component';
import { ProfileComponent } from './components/platform/profile/profile.component';
import { ProfileGridComponent } from './components/platform/profile/profile-grid/profile-grid.component';
import { PlayerInfoBoxComponent } from './components/platform/profile/player-info-box/player-info-box.component';
import { SignupComponent } from './components/platform/signup/signup.component';

@NgModule({
  imports: [
    BrowserModule,
    DialogModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    SquareColorPipe,
    PromoteDialogComponent,
    IndexComponent,
    SidebarComponent,
    SigninComponent,
    MainComponent,
    GameOnlineComponent,
    GameOnlineBoardComponent,
    MilisecondeToMinutePipe,
    OnlineSquareComponent,
    OnlineBoardComponent,
    EndgameDialogComponent,
    InitialiseDialogComponent,
    PanelTabsComponent,
    PlayTabComponent,
    ChatTabComponent,
    ProfileComponent,
    ProfileGridComponent,
    PlayerInfoBoxComponent,
    SignupComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
