/* eslint-disable max-len */
// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessboardComponent } from './platform/chessboard/chessboard.component';
import { SidebarComponent } from './platform/sidebar/sidebar.component';
import { UserAuthenticationComponent } from './platform/user-authentication/user-authentication.component';
import { GameHistoryComponent } from './platform/game-history/game-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/chessboard', pathMatch: 'full' },
  { path: 'chessboard', component: ChessboardComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: UserAuthenticationComponent },
  { path: 'history', component: GameHistoryComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
