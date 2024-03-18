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
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './components/platform/profile/profile.component';
import { ProfileGridComponent } from './components/platform/profile/profile-grid/profile-grid.component';
import { PlayerInfoBoxComponent } from './components/platform/profile/player-info-box/player-info-box.component';
import { SignupComponent } from './components/platform/signup/signup.component';
import { GamesListComponent } from './components/platform/profile/games-list/games-list.component';
import { BlogComponent } from './components/platform/social/blog/blog.component';
import { BlogGridComponent } from './components/platform/social/blog/blog-grid/blog-grid.component';
import { BlogListComponent } from './components/platform/social/blog/blog-list/blog-list.component';
import { BlogPageComponent } from './components/platform/social/blog/blog-page/blog-page.component';
import { BlogPageGridComponent } from './components/platform/social/blog/blog-page/blog-page-grid/blog-page-grid.component';
import { BlogPostBoxComponent } from './components/platform/social/blog/blog-page/blog-page-grid/blog-post-box/blog-post-box.component';
import { BlogCommentSectionComponent } from './components/platform/social/blog/blog-page/blog-page-grid/blog-comment-section/blog-comment-section.component';

@NgModule({
  imports: [
    BrowserModule,
    DialogModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
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
    GamesListComponent,
    BlogComponent,
    BlogGridComponent,
    BlogListComponent,
    BlogPageComponent,
    BlogPageGridComponent,
    BlogPostBoxComponent,
    BlogCommentSectionComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
