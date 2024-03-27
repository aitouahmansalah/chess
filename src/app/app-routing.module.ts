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
import { AuthGuard } from './auth.guard';
import { CreateBlogPageComponent } from './components/platform/social/blog/create-blog-page/create-blog-page.component';
import { GamePreviewComponent } from './components/platform/game-interface/game-preview/game-preview.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'login', component: SigninComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'game-online', component: GameOnlineComponent,canActivate:[AuthGuard] },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'blog', component: BlogComponent ,canActivate:[AuthGuard]},
  { path: 'blog/:user/:post', component: BlogPageComponent,canActivate:[AuthGuard] },
  { path: 'blog/create', component:CreateBlogPageComponent },
  { path: 'game-preview/:game-id', component:GamePreviewComponent },
  { path: 'game-computer', component:BoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
