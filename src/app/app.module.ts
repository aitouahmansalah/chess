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
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
