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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

@NgModule({
  imports: [
    BrowserModule,
    DialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,

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
    GameOnlineBoardComponent,
    MilisecondeToMinutePipe,
    OnlineSquareComponent,
    OnlineBoardComponent,
    GameOnlineComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
