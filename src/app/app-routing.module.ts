/* eslint-disable max-len */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/platform/dashboard/index/index.component';
import { SigninComponent } from './components/platform/signin/signin.component';
import { GameOnlineComponent } from './components/platform/game-interface/game-online/game-online.component';
import { ProfileComponent } from './components/platform/profile/profile.component';
import { SignupComponent } from './components/platform/signup/signup.component';
import { BlogComponent } from './components/platform/social/blog/blog.component';
import { BlogPageComponent } from './components/platform/social/blog/blog-page/blog-page.component';

const routes: Routes = [
  { path: '', component: IndexComponent},

  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'game-online', component: GameOnlineComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:user/:post', component: BlogPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
