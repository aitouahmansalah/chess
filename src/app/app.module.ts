/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DialogModule } from '@angular/cdk/dialog';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SquareComponent } from './components/square/square.component';
import { SquareColorPipe } from './pipes/square-color.pipe';
// eslint-disable-next-line max-len
import { PromoteDialogComponent } from './components/promote-dialog/promote-dialog.component';
import { IndexComponent } from './platform/dashboard/index/index.component';
import { SidebarComponent } from './platform/dashboard/sidebar/sidebar.component';
import { SigninComponent } from './platform/signin/signin.component';
import { AppRoutingModule } from './app-routing.module';

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
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
