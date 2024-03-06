/* eslint-disable max-len */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/platform/dashboard/index/index.component';
import { SigninComponent } from './components/platform/signin/signin.component';
import { GameOnlineComponent } from './components/platform/game-interface/game-online/game-online.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'game-online', component: GameOnlineComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
